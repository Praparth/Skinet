using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _config;
    private readonly ICartService _cartService;
    private readonly IUnitOfWork _unit;
    public PaymentService(IConfiguration config, ICartService cartService, IUnitOfWork unit)
    {
        _config = config;
        _cartService = cartService;
        _unit = unit;
    }
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cardId)
    {
        StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
        var cart = await _cartService.GetCartAsync(cardId);
        if (cart == null) return null;
        var shippingPrice = 0m;
        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await _unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod == null) return null;
            shippingPrice = deliveryMethod.Price;
        }
        foreach (var item in cart.Items)
        {
            var product = await _unit.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);
            if (product == null) return null;
            if (item.Price != product.Price)
            {
                item.Price = product.Price;
            }
        }

        var service = new PaymentIntentService();
        PaymentIntent? intent = null;

        if(string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)(shippingPrice * 100),
                Currency = "usd",
                 PaymentMethodTypes = new List<string> { "card" } 
            };
            intent = await service.CreateAsync(options);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)(shippingPrice * 100),
            };
            intent =  await service.UpdateAsync(cart.PaymentIntentId, options);
        }
        await _cartService.SetCartAsync(cart);
        return cart;
    }
}
