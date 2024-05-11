using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.ResetPassword;

public record ResetPasswordCommand(string TokenString, string Password)
    : IRequest<SuccessOr<Error>>;
