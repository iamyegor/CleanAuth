using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Sms;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.ResendPhoneNumberVerificationCodeCommand;

public record ResendPhoneNumberVerificationCodeCommand(UserId UserId) : IRequest<SuccessOr<Error>>;

public class ResendPhoneNumberVerificationCodeCommandHandler
    : IRequestHandler<ResendPhoneNumberVerificationCodeCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly DomainSmsSender _domainSmsSender;

    public ResendPhoneNumberVerificationCodeCommandHandler(
        ApplicationContext context,
        DomainSmsSender domainSmsSender
    )
    {
        _context = context;
        _domainSmsSender = domainSmsSender;
    }

    public async Task<SuccessOr<Error>> Handle(
        ResendPhoneNumberVerificationCodeCommand command,
        CancellationToken ct
    )
    {
        User user = (await _context.Query(new UserByIdSpec(command.UserId), ct))!;
        if (user.PhoneNumber == null)
        {
            return Errors.User.HasNoPhoneNumber(command.UserId);
        }

        PhoneNumberVerificationCode code = new PhoneNumberVerificationCode(new DateTimeProvider());
        user.PhoneNumberVerificationCode = code;

        await _context.SaveChangesAsync(ct);
        await _domainSmsSender.SendAsync(user.PhoneNumber.Value, code.Value);

        return Result.Ok();
    }
}
