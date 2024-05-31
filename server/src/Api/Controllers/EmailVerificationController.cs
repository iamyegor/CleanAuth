using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.RequestEmailVerification;
using Application.Authentication.Commands.VerifyEmail;
using Application.Authentication.Queries.GetEmailForVerification;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Infrastructure.Cookies;
using Infrastructure.Cookies.Extensions;
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

    [HttpGet("email-for-verification"), Authorize(AuthorizationPolicies.EmailNotVerified)]
    public async Task<IActionResult> GetEmailForVerification()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        GetEmailForVerificationQuery query = new GetEmailForVerificationQuery(userId);
        Result<string, Error> emailOrError = await _mediator.Send(query);
        if (emailOrError.IsFailure)
        {
            return Problem(emailOrError.Error);
        }

        return Ok(new { Email = emailOrError.Value });
    }

    [HttpPost("request-email-verification-code"), Authorize(AuthorizationPolicies.EmailNotVerified)]
    public async Task<IActionResult> RequestEmailVerificationCode()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        var command = new RequestEmailVerificationCodeCommand(userId);
        SuccessOr<Error> emailOrError = await _mediator.Send(command);

        return FromResult(emailOrError);
    }

    [HttpPost("verify-email"), Authorize(AuthorizationPolicies.EmailNotVerified)]
    public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);
        Request.Cookies.TryGetValue(CookiesInfo.DeviceId.Name, out string? deviceId);

        VerifyEmailCommand command = new VerifyEmailCommand(userId, dto.Code, deviceId);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }
}
