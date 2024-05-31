namespace Application.SocialAuthentication.Command.SignInWithVk;

public class VkAccessToken
{
    public string AccessToken { get; set; }
    public string AccessTokenId { get; set; }
    public int UserId { get; set; }
    public string Phone { get; set; }
    public int? PhoneValidated { get; set; }
    public bool IsService { get; set; }
    public string? Email { get; set; }
    public int Source { get; set; }
    public string SourceDescription { get; set; }
}
