using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Sms;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.ResendPhoneNumber;

public class ResendPhoneNumberCommandHandler
    : IRequestHandler<ResendPhoneNumberCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly VerificationCodeSender _verificationCodeSender;

    public ResendPhoneNumberCommandHandler(
        ApplicationContext context,
        VerificationCodeSender verificationCodeSender
    )
    {
        _context = context;
        _verificationCodeSender = verificationCodeSender;
    }

    public async Task<SuccessOr<Error>> Handle(
        ResendPhoneNumberCommand command,
        CancellationToken cancellationToken
    )
    {
        User user = await _context.Users.SingleAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        if (user.PhoneNumber == null)
        {
            return Errors.User.NoPhoneNumber();
        }

        PhoneNumberVerificationCode code = new PhoneNumberVerificationCode();
        user.PhoneNumberVerificationCode = code;

        await _context.SaveChangesAsync(cancellationToken);
        await _verificationCodeSender.SendAsync(user.PhoneNumber.Value, code.Value);

        return Result.Ok();
    }
}
