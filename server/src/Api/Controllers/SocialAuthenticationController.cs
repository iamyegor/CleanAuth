using Api.Controllers.Common;
using Api.Dtos;
using Application.SocialAuthentication.Command.AddLogin;
using Application.SocialAuthentication.Command.SingInWithGoogle;
using Application.SocialAuthentication.Queries.CanAddUsername;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Authorization;
using Infrastructure.Cookies;
using Infrastructure.Cookies.Extensions;
using Infrastructure.SocialAuthentication;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("api")]
public class SocialAuthenticationController : ApplicationController
{
    private readonly ISender _mediator;
    private readonly CookiesInfoExtractor _cookiesInfoExtractor;

    public SocialAuthenticationController(
        ISender mediator,
        CookiesInfoExtractor cookiesInfoExtractor
    )
    {
        _mediator = mediator;
        _cookiesInfoExtractor = cookiesInfoExtractor;
    }

    [HttpPost("google-signin")]
    public async Task<IActionResult> SignInWithGoogle(GoogleSignInDto dto)
    {
        Request.Cookies.TryGetValue(CookiesInfo.DeviceId.Name, out var deviceId);
        SignInWithGoogleCommand command = new SignInWithGoogleCommand(dto.IdToken, deviceId);

        Result<SocialAuthResult, Error> result = await _mediator.Send(command);
        if (result.IsFailure)
        {
            return Problem(result.Error);
        }

        Response.Cookies.Append(result.Value.Tokens);

        return Ok(new { result.Value.AuthStatus.Status });
    }

    [HttpGet("can-add-login"), Authorize(AuthorizationPolicies.EmailVerified)]
    public async Task<IActionResult> CanAddUsername()
    {
        Result<UserId, Error> userIdOrError = _cookiesInfoExtractor.ExtractUserId(Request.Cookies);
        if (userIdOrError.IsFailure)
        {
            return Problem(userIdOrError.Error);
        }

        CanAddUsernameQuery query = new CanAddUsernameQuery(userIdOrError.Value);

        SuccessOr<Error> result = await _mediator.Send(query);

        return FromResult(result);
    }

    [HttpPost("add-login"), Authorize(AuthorizationPolicies.EmailVerified)]
    public async Task<IActionResult> AddLogin(AddLoginDto dto)
    {
        Result<UserId, Error> userIdOrError = _cookiesInfoExtractor.ExtractUserId(Request.Cookies);
        if (userIdOrError.IsFailure)
        {
            return Problem(userIdOrError.Error);
        }

        AddLoginCommand command = new AddLoginCommand(userIdOrError.Value, dto.Login);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }
}
