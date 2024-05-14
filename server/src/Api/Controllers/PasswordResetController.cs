using Api.Controllers.Common;
using Api.Dtos;
using Application.Authentication.Commands.RequestPasswordReset;
using Application.Authentication.Commands.ResetPassword;
using Application.Authentication.Queries.NeedToResetPassword;
using Domain.DomainErrors;
using Infrastructure.Authentication;
using Infrastructure.Authentication.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("api/")]
public class PasswordResetController : ApplicationController
{
    private readonly ISender _mediator;

    public PasswordResetController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("request-password-reset")]
    public async Task<IActionResult> RequestPasswordReset(RequestPasswordReset dto)
    {
        RequestPasswordResetCommand command = new RequestPasswordResetCommand(dto.EmailOrUsername);
        SuccessOr<Error> result = await _mediator.Send(command);

        return FromResult(result);
    }

    [HttpGet("need-to-reset-password")]
    public async Task<IActionResult> NeedToResetPassword(
        [FromQuery] string userId,
        [FromQuery] string token
    )
    {
        NeedToResetPasswordQuery query = new NeedToResetPasswordQuery(userId, token);
        SuccessOr<Error> result = await _mediator.Send(query);

        return FromResult(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordDto dto,
        [FromQuery] string userId,
        [FromQuery] string token
    )
    {
        ResetPasswordCommand command = new ResetPasswordCommand(userId, token, dto.Password);
        Result<Tokens, Error> tokensOrError = await _mediator.Send(command);
        if (tokensOrError.IsFailure)
        {
            return Problem(tokensOrError.Error);
        }

        Response.Cookies.Append(tokensOrError.Value);

        return Ok();
    }
}
