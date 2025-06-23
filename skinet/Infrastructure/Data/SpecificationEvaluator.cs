using System;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class SpecificationEvaluator<T> where T : BaseEntity
{
    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> spac)
    {
        if (spac.Criteria != null)
        {
            query = query.Where(spac.Criteria); // x => x.Brand == brand 
        }

        if (spac.OrderBy != null)
        {
            query = query.OrderBy(spac.OrderBy);
        }

        if (spac.OrderByDescending != null)
        {
            query = query.OrderByDescending(spac.OrderByDescending);
        }

        if (spac.IsDistinct)
        {
            query = query.Distinct();
        }

        if (spac.IsPagingEnabled)
        {
            query = query.Skip(spac.Skip).Take(spac.Take);
        }

        return query;
    }

    public static IQueryable<TResult> GetQuery<TSpec , TResult>(IQueryable<T> query, ISpecification<T,TResult> spac)
    {
        if (spac.Criteria != null)
        {
            query = query.Where(spac.Criteria); // x => x.Brand == brand 
        }

        if (spac.OrderBy != null)
        {
            query = query.OrderBy(spac.OrderBy);
        }

        if (spac.OrderByDescending != null)
        {
            query = query.OrderByDescending(spac.OrderByDescending);
        }

        var SelectQuery = query as IQueryable<TResult>;

        if (spac.Select != null)
        {
            SelectQuery = query.Select(spac.Select);
        }

        if (spac.IsDistinct)
        {
            SelectQuery = SelectQuery?.Distinct();
        }

        if (spac.IsPagingEnabled)
        {
            SelectQuery = SelectQuery.Skip(spac.Skip).Take(spac.Take);
        }


        return SelectQuery ?? query.Cast<TResult>();
    }
}
