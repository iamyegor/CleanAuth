using Domain.DomainErrors;
using Domain.User.ValueObjects;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.AddPhoneNumber;

public record AddPhoneNumberCommand(UserId UserId, string PhoneNumber) : IRequest<SuccessOr<Error>>;
