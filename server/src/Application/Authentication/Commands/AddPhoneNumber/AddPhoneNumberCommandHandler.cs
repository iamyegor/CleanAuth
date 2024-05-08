using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.AddPhoneNumber;

public class AddPhoneNumberCommandHandler : IRequestHandler<AddPhoneNumberCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;

    public AddPhoneNumberCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<SuccessOr<Error>> Handle(
        AddPhoneNumberCommand command,
        CancellationToken cancellationToken
    )
    {
        User? userWithSamePhoneNumber = await _context.Users.SingleOrDefaultAsync(
            u => u.PhoneNumber != null && u.PhoneNumber.Value == command.PhoneNumber,
            cancellationToken: cancellationToken
        );

        if (userWithSamePhoneNumber != null)
        {
            return Errors.PhoneNumber.AlreadyTaken(command.PhoneNumber);
        }

        User user = await _context.Users.SingleAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        user.PhoneNumber = PhoneNumber.Create(command.PhoneNumber);

        return Result.Ok();
    }
}
