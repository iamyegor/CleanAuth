using Domain.DomainErrors;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.LogIn;

public record LogInCommand(string LoginOrEmail, string Password) : IRequest<Result<Tokens, Error>>;
