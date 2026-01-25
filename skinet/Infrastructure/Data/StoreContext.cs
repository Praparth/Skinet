using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class StoreContext : IdentityDbContext<AppUser>
{
    public StoreContext(DbContextOptions<StoreContext> options) : base(options) { }

    public DbSet<Product> Product { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<DeliveryMethod> DeliveryMethods { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product configuration
        modelBuilder.Entity<Product>(builder =>
        {
            builder.Property(x => x.Price).HasColumnType("decimal(18,2)");
            builder.Property(x => x.Name).IsRequired();
        });

        // Address ↔ AppUser one-to-one configuration
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasOne(u => u.Address)
                  .WithOne(a => a.AppUser)
                  .HasForeignKey<Address>(a => a.AppUserId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict); // avoid cascade delete errors
        });
        modelBuilder.Entity<Order>().OwnsOne(o => o.ShippingAddress);
        modelBuilder.Entity<Order>().OwnsOne(o => o.PaymentSummary);
        modelBuilder.Entity<OrderItem>().OwnsOne(oi => oi.ItemOrdered);
    }
}
