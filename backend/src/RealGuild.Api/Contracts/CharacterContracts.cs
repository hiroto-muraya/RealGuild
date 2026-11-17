using System.ComponentModel.DataAnnotations;
using RealGuild.Api.Domain.Entities;
using RealGuild.Api.Domain.GameRules;

namespace RealGuild.Api.Contracts;

public record CharacterResponse(
    string Name,
    int Level,
    int TotalXp,
    int XpIntoLevel,
    int XpForNextLevel,
    bool IsMaxLevel,
    CharacterStats Stats)
{
    public static CharacterResponse From(Character character)
    {
        var progress = Leveling.FromTotalXp(character.TotalXp);
        return new CharacterResponse(
            character.Name,
            progress.Level,
            character.TotalXp,
            progress.XpIntoLevel,
            progress.XpForNextLevel,
            progress.IsMaxLevel,
            StatRules.Of(character));
    }
}

public record RenameCharacterRequest(
    [Required(ErrorMessage = "キャラクター名を入力してください。")]
    [MaxLength(Character.NameMaxLength, ErrorMessage = "キャラクター名は 20 文字以内にしてください。")]
    string Name);
