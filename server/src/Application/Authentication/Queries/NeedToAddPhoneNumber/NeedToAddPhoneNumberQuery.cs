using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Queries.NeedToAddPhoneNumber;

public record NeedToAddPhoneNumberQuery(UserId UserId) : IRequest<SuccessOr<Error>>;
