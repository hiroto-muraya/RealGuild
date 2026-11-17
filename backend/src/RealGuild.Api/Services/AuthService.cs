using Microsoft.AspNetCore.Identity;
using RealGuild.Api.Data;
using RealGuild.Api.Domain.Entities;

namespace RealGuild.Api.Services;

/// <summary>
/// 新規登録の処理。ユーザーとキャラクターを 1 つのトランザクションで作成する。
/// </summary>
public class AuthService(AppDbContext db, UserManager<AppUser> userManager, TimeProvider time)
{
    public async Task<RegisterResult> RegisterAsync(
        string email, string password, string characterName, CancellationToken cancellationToken)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);

        var user = new AppUser { UserName = email, Email = email };
        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            return RegisterResult.Failed(result.Errors);
        }

        db.Characters.Add(new Character
        {
            Id = Guid.CreateVersion7(),
            UserId = user.Id,
            Name = characterName.Trim(),
            CreatedAt = time.GetUtcNow(),
        });
        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return RegisterResult.Success(user);
    }
}

public record RegisterResult(AppUser? User, IReadOnlyList<IdentityError> Errors)
{
    public bool Succeeded => User is not null;

    public static RegisterResult Success(AppUser user) => new(user, []);
    public static RegisterResult Failed(IEnumerable<IdentityError> errors) => new(null, errors.ToList());
}
