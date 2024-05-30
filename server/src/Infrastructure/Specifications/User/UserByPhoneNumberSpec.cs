namespace Infrastructure.Specifications.User;

public class UserByPhoneNumberSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _phoneNumber;

    public UserByPhoneNumberSpec(string phoneNumber)
    {
        _phoneNumber = phoneNumber;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user =>
            user.PhoneNumber != null && user.PhoneNumber.Value == _phoneNumber
        );
    }
}
