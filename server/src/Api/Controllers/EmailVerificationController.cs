using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.ResendEmailCommand;
using Application.Authentication.Commands.VerifyEmail;
using Application.Authentication.Queries.GetEmailForVerification;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Authentication.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("api")]
public class EmailVerificationController : ApplicationController
{
    private readonly JwtClaims _jwtClaims;
    private readonly ISender _mediator;

    public EmailVerificationController(JwtClaims jwtClaims, ISender mediator)
    {
        _jwtClaims = jwtClaims;
        _mediator = mediator;
    }

    [HttpGet("email-for-verification"), Authorize(PoliciyNames.EmailNotVerified)]
    public async Task<IActionResult> GetEmailForVerification()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        GetEmailForVerificationQuery query = new GetEmailForVerificationQuery(userId);
        Result<string, Error> emailOrError = await _mediator.Send(query);

        return FromResult(emailOrError);
    }

    [HttpPost("verify-email"), Authorize(PoliciyNames.EmailNotVerified)]
    public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);
        Request.Cookies.TryGetValue(Cookies.DeviceId.Name, out string? deviceId);

        VerifyEmailCommand command = new VerifyEmailCommand(userId, dto.Code, deviceId);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }

    [HttpPost("resend-email-code"), Authorize(PoliciyNames.EmailNotVerified)]
    public async Task<IActionResult> ResendEmail()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        ResendEmailCommand command = new ResendEmailCommand(userId);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }
}
