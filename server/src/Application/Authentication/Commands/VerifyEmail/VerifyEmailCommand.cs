using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.VerifyEmail;

public record VerifyEmailCommand(UserId UserId, int Code) : IRequest<Result<Tokens, Error>>;
