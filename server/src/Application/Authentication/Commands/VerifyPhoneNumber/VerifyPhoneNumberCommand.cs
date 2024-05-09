using System.Runtime.InteropServices.JavaScript;
using Domain.DomainErrors;
using Infrastructure.Authentication;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.VerifyPhoneNumber;

public record VerifyPhoneNumberCommand(int UserId, int Code) : IRequest<Result<Tokens, Error>>;
