using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.VerifyPhoneNumber;

public record VerifyPhoneNumberCommand(UserId UserId, int Code, string? DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class VerifyPhoneNumberCommandHandler
    : IRequestHandler<VerifyPhoneNumberCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;

    public VerifyPhoneNumberCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
    }

    public async Task<Result<Tokens, Error>> Handle(
        VerifyPhoneNumberCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context.Query(new UserByIdSpec(command.UserId), ct);
        if (user == null || user.PhoneNumberVerificationCode?.Value != command.Code)
        {
            return Errors.PhoneNumberVerificationCode.IsInvalid();
        }

        if (user.PhoneNumberVerificationCode!.IsExpired)
        {
            return Errors.PhoneNumberVerificationCode.IsExpired();
        }

        user.VerifyPhoneNumber();

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);

        await _context.SaveChangesAsync(ct);

        return tokens;
    }
}
