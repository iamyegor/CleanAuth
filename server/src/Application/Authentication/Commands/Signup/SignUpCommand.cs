using Domain.DomainErrors;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.Signup;

public record SignUpCommand(string Login, string Email, string Password)
    : IRequest<Result<Tokens, Error>>;
