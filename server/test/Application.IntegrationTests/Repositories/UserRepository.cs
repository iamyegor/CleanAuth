using Application.IntegrationTests.Base;
using Domain.User;
using Domain.User.ValueObjects;

namespace Application.IntegrationTests.Repositories;

public class UserRepository
{
    public User QueryUserByLogin(string login)
    {
        using (var context = DbContextProvider.Create())
        {
            return context.Users.Single(u => u.Login != null && u.Login.Value == login);
        }
    }

    public User QueryUserById(UserId userId)
    {
        using (var context = DbContextProvider.Create())
        {
            return context.Users.Single(u => u.Id == userId);
        }
    }

    public User QueryUserByEmail(string email)
    {
        using (var context = DbContextProvider.Create())
        {
            return context.Users.Single(u => u.Email.Value == email);
        }
    }
}
