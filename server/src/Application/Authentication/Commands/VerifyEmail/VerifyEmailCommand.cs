using Domain.DomainErrors;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.VerifyEmail;

public record VerifyEmailCommand(string Email, int Code) : IRequest<Result<Tokens, Error>>;
