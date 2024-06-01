namespace Infrastructure.Specifications.User;

public class UserByVkIdSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string _vkId;

    public UserByVkIdSpec(string vkId)
    {
        _vkId = vkId;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user => user.VkUserId == _vkId);
    }
}
