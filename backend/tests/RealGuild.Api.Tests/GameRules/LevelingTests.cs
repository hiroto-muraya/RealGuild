using RealGuild.Api.Domain.GameRules;

namespace RealGuild.Api.Tests.GameRules;

public class LevelingTests
{
    [Theory]
    [InlineData(1, 100)]
    [InlineData(2, 150)]
    [InlineData(9, 500)]
    public void XpToNextLevel_は_100_足す_レベル毎に50増える(int level, int expected)
    {
        Assert.Equal(expected, Leveling.XpToNextLevel(level));
    }

    [Theory]
    [InlineData(1, 0)]
    [InlineData(2, 100)]
    [InlineData(3, 250)]
    [InlineData(10, 2700)] // design.md 3.2 の例
    public void TotalXpForLevel_は必要経験値の累計(int level, int expected)
    {
        Assert.Equal(expected, Leveling.TotalXpForLevel(level));
    }

    [Fact]
    public void TotalXpForLevel_はXpToNextLevelの合計と一致する()
    {
        var sum = 0;
        for (var level = 1; level < Leveling.MaxLevel; level++)
        {
            Assert.Equal(sum, Leveling.TotalXpForLevel(level));
            sum += Leveling.XpToNextLevel(level);
        }
        Assert.Equal(sum, Leveling.TotalXpForLevel(Leveling.MaxLevel));
    }

    [Theory]
    [InlineData(0, 1, 0, 100)]
    [InlineData(99, 1, 99, 100)]
    [InlineData(100, 2, 0, 150)] // ちょうどレベルアップ
    [InlineData(720, 5, 20, 300)] // design.md 5.3 の例（Lv4 の 680 から +40 で Lv5 へ）
    [InlineData(2700, 10, 0, 550)]
    public void FromTotalXp_はレベルと進み具合を返す(int totalXp, int level, int xpIntoLevel, int xpForNext)
    {
        var progress = Leveling.FromTotalXp(totalXp);

        Assert.Equal(level, progress.Level);
        Assert.Equal(xpIntoLevel, progress.XpIntoLevel);
        Assert.Equal(xpForNext, progress.XpForNextLevel);
        Assert.False(progress.IsMaxLevel);
    }

    [Fact]
    public void FromTotalXp_は負の経験値をLv1として扱う()
    {
        Assert.Equal(1, Leveling.FromTotalXp(-50).Level);
    }

    [Fact]
    public void FromTotalXp_は最大レベルで止まる()
    {
        var progress = Leveling.FromTotalXp(int.MaxValue / 2);

        Assert.Equal(Leveling.MaxLevel, progress.Level);
        Assert.True(progress.IsMaxLevel);
        Assert.Equal(0, progress.XpForNextLevel);
    }

    [Fact]
    public void FromTotalXp_は最大レベル直前ではまだ上限ではない()
    {
        var progress = Leveling.FromTotalXp(Leveling.TotalXpForLevel(Leveling.MaxLevel) - 1);

        Assert.Equal(Leveling.MaxLevel - 1, progress.Level);
        Assert.False(progress.IsMaxLevel);
    }
}
