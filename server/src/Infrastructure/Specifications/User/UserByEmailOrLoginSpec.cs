namespace Infrastructure.Specifications.User;

public class UserByEmailOrLoginSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _email;
    private readonly string _login;

    public UserByEmailOrLoginSpec(string login, string email)
    {
        _login = login;
        _email = email;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user =>
            user.Login != null && (user.Login.Value == _login || user.Email.Value == _email)
        );
    }
}
