using System;

namespace Core.Entities.OrderAggregate;

public class PaymentSummary
{
    public int last4 { get; set; }
    public required string brand { get; set; }
    public int ExpMonth { get; set; }
    public int ExpYear { get; set; }
}
