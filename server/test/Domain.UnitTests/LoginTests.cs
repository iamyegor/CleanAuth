using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentAssertions;
using XResults;

namespace Domain.UnitTests;

public class LoginTests
{
    [Fact]
    public void Can_not_create_empty_login()
    {
        Result<Login, Error> result = Login.Create("");

        result.Error.Should().Be(Errors.Login.IsRequired());
    }

    [Fact]
    public void Can_not_create_login_with_length_less_than_3()
    {
        string input = "ab";
        Result<Login, Error> result = Login.Create(input);

        result.Error.Should().Be(Errors.Login.HasInvalidLength(input));
    }

    [Fact]
    public void Can_not_create_login_with_length_more_than_32()
    {
        string input = new string('a', 33);
        Result<Login, Error> result = Login.Create(input);

        result.Error.Should().Be(Errors.Login.HasInvalidLength(input));
    }

    [Fact]
    public void Can_not_create_login_with_invalid_symbols()
    {
        string input = "invalid@login";
        Result<Login, Error> result = Login.Create(input);

        result.Error.Should().Be(Errors.Login.HasInvalidSymbols(input));
    }

    [Fact]
    public void Creates_login()
    {
        string input = "valid_login";
        Result<Login, Error> result = Login.Create(input);

        Login login = result.Value;
        login.Value.Should().Be(input);
    }
}
