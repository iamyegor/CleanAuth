using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Queries.GetEmailForVerification;

public record GetEmailForVerificationQuery(UserId UserId) : IRequest<Result<string, Error>>;
