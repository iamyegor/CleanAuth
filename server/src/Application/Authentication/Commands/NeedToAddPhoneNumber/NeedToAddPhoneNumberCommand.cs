using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.NeedToAddPhoneNumber;

public record NeedToAddPhoneNumberCommand(int UserId) : IRequest<Result<bool, Error>>;
