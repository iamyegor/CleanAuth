using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Queries.EmailForVerification;

public record GetEmailForVerificationQuery(int UserId) : IRequest<Result<string, Error>>;
