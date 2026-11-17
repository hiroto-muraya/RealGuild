using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RealGuild.Api.Contracts;
using RealGuild.Api.Domain.Entities;
using RealGuild.Api.Infrastructure;
using RealGuild.Api.Services;

namespace RealGuild.Api.Controllers;

/// <summary>新規登録・ログイン・ログアウト・ログイン状態の確認。</summary>
[ApiController]
[Route("api/auth")]
public class AuthController(
    AuthService authService,
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<MeResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(
            request.Email, request.Password, request.CharacterName, cancellationToken);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                var field = error.Code.StartsWith("Password", StringComparison.Ordinal) ? "password" : "email";
                var existing = ModelState[field]?.Errors.Select(e => e.ErrorMessage) ?? [];
                if (!existing.Contains(error.Description))
                {
                    ModelState.AddModelError(field, error.Description);
                }
            }
            return ValidationProblem(ModelState);
        }

        var user = result.User!;
        await signInManager.SignInAsync(user, isPersistent: true);
        return Created("/api/auth/me", new MeResponse(user.Id, user.Email!));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<MeResponse>> Login(LoginRequest request)
    {
        var result = await signInManager.PasswordSignInAsync(
            request.Email, request.Password, isPersistent: true, lockoutOnFailure: true);

        if (result.IsLockedOut)
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "ログインできません",
                detail: "ログインの失敗が続いたため、一時的にロックされています。しばらくしてから再度お試しください。");
        }
        if (!result.Succeeded)
        {
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "ログインできません",
                detail: "メールアドレスまたはパスワードが正しくありません。");
        }

        var user = await userManager.FindByNameAsync(request.Email);
        return Ok(new MeResponse(user!.Id, user.Email!));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me()
    {
        var user = await userManager.FindByIdAsync(User.GetUserId().ToString());
        if (user is null)
        {
            // Cookie はあるがユーザーが削除済みなどの場合
            return Unauthorized();
        }
        return Ok(new MeResponse(user.Id, user.Email!));
    }
}
