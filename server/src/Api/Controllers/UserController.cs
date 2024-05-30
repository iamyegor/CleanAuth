using Api.Controllers.Common;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authorization;
using Infrastructure.Cookies;
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
    private readonly ApplicationContext _context;
    private readonly CookiesInfoExtractor _cookiesInfoExtractor;

    public UserController(ApplicationContext context, CookiesInfoExtractor cookiesInfoExtractor)
    {
        _context = context;
        _cookiesInfoExtractor = cookiesInfoExtractor;
    }

    [HttpGet("username"), Authorize(AuthorizationPolicies.AccountAuthenticated)]
    public async Task<IActionResult> GetUsername()
    {
        Result<UserId, Error> userIdOrError = _cookiesInfoExtractor.ExtractUserId(Request.Cookies);
        if (userIdOrError.IsFailure)
        {
            return Problem(userIdOrError.Error);
        }

        User? user = await _context.Users.SingleOrDefaultAsync(u => u.Id == userIdOrError.Value);

        if (user == null || !user.IsEmailVerified)
        {
            return Problem(Errors.User.DoesNotExist(userIdOrError.Value));
        }

        return Ok(user.Login!.Value);
    }
}
