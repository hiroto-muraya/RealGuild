using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealGuild.Api.Contracts;
using RealGuild.Api.Data;
using RealGuild.Api.Infrastructure;

namespace RealGuild.Api.Controllers;

/// <summary>ログイン中ユーザーのキャラクター。</summary>
[ApiController]
[Route("api/character")]
public class CharacterController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CharacterResponse>> Get(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var character = await db.Characters.AsNoTracking()
            .SingleOrDefaultAsync(c => c.UserId == userId, cancellationToken);

        return character is null ? NotFound() : Ok(CharacterResponse.From(character));
    }

    [HttpPatch]
    public async Task<ActionResult<CharacterResponse>> Rename(
        RenameCharacterRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var character = await db.Characters.SingleOrDefaultAsync(c => c.UserId == userId, cancellationToken);
        if (character is null)
        {
            return NotFound();
        }

        character.Name = request.Name.Trim();
        await db.SaveChangesAsync(cancellationToken);
        return Ok(CharacterResponse.From(character));
    }
}
