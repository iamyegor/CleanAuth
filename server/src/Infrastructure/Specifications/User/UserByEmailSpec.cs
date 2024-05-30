namespace Infrastructure.Specifications.User;

public class UserByEmailSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _email;

    public UserByEmailSpec(string email)
    {
        _email = email;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(x => x.Email.Value == _email);
    }
}
