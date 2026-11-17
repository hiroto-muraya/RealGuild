using System.Security.Claims;

namespace RealGuild.Api.Infrastructure;

public static class ClaimsPrincipalExtensions
{
    /// <summary>ログイン中のユーザー ID を取得する。[Authorize] が付いた処理の中でのみ使う。</summary>
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("ログインしていないユーザーの ID を取得しようとしました。");
        return Guid.Parse(value);
    }
}
