using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.AddPhoneNumber;
using Application.Authentication.Commands.ResendPhoneNumberVerificationCodeCommand;
using Application.Authentication.Commands.VerifyPhoneNumber;
using Application.Authentication.Queries.GetPhoneNumberForVerification;
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

[Authorize(AuthorizationPolicies.PhoneNumberNotVerified)]
[Authorize(AuthorizationPolicies.EmailVerified)]
[ApiController]
[Route("api/")]
public class PhoneNumberVerificationController : ApplicationController
{
    private readonly JwtClaims _jwtClaims;
    private readonly ISender _mediator;

    public PhoneNumberVerificationController(JwtClaims jwtClaims, ISender mediator)
    {
        _jwtClaims = jwtClaims;
        _mediator = mediator;
    }

    [HttpGet("need-to-add-phone-number")]
    public IActionResult NeedToAddPhoneNumber()
    {
        return Ok();
    }

    [HttpPost("add-phone-number")]
    public async Task<IActionResult> AddPhoneNumber(AddPhoneNumberDto dto)
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        AddPhoneNumberCommand command = new AddPhoneNumberCommand(userId, dto.PhoneNumber);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpGet("phone-number-for-verification")]
    public async Task<IActionResult> GetPhoneNumberForVerification()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        GetPhoneNumberForVerificationQuery query = new GetPhoneNumberForVerificationQuery(userId);
        Result<string, Error> result = await _mediator.Send(query);

        return FromResult(result);
    }

    [HttpPost("verify-phone-number")]
    public async Task<IActionResult> VerifyPhoneNumber(VerifyPhoneNumberDto dto)
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);
        Request.Cookies.TryGetValue(CookiesInfo.DeviceId.Name, out string? deviceId);

        VerifyPhoneNumberCommand command = new VerifyPhoneNumberCommand(userId, dto.Code, deviceId);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }

    [HttpPost("resend-phone-number-code")]
    public async Task<IActionResult> ResendPhoneNumberVerificationCode()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        var command = new ResendPhoneNumberVerificationCodeCommand(userId);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }
}
