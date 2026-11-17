using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealGuild.Api.Domain.Entities;

namespace RealGuild.Api.Data;

/// <summary>
/// RealGuild のデータベースコンテキスト。
/// Identity のテーブル（AspNetUsers など）と、ゲームのテーブルをまとめて扱う。
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>(options), IDataProtectionKeyContext
{
    public DbSet<Character> Characters => Set<Character>();

    /// <summary>Cookie の暗号化に使う鍵。再起動してもログイン状態を保てるよう DB に保存する。</summary>
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
