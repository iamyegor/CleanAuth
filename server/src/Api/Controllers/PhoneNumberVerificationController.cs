using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.AddPhoneNumber;
using Application.Authentication.Commands.NeedToAddPhoneNumber;
using Application.Authentication.Commands.NeedToVerifyPhoneNumber;
using Application.Authentication.Commands.VerifyPhoneNumber;
using Domain.DomainErrors;
using Infrastructure.Authentication;
using Infrastructure.Authentication.Extensions;
using Mapster;
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

    [HttpGet("need-to-add-phone-number"), Authorize(PoliciyNames.PhoneNumberNotVerified)]
    public async Task<IActionResult> NeedToAddPhoneNumber()
    {
        int userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        NeedToAddPhoneNumberCommand command = new NeedToAddPhoneNumberCommand(userId);
        Result<bool, Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpPost("add-phone-number"), Authorize(PoliciyNames.EmailVerified)]
    public async Task<IActionResult> AddPhoneNumber(AddPhoneNumberDto dto)
    {
        int userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        AddPhoneNumberCommand command = (userId, dto).Adapt<AddPhoneNumberCommand>();
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpGet("need-to-verify-phone-number"), Authorize(PoliciyNames.PhoneNumberNotVerified)]
    public async Task<IActionResult> NeedToVerifyPhoneNumber()
    {
        int userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        NeedToVerifyPhoneNumberCommand command = new NeedToVerifyPhoneNumberCommand(userId);
        Result<bool, Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpPost("verify-phone-number"), Authorize(PoliciyNames.EmailVerified)]
    public async Task<IActionResult> VerifyPhoneNumber(VerifyPhoneNumberDto dto)
    {
        int userId = _jwtClaims.GetUserIdFromCookieJwt(Request.Cookies);

        VerifyPhoneNumberCommand command = (userId, dto).Adapt<VerifyPhoneNumberCommand>();
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }
}
