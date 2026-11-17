using Microsoft.AspNetCore.Identity;

namespace RealGuild.Api.Infrastructure;

/// <summary>
/// パスワードに英字が 1 文字以上含まれているかを検証する（requirements.md F1: 英数字を含む）。
/// 数字の有無は Identity 標準の RequireDigit で検証する。
/// </summary>
public class LetterPasswordValidator<TUser> : IPasswordValidator<TUser> where TUser : class
{
    public const string ErrorCode = "PasswordRequiresLetter";

    public Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user, string? password)
    {
        if (password is not null && password.Any(char.IsAsciiLetter))
        {
            return Task.FromResult(IdentityResult.Success);
        }

        return Task.FromResult(IdentityResult.Failed(new IdentityError
        {
            Code = ErrorCode,
            Description = "パスワードには英字を含めてください。",
        }));
    }
}
