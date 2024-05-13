using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.AddPhoneNumber;
using Application.Authentication.Commands.ResendPhoneNumber;
using Application.Authentication.Commands.VerifyPhoneNumber;
using Application.Authentication.Queries.GetPhoneNumberForVerification;
using Application.Authentication.Queries.GetUnverifiedPhoneNumber;
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

    [HttpHead("get-unverified-phone-number"), Authorize(PoliciyNames.PhoneNumberNotVerified)]
    public async Task<IActionResult> GetUnverifiedPhoneNumber()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        GetUnverifiedPhoneNumberQuery query = new GetUnverifiedPhoneNumberQuery(userId);
        string result = await _mediator.Send(query);

        return Ok(new { PhoneNumber = result });
    }

    [HttpPost("add-phone-number"), Authorize(PoliciyNames.EmailVerified)]
    public async Task<IActionResult> AddPhoneNumber(AddPhoneNumberDto dto)
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        AddPhoneNumberCommand command = new AddPhoneNumberCommand(userId, dto.PhoneNumber);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpGet("phone-number-for-verification"), Authorize(PoliciyNames.PhoneNumberNotVerified)]
    public async Task<IActionResult> GetPhoneNumberForVerification()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        GetPhoneNumberForVerificationQuery query = new GetPhoneNumberForVerificationQuery(userId);
        Result<string, Error> result = await _mediator.Send(query);

        return FromResult(result);
    }

    [HttpPost("verify-phone-number"), Authorize(PoliciyNames.EmailVerified)]
    public async Task<IActionResult> VerifyPhoneNumber(VerifyPhoneNumberDto dto)
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        VerifyPhoneNumberCommand command = new VerifyPhoneNumberCommand(userId, dto.Code);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }

    [HttpPost("resend-phone-number-code"), Authorize(PoliciyNames.PhoneNumberNotVerified)]
    public async Task<IActionResult> ResendPhoneNumber()
    {
        UserId userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        ResendPhoneNumberCommand command = new ResendPhoneNumberCommand(userId);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }
}
