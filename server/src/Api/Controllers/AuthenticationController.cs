using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.AddPhoneNumber;
using Application.Authentication.Commands.LogIn;
using Application.Authentication.Commands.RefreshAccessToken;
using Application.Authentication.Commands.Signup;
using Application.Authentication.Commands.VerifyEmail;
using Domain.DomainErrors;
using Infrastructure.Authentication;
using Infrastructure.Authentication.Extensions;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XResults;

namespace Api.Controllers;

[ApiController, Route("api")]
public class AuthenticationController : ApplicationController
{
    private readonly ISender _mediator;

    public AuthenticationController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp(SignupDto dto)
    {
        SignUpCommand command = dto.Adapt<SignUpCommand>();
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
    {
        VerifyEmailCommand command = dto.Adapt<VerifyEmailCommand>();
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }

    [HttpPost, Email]
    public async Task<IActionResult> AddPhoneNumber(AddPhoneNumberDto dto)
    {
        Request.Cookies.TryGetValue(CookieTokens.Claims.UserId, out var userId);

        AddPhoneNumberCommand command = (userId, dto).Adapt<AddPhoneNumberCommand>();
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpGet("is-authenticated"), Authorize]
    public IActionResult IsAuthenticated()
    {
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LogIn(LoginDto dto)
    {
        LogInCommand command = dto.Adapt<LogInCommand>();
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }

    [HttpPost("logout"), Authorize]
    public IActionResult LogOut()
    {
        Response.Cookies.Delete(CookieTokens.Access.Name, CookieTokens.Access.Options);
        Response.Cookies.Delete(CookieTokens.Refresh.Name, CookieTokens.Refresh.Options);

        return Ok();
    }

    [HttpPost("refresh-access-token")]
    public async Task<IActionResult> RefreshAccessToken()
    {
        Request.Cookies.TryGetValue(CookieTokens.Refresh.Name, out var refreshToken);
        RefreshAccessTokenCommand command = new RefreshAccessTokenCommand(refreshToken);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);

        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }
}
