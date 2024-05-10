using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.ResendEmailCommand;

public record ResendEmailCommand(UserId UserId): IRequest<SuccessOr<Error>>;