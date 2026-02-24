using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification : BaseSpecification<Order>
{
    public OrderSpecification(string email)
        : base(x => x.BuyerEmail == email)
    {
        AddIncludes();
        AddOrderByDescending(o => o.orderDate);
    }

    public OrderSpecification(string email, int id)
        : base(x => x.BuyerEmail == email && x.Id == id)
    {
        AddIncludes();
    }

    public OrderSpecification(string paymentIntentId , bool isPaymentIntent)
        : base(x => x.PaymetnIntentId == paymentIntentId)
    {
        AddIncludes();
    }

    private void AddIncludes()
    {
        AddInclude(o => o.DeliveryMethod);
        AddInclude(o => o.OrderItems);
        AddInclude(o => o.PaymentSummary);
        AddInclude(o => o.ShippingAddress);

        // Correct nested include
        AddInclude("OrderItems.ItemOrdered");
        AddInclude("DeliveryMethod");
    }

}
