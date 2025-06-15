using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ProductRepository : IProductRepository
{
    private readonly StoreContext _context;

    public ProductRepository(StoreContext context)
    {
        _context = context;
    }

    public void AddProduct(Product product)
    {
        _context.Product.Add(product);
    }

    public void DeleteProduct(Product product)
    {
        _context.Product.Remove(product);
    }

    public async Task<IReadOnlyList<string>> GetBrandsAsync()
    {
        return await _context.Product.Select(x => x.Brand)
            .Distinct()
            .ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _context.Product.FindAsync(id);
    }

    public async Task<IReadOnlyList<Product>> GetProductsAsync(string? brands , string? types,string? sort)
    {
        var query = _context.Product.AsQueryable();

        if (!string.IsNullOrWhiteSpace(brands))
            query = query.Where(x => x.Brand == brands);

        if (!string.IsNullOrWhiteSpace(types))
            query = query.Where(x => x.Type == types);



        query = sort switch
        {
            "priceAsc" => query.OrderBy(x => x.Price),
            "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name)
        };

        return await query.ToListAsync();
    }

    public async Task<IReadOnlyList<string>> GetTypesAsync()
    {
        return await _context.Product.Select(x => x.Type)
            .Distinct()
            .ToListAsync();
    }

    public bool ProductExists(int id)
    {
        return _context.Product.Any(x => x.Id == id);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void UpdateProduct(Product product)
    {
        _context.Entry(product).State = EntityState.Modified;
    }
}
