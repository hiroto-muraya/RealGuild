using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealGuild.Api.Data;

namespace RealGuild.Api.Controllers;

/// <summary>
/// 稼働確認用エンドポイント。API と DB への接続状態を返す。
/// </summary>
[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public class HealthController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<HealthResponse>> Get(CancellationToken cancellationToken)
    {
        var databaseConnected = await db.Database.CanConnectAsync(cancellationToken);
        return Ok(new HealthResponse("ok", databaseConnected));
    }
}

public record HealthResponse(string Status, bool DatabaseConnected);
