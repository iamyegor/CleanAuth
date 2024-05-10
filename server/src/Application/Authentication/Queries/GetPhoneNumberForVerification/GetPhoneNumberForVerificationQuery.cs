using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Queries.GetPhoneNumberForVerification;

public record GetPhoneNumberForVerificationQuery(UserId UserId) : IRequest<Result<string, Error>>;
