using System;
using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services;

public class CartService(IConnectionMultiplexer redis) : ICartService
{
    private readonly IDatabase _database = redis.GetDatabase();

    public async Task<bool> DeleteCartAsync(string Key)
    {
        return await _database.KeyDeleteAsync(Key);
    }

    public async Task<ShoppingCart?> GetCartAsync(string Key)
    {
        var Data = await _database.StringGetAsync(Key);
        return Data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<ShoppingCart>(Data!);
    }

    public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
    {
        var created = await _database.StringSetAsync(cart.Id,
                      JsonSerializer.Serialize(cart), TimeSpan.FromDays(30));
        if (!created) return null;

        return await GetCartAsync(cart.Id);             
    }
}
