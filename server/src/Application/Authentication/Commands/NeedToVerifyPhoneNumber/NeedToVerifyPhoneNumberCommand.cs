using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.NeedToVerifyPhoneNumber;

public record NeedToVerifyPhoneNumberCommand(int UserId) : IRequest<Result<bool, Error>>;
