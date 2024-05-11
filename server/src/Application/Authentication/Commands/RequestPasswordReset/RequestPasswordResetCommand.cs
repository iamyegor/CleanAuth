using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.RequestPasswordReset;

public record RequestPasswordResetCommand(string EmailOrLogin) : IRequest<SuccessOr<Error>>;
