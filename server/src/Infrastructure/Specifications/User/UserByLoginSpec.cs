namespace Infrastructure.Specifications.User;

public class UserByLoginSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _login;

    public UserByLoginSpec(string login)
    {
        _login = login;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user => user.Login != null && user.Login.Value == _login);
    }
}
