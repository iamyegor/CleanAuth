namespace Infrastructure.Specifications.User;

public class VerifiedUserByEmailOrLoginSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _emailOrLogin;

    public VerifiedUserByEmailOrLoginSpec(string emailOrLogin)
    {
        _emailOrLogin = emailOrLogin;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user =>
            user.IsEmailVerified
            && user.IsPhoneNumberVerified
            && user.Login != null
            && (user.Email.Value == _emailOrLogin || user.Login.Value == _emailOrLogin)
        );
    }
}
