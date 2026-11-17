using Microsoft.AspNetCore.Identity;

namespace RealGuild.Api.Domain.Entities;

/// <summary>
/// ログインユーザー（ASP.NET Core Identity の AspNetUsers テーブル）。
/// ゲーム上の情報は Character に持たせ、ここには認証に関する情報だけを置く。
/// </summary>
public class AppUser : IdentityUser<Guid>
{
    public Character? Character { get; set; }
}
