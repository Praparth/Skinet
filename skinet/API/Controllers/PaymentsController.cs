using API.Extensions;
using API.SingalR;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController(IPaymentService paymentService,
        IUnitOfWork _unit, ILogger<PaymentsController> _logger , IConfiguration _config,
        IHubContext<NotificationHub> _hubContext) : BaseApiController
    {
        private readonly string _WhSecret = _config["StripeSettings:WhSecret"]! ;

        [Authorize]
        [HttpPost("{cardId}")]
        public async Task<ActionResult<ShoppingCart>> CreateOrUpdatePaymentIntent(string cardId)
        {
            var cart = await paymentService.CreateOrUpdatePaymentIntent(cardId);
            if (cart == null) return BadRequest("Problem with your cart");
            return Ok(cart);
        }

        [HttpGet("delivery-methods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _unit.Repository<DeliveryMethod>().ListAllAsync());
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = ConstructStripeEvent(json);
                if (stripeEvent.Data.Object is not PaymentIntent intent)
                {
                    return BadRequest("Invalid event data");
                }
                await HandlePaymentIntentSucceeded(intent);
                return Ok();
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe webhook error: {Message}", ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred ");
            }
        }

        private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
        {
            if (intent.Status == "succeeded")
            {
                var spec = new OrderSpecification(intent.Id, true);
                var order = await _unit.Repository<Order>().GetEntityWithSpec(spec)
                    ?? throw new Exception($"Order not found");

                if ((long)order.GetTotal() * 100 != intent.Amount)
                {
                    order.Status = OrderStatus.paymentMismatch;
                }
                else
                {
                    order.Status = OrderStatus.paymentReceived;
                }

                await _unit.Complete();

                var connectionId = NotificationHub.GetconnectionIdByEmail(order.BuyerEmail);
                if (!string.IsNullOrEmpty(connectionId))
                {
                    await _hubContext.Clients.Client(connectionId).
                            SendAsync("OrderCompletedNotification" , order.ToDto());
                }
            }
        }

        private Event ConstructStripeEvent(string json)
        {
            try
            {
                return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _WhSecret);
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to construct Stripe event");
                throw new StripeException("Invalid Signature");
            }
        }
    }
}
