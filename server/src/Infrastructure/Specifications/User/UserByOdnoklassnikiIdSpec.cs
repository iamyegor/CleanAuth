namespace Infrastructure.Specifications.User;

public class UserByOdnoklassnikiIdSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _odnoklassnikiId;

    public UserByOdnoklassnikiIdSpec(string odnoklassnikiId)
    {
        _odnoklassnikiId = odnoklassnikiId;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(u => u.OdnoklassnikiUserId == _odnoklassnikiId);
    }
}
