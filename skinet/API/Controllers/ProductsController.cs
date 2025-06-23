using System;
using API.RequestHelpers;
using Core;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> _repo) : BaseApiController
{
    
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProduct([FromQuery] ProductspecParmas specParams)
    {
        var spec = new ProductSpecification(specParams);
        return await CreatePageResult(_repo , spec , specParams.PageIndex , specParams.PageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product == null) return NotFound();
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        _repo.Add(product);
        if (await _repo.SaveAllAsync())
        {
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }
        return BadRequest("Problem Creating Product");
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product");

        _repo.Update(product);
        if (await _repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Problem updating the Product");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product == null) return NotFound();

        _repo.Remove(product);
        if (await _repo.SaveAllAsync())
        {
            return NoContent();
        }
        return BadRequest("Problem deleting the Product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecifications();
        return Ok(await _repo.ListAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await _repo.ListAsync(spec));
    }

    private bool ProductExists(int id)
    {
        return _repo.Exists(id);
    }
}
