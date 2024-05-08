using Domain.DomainErrors;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.AddPhoneNumber;

public record AddPhoneNumberCommand(int UserId, string PhoneNumber) : IRequest<SuccessOr<Error>>;
