using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Sms;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.AddPhoneNumber;

public record AddPhoneNumberCommand(UserId UserId, string PhoneNumber) : IRequest<SuccessOr<Error>>;

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

    public async Task<SuccessOr<Error>> Handle(AddPhoneNumberCommand command, CancellationToken ct)
    {
        UserByPhoneNumberSpec spec = new UserByPhoneNumberSpec(command.PhoneNumber);
        User? userWithSamePhoneNumber = await _context.Query(spec, ct);

        if (userWithSamePhoneNumber != null)
        {
            if (userWithSamePhoneNumber is { IsPhoneNumberVerified: true, IsEmailVerified: true })
            {
                return Errors.PhoneNumber.IsAlreadyTaken(command.PhoneNumber);
            }

            if (userWithSamePhoneNumber.Id != command.UserId)
            {
                userWithSamePhoneNumber.ClearPhoneNumber();
                await _context.SaveChangesAsync(ct);
            }
        }

        User user = (await _context.Query(new UserByIdSpec(command.UserId), ct))!;
        user.AddUnverifiedPhoneNumber(PhoneNumber.Create(command.PhoneNumber));
        await _context.SaveChangesAsync(ct);

        // await _verificationCodeSender.SendAsync(
        //     user.PhoneNumber!.Value,
        //     user.PhoneNumberVerificationCode!.Value
        // );

        return Result.Ok();
    }
}
