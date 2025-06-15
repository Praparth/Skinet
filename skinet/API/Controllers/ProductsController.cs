using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repo;

    public ProductsController(IProductRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProduct(string? brands , string? types ,string? sort)
    {
        return Ok(await _repo.GetProductsAsync(brands , types , sort));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _repo.GetProductByIdAsync(id);
        if (product == null) return NotFound();
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        _repo.AddProduct(product);
        if (await _repo.SaveChangesAsync())
        {
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }
        return BadRequest("Problem Creating Product");
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !_repo.ProductExists(id))
            return BadRequest("Cannot update this product");

        _repo.UpdateProduct(product);
        if (await _repo.SaveChangesAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem updating the Product");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _repo.GetProductByIdAsync(id);
        if (product == null) return NotFound();

        _repo.DeleteProduct(product);
        if (await _repo.SaveChangesAsync())
        {
            return NoContent();
        }
        return BadRequest("Problem deleting the Product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        return Ok(await _repo.GetBrandsAsync());
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        return Ok(await _repo.GetTypesAsync());
    }

    private bool ProductExists(int id)
    {
        return _repo.ProductExists(id);
    }
}
