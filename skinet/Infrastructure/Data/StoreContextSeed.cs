using System;
using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context)
    {
        if (!context.Product.Any())
        {
            var ProductData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");
            var products = JsonSerializer.Deserialize<List<Product>>(ProductData);

            if (products == null) return;

            context.Product.AddRange(products);

            await context.SaveChangesAsync();

        }
    }
}
