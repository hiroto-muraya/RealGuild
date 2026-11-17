using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RealGuild.Api.Data;
using RealGuild.Api.Domain.Entities;
using RealGuild.Api.Infrastructure;
using RealGuild.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddSingleton(TimeProvider.System);

// DB (PostgreSQL / EF Core)
// 接続文字列はローカルでは appsettings.Development.json、本番では環境変数 ConnectionStrings__Default で渡す
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Cookie の暗号化鍵を DB に保存する（Render の再起動・スリープでログインが切れないようにする）
builder.Services.AddDataProtection()
    .SetApplicationName("RealGuild")
    .PersistKeysToDbContext<AppDbContext>();

// 認証: ASP.NET Core Identity + Cookie
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();

builder.Services.AddIdentityCore<AppUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        // パスワード: 8 文字以上、英字と数字を含む（英字は LetterPasswordValidator で検証）
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredUniqueChars = 1;
        // ログイン失敗 5 回で 5 分ロック
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddErrorDescriber<JapaneseIdentityErrorDescriber>()
    .AddPasswordValidator<LetterPasswordValidator<AppUser>>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "RealGuild.Auth";
    options.Cookie.HttpOnly = true;
    // CSRF 対策: 他サイトからのリクエストには Cookie を付けない（design.md 5.1）
    options.Cookie.SameSite = SameSiteMode.Strict;
    // 本番は常に Secure。ローカル（http://localhost）でも動くよう開発時はリクエストに合わせる
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;

    // API なのでログイン画面へのリダイレクトではなく 401 / 403 を返す
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// 既定で全 API にログインを要求する。ログイン不要な API には [AllowAnonymous] を付ける
builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// --- HTTP pipeline ---
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    // OpenAPI 仕様: /openapi/v1.json
    app.MapOpenApi().AllowAnonymous();
}

// HTTPS 終端は Render / Vercel 側で行うため UseHttpsRedirection は使わない
// フロントからは Vercel rewrites / Vite proxy 経由の同一オリジンで呼ばれるため CORS は設定しない
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// 統合テスト (WebApplicationFactory) から参照できるようにする
public partial class Program;
