using Application.Authentication.Commands.NeedToAddPhoneNumber;
using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.NeedToVerifyPhoneNumber;

public class NeedToVerifyPhoneNumberCommandHandler
    : IRequestHandler<NeedToAddPhoneNumberCommand, Result<bool, Error>>
{
    private readonly ApplicationContext _context;

    public NeedToVerifyPhoneNumberCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<Result<bool, Error>> Handle(
        NeedToAddPhoneNumberCommand command,
        CancellationToken cancellationToken
    )
    {
        User user = await _context.Users.SingleAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        return user.PhoneNumber != null;
    }
}
