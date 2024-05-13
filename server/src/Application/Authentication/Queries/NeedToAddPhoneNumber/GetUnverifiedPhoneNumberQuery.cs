using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Queries.NeedToAddPhoneNumber;

public record GetUnverifiedPhoneNumberQuery(UserId UserId) : IRequest<Result<string, Error>>;
