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
    private readonly DomainSmsSender _domainSmsSender;

    public AddPhoneNumberCommandHandler(ApplicationContext context, DomainSmsSender domainSmsSender)
    {
        _context = context;
        _domainSmsSender = domainSmsSender;
    }

    public async Task<SuccessOr<Error>> Handle(AddPhoneNumberCommand command, CancellationToken ct)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        UserByPhoneNumberSpec spec = new UserByPhoneNumberSpec(command.PhoneNumber);
        User? userWithSamePhoneNumber = await _context.Query(spec, ct);

        if (userWithSamePhoneNumber != null)
        {
            if (userWithSamePhoneNumber.IsVerified)
            {
                return Errors.PhoneNumber.IsAlreadyTaken(command.PhoneNumber);
            }

            if (userWithSamePhoneNumber.Id != command.UserId)
            {
                _context.Remove(userWithSamePhoneNumber);
                await _context.SaveChangesAsync(ct);
            }
        }

        User user = (await _context.Query(new UserByIdSpec(command.UserId), ct))!;
        user.AddUnverifiedPhoneNumber(PhoneNumber.Create(command.PhoneNumber));
        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        await _domainSmsSender.SendAsync(
            user.PhoneNumber!.Value,
            user.PhoneNumberVerificationCode!.Value
        );

        return Result.Ok();
    }
}
