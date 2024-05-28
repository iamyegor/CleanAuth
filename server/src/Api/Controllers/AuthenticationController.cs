using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.LogIn;
using Application.Authentication.Commands.RefreshAccessToken;
using Application.Authentication.Commands.Signup;
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

    [HttpPost("issue-device-id")]
    public IActionResult IssueDeviceId()
    {
        Request.Cookies.TryGetValue(Cookies.DeviceId.Name, out string? currentDeviceId);
        if (currentDeviceId == null || !Guid.TryParse(currentDeviceId, out _))
        {
            Guid deviceId = Guid.NewGuid();
            Response.Cookies.Append(
                Cookies.DeviceId.Name,
                deviceId.ToString(),
                Cookies.DeviceId.Options
            );
        }

        return Ok();
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp(SignupDto dto)
    {
        Request.Cookies.TryGetValue(Cookies.DeviceId.Name, out string? deviceId);

        SignUpCommand command = (dto, deviceId).Adapt<SignUpCommand>();
        Result<Tokens, Error> resultOrError = await _mediator.Send(command);
        if (resultOrError.IsFailure)
        {
            return Problem(resultOrError.Error);
        }

        Response.Cookies.Append(resultOrError.Value);

        return Ok();
    }

    [HttpGet("is-authenticated"), Authorize(PoliciyNames.AccountAuthenticated)]
    public IActionResult IsAuthenticated()
    {
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LogIn(LoginDto dto)
    {
        Request.Cookies.TryGetValue(Cookies.DeviceId.Name, out var deviceId);
        
        LogInCommand command = (dto, deviceId).Adapt<LogInCommand>();
        
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
        Response.Cookies.Delete(Cookies.AccessToken.Name, Cookies.AccessToken.Options);
        Response.Cookies.Delete(Cookies.RefreshToken.Name, Cookies.RefreshToken.Options);

        return Ok();
    }

    [HttpPost("refresh-access-token")]
    public async Task<IActionResult> RefreshAccessToken()
    {
        Request.Cookies.TryGetValue(Cookies.DeviceId.Name, out var deviceId);
        Request.Cookies.TryGetValue(Cookies.RefreshToken.Name, out var refreshToken);

        RefreshAccessTokenCommand command = new RefreshAccessTokenCommand(refreshToken, deviceId);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);

        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }
}
