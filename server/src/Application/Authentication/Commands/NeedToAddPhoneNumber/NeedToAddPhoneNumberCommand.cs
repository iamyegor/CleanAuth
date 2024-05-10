using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.NeedToAddPhoneNumber;

public record NeedToAddPhoneNumberCommand(UserId UserId) : IRequest<Result<bool, Error>>;
