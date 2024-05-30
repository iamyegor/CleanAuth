using Domain.User.ValueObjects;

namespace Infrastructure.Specifications.User;

public class VerifiedUserByIdSpec : ISingleSpecification<Domain.User.User>
{
    private readonly UserId _userId;

    public VerifiedUserByIdSpec(UserId userId)
    {
        _userId = userId;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user =>
            user.IsEmailVerified && user.IsPhoneNumberVerified && user.Id == _userId
        );
    }
}
