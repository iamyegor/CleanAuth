using System.Net;
using Domain.DomainErrors;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Common;

public class ErrorResult : IActionResult
{
    private readonly Error _error;
    private readonly HttpStatusCode _statusCode;

    public ErrorResult(Error error, HttpStatusCode statusCode)
    {
        _error = error;
        _statusCode = statusCode;
    }

    public Task ExecuteResultAsync(ActionContext context)
    {
        var payload = new Dictionary<string, object?>()
        {
            ["errorCode"] = _error.Code,
            ["errorMessage"] = _error.Message
        };

        if (_error.Details != null)
        {
            foreach ((string? key, object? value) in _error.Details)
            {
                payload.Add(key, value);
            }
        }

        ObjectResult objectResult = new ObjectResult(payload)
        {
            StatusCode = (int)_statusCode,
            ContentTypes = ["application/vnd.yegor.problem+json"]
        };

        return objectResult.ExecuteResultAsync(context);
    }
}
