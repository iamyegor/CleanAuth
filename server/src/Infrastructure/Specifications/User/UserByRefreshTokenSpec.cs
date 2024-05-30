namespace Infrastructure.Specifications.User;

public class UserByRefreshTokenSpec : ISingleSpecification<Domain.User.User>
{
    private readonly string? _refreshToken;
    private readonly Guid _deviceId;

    public UserByRefreshTokenSpec(string? refreshToken, Guid deviceId)
    {
        _refreshToken = refreshToken;
        _deviceId = deviceId;
    }

    public IQueryable<Domain.User.User> Apply(IQueryable<Domain.User.User> query)
    {
        return query.Where(user =>
            user.RefreshTokens.Any(rt => rt.Value == _refreshToken && rt.DeviceId == _deviceId)
        );
    }
}
