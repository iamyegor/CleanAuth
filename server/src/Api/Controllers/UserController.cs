using Api.Controllers.Common;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("api")]
public class UserController : ApplicationController
{
    private readonly JwtService _jwtService;
    private readonly ApplicationContext _context;

    public UserController(JwtService jwtService, ApplicationContext context)
    {
        _jwtService = jwtService;
        _context = context;
    }

    [HttpGet("username"), Authorize]
    public async Task<IActionResult> GetUsername()
    {
        if (HttpContext.Request.Cookies.TryGetValue("accessToken", out string? token))
        {
            Result<UserId, Error> userIdOrError = _jwtService.ExtractUserIdFromToken(token);
            if (userIdOrError.IsFailure)
            {
                return Problem(userIdOrError.Error);
            }

            User? user = await _context.Users.SingleOrDefaultAsync(u =>
                u.Id == userIdOrError.Value
            );

            if (user == null || !user.IsEmailVerified)
            {
                return Problem(Errors.User.DoesNotExist(userIdOrError.Value));
            }

            return Ok(user.Login.Value);
        }

        return Problem(Errors.AccessToken.IsRequired());
    }
}
