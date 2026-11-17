namespace RealGuild.Api.Domain.GameRules;

/// <summary>
/// レベルの計算（design.md 3.2）。
/// レベル L → L+1 に必要な経験値 = 100 + (L - 1) × 50、最大レベル 99。
/// </summary>
public static class Leveling
{
    public const int MaxLevel = 99;

    /// <summary>レベル L から L+1 に上がるのに必要な経験値。</summary>
    public static int XpToNextLevel(int level)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(level, 1);
        return 100 + (level - 1) * 50;
    }

    /// <summary>レベル L に到達するのに必要な累計経験値（Lv1 は 0）。</summary>
    public static int TotalXpForLevel(int level)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(level, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(level, MaxLevel);
        var n = level - 1;
        // Σ_{k=1}^{n} (100 + (k-1)×50) = 100n + 25n(n-1)
        return 100 * n + 25 * n * (n - 1);
    }

    /// <summary>累計経験値から現在のレベルと、そのレベル内での進み具合を求める。</summary>
    public static LevelProgress FromTotalXp(int totalXp)
    {
        var xp = Math.Max(0, totalXp);
        var level = 1;
        while (level < MaxLevel && xp >= TotalXpForLevel(level + 1))
        {
            level++;
        }

        if (level == MaxLevel)
        {
            return new LevelProgress(MaxLevel, XpIntoLevel: 0, XpForNextLevel: 0, IsMaxLevel: true);
        }

        return new LevelProgress(
            level,
            XpIntoLevel: xp - TotalXpForLevel(level),
            XpForNextLevel: XpToNextLevel(level),
            IsMaxLevel: false);
    }
}

/// <param name="Level">現在のレベル</param>
/// <param name="XpIntoLevel">現在のレベルに入ってから獲得した経験値</param>
/// <param name="XpForNextLevel">次のレベルまでに必要な経験値（最大レベルでは 0）</param>
/// <param name="IsMaxLevel">最大レベルに達しているか</param>
public readonly record struct LevelProgress(int Level, int XpIntoLevel, int XpForNextLevel, bool IsMaxLevel);
