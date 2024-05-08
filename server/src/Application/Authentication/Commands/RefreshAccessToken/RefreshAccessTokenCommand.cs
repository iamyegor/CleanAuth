using Domain.DomainErrors;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.RefreshAccessToken;

public record RefreshAccessTokenCommand(string? RefreshToken) : IRequest<Result<Tokens, Error>>;