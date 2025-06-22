using System;
using Core.Entities;
using Core.Specifications;

namespace Core;

public class BrandListSpecifications : BaseSpecification<Product ,string>
{
    public BrandListSpecifications()
    {
        AddSelect(x => x.Brand);
        ApplyDistinct();
    }
}
