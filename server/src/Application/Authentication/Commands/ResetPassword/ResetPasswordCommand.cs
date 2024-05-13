using Domain.DomainErrors;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.ResetPassword;

public record ResetPasswordCommand(string UserId, string TokenString, string Password)
    : IRequest<Result<Tokens, Error>>;
