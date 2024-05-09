using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Sms;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.AddPhoneNumber;

public class AddPhoneNumberCommandHandler : IRequestHandler<AddPhoneNumberCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly VerificationCodeSender _verificationCodeSender;

    public AddPhoneNumberCommandHandler(
        ApplicationContext context,
        VerificationCodeSender verificationCodeSender
    )
    {
        _context = context;
        _verificationCodeSender = verificationCodeSender;
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

        if (userWithSamePhoneNumber != null && userWithSamePhoneNumber.IsPhoneNumberVerified)
        {
            return Errors.PhoneNumber.AlreadyTaken(command.PhoneNumber);
        }

        User user = await _context.Users.SingleAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        user.PhoneNumber = PhoneNumber.Create(command.PhoneNumber);
        user.PhoneNumberVerificationCode = new PhoneNumberVerificationCode();

        await _context.SaveChangesAsync(cancellationToken);

        _verificationCodeSender.Send(
            user.PhoneNumber.Value,
            user.PhoneNumberVerificationCode.Value
        );

        return Result.Ok();
    }
}
