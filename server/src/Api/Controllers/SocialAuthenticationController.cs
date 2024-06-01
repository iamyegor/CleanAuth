using Api.Controllers.Common;
using Api.Dtos;
using Application.SocialAuthentication.Command.AddLogin;
using Application.SocialAuthentication.Command.AddLoginAndEmail;
using Application.SocialAuthentication.Command.SignInWithOdnoklassniki;
using Application.SocialAuthentication.Command.SignInWithVk;
using Application.SocialAuthentication.Command.SingInWithGoogle;
using Application.SocialAuthentication.Queries.CanAddLogin;
using Application.SocialAuthentication.Queries.CanAddLoginAndEmailQuery;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Authorization;
using Infrastructure.Cookies;
using Infrastructure.Cookies.Extensions;
using Infrastructure.SocialAuthentication;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Extensions;
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

    public IActionResult FromSocialAuthResult(Result<SocialAuthResult, Error> result)
    {
        if (result.IsFailure)
        {
            return Problem(result.Error);
        }

        Response.Cookies.Append(result.Value.Tokens);

        return Ok(new { AuthStatus = result.Value.AuthStatus.GetDisplayName() });
    }

    [HttpPost("google-signin")]
    public async Task<IActionResult> SignInWithGoogle(GoogleSignInDto dto)
    {
        Request.Cookies.TryGetValue(CookiesInfo.DeviceId.Name, out var deviceId);
        SignInWithGoogleCommand command = new SignInWithGoogleCommand(dto.IdToken, deviceId);

        Result<SocialAuthResult, Error> result = await _mediator.Send(command);

        return FromSocialAuthResult(result);
    }

    [HttpPost("vk-signin")]
    public async Task<IActionResult> SignInWithVk(VkSignInDto dto)
    {
        Request.Cookies.TryGetValue(CookiesInfo.DeviceId.Name, out var deviceId);
        SignInWithVkCommand command = new SignInWithVkCommand(dto.SilentToken, dto.Uuid, deviceId);

        Result<SocialAuthResult, Error> result = await _mediator.Send(command);

        return FromSocialAuthResult(result);
    }

    [HttpPost("odnoklassniki-signin")]
    public async Task<IActionResult> SignInWithOdnoklassniki(OdnoklassnikiSignInDto dto)
    {
        Request.Cookies.TryGetValue(CookiesInfo.DeviceId.Name, out var deviceId);
        var command = new SignInWithOdnoklassnikiCommand(
            dto.AccessToken,
            dto.SessionSecretKey,
            deviceId
        );
        Result<SocialAuthResult, Error> result = await _mediator.Send(command);

        return FromSocialAuthResult(result);
    }

    [HttpGet("can-add-login"), Authorize(AuthorizationPolicies.EmailVerified)]
    public async Task<IActionResult> CanAddLogin()
    {
        Result<UserId, Error> userIdOrError = _cookiesInfoExtractor.ExtractUserId(Request.Cookies);
        if (userIdOrError.IsFailure)
        {
            return Problem(userIdOrError.Error);
        }

        CanAddLoginQuery query = new CanAddLoginQuery(userIdOrError.Value);

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

    [HttpGet("can-add-login-and-email"), Authorize]
    public async Task<IActionResult> CanAddLoginAndEmail()
    {
        UserId userId = _cookiesInfoExtractor.ExtractUserId(Request.Cookies).Value;

        CanAddLoginAndEmailQuery query = new CanAddLoginAndEmailQuery(userId);
        SuccessOr<Error> result = await _mediator.Send(query);

        return FromResult(result);
    }

    [HttpPost("add-login-and-email"), Authorize]
    public async Task<IActionResult> AddLoginAndEmail(AddLoginAndEmailDto dto)
    {
        Result<UserId, Error> userIdOrError = _cookiesInfoExtractor.ExtractUserId(Request.Cookies);
        if (userIdOrError.IsFailure)
        {
            return Problem(userIdOrError.Error);
        }

        var command = new AddLoginAndEmailCommand(userIdOrError.Value, dto.Login, dto.Email);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }
}
