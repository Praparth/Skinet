using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(ICartService cartService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
        {
            var cart = await cartService.GetCartAsync(id);
            return Ok(cart ?? new ShoppingCart { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart)
        {
            var UpdateCart = await cartService.SetCartAsync(cart);
            if (UpdateCart == null) return BadRequest("Problem with cart");
            return UpdateCart;
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCart(string Id)
        {
            var DeleteCart = await cartService.DeleteCartAsync(Id);
            if (!DeleteCart) return BadRequest("Problem Deleting cart");
            return Ok();
        }

    }
}
