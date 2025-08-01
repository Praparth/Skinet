using System;
using Core.Interfaces;
using System.Linq.Expressions;

namespace Core.Specifications;

public class BaseSpecification<T>(Expression<Func<T, bool>>? _critera) : ISpecification<T>
{
    protected BaseSpecification() : this(null) { }
    public Expression<Func<T, bool>>? Criteria => _critera;

    public Expression<Func<T, object>>? OrderBy { get; private set; }

    public Expression<Func<T, object>>? OrderByDescending { get; private set; }

    public bool IsDistinct { get; private set; }

    public int Take { get; private set; }

    public int Skip { get; private set; }

    public bool IsPagingEnabled { get; private set; }

    public IQueryable<T> ApplyCriteria(IQueryable<T> query)
    {
        if (Criteria != null)
        {
            query = query.Where(Criteria);
        }
        return query;
    }

    protected void AddOrderBy(Expression<Func<T, object>> orderByExperssion)
    {
        OrderBy = orderByExperssion;
    }

    protected void AddOrderByDescending(Expression<Func<T, object>> orderByExperssion)
    {
        OrderByDescending = orderByExperssion;
    }

    protected void ApplyDistinct()
    {
        IsDistinct = true;
    }

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }
}

public class BaseSpecification<T, TResult>(Expression<Func<T, bool>> criteria) : BaseSpecification<T>(criteria), ISpecification<T, TResult>
{
    protected BaseSpecification() : this(null!) {}
    public Expression<Func<T, TResult>>? Select { get; private set; }

    protected void AddSelect(Expression<Func<T, TResult>> SelectExpression)
    {
        Select = SelectExpression;    
    }
}