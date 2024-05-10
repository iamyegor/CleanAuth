using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.ResendPhoneNumber;

public record ResendPhoneNumberCommand(UserId UserId) : IRequest<SuccessOr<Error>>;
