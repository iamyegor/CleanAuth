using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.SocialAuthentication.Command.AddLogin;

public record AddLoginCommand(UserId UserId, string Login) : IRequest<SuccessOr<Error>>;

public class AddLoginCommandHandler : IRequestHandler<AddLoginCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;

    public AddLoginCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<SuccessOr<Error>> Handle(AddLoginCommand command, CancellationToken ct)
    {
        User user = (await _context.Query(new UserByIdSpec(command.UserId), ct))!;
        if (user.AuthType == AuthType.Standard || user.Login != null)
        {
            return Errors.Login.CanNotBeAdded();
        }

        user.Login = Login.Create(command.Login);
        await _context.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
