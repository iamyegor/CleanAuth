using Domain.User.ValueObjects;

namespace Infrastructure.Specifications.User;

public class UserByIdSpec : ISingleSpecification<Domain.User.User>
{
    private readonly UserId _userId;

    public UserByIdSpec(UserId userId)
    {
        _userId = userId;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user => user.Id == _userId);
    }
}
