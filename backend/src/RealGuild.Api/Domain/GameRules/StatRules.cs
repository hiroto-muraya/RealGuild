using RealGuild.Api.Domain.Entities;

namespace RealGuild.Api.Domain.GameRules;

/// <summary>
/// 能力値の計算（design.md 3.3）。能力値 = 1 + floor(カテゴリ経験値 ÷ 100)。
/// </summary>
public static class StatRules
{
    public const int XpPerStatPoint = 100;

    public static int FromCategoryXp(int categoryXp) => 1 + Math.Max(0, categoryXp) / XpPerStatPoint;

    public static CharacterStats Of(Character character) => new(
        Int: FromCategoryXp(character.StudyXp),
        Str: FromCategoryXp(character.ExerciseXp),
        Dex: FromCategoryXp(character.WorkXp),
        Cha: FromCategoryXp(character.HobbyXp));
}

/// <summary>知力 (勉強) / 体力 (運動) / 技量 (仕事) / 感性 (趣味)</summary>
public readonly record struct CharacterStats(int Int, int Str, int Dex, int Cha);
