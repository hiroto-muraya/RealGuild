namespace RealGuild.Api.Domain.GameRules;

/// <summary>
/// クエスト達成時の獲得経験値（design.md 3.1）。
/// </summary>
public static class Rewards
{
    public const int MinDifficulty = 1;
    public const int MaxDifficulty = 5;

    public static int XpForDifficulty(int difficulty) => difficulty switch
    {
        1 => 10,
        2 => 20,
        3 => 40,
        4 => 80,
        5 => 150,
        _ => throw new ArgumentOutOfRangeException(nameof(difficulty), difficulty, "難易度は 1〜5 です。"),
    };
}
