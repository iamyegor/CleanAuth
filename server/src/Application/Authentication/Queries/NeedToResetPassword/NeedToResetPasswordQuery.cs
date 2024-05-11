using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Queries.NeedToResetPassword;

public record NeedToResetPasswordQuery(string Token) : IRequest<SuccessOr<Error>>;
