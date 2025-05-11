using System;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class ProductsController : ControllerBase
{
    private readonly StoreContext _context;

    public ProductsController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProduct()
    {
        return await _context.Product.ToListAsync();
    }

    [HttpGet("{id:int}")] // api/Product/2
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var Product = await _context.Product.FindAsync(id);
        if (Product == null) return NotFound();
        return Product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        _context.Product.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product");

        _context.Entry(product).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var Product = await _context.Product.FindAsync(id);
        if (Product == null) return NotFound();
        _context.Product.Remove(Product);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Product.Any(x => x.Id == id);
    }

}
