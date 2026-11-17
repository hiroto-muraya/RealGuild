using RealGuild.Api.Domain.GameRules;

namespace RealGuild.Api.Tests.GameRules;

public class RewardsTests
{
    [Theory]
    [InlineData(1, 10)]
    [InlineData(2, 20)]
    [InlineData(3, 40)]
    [InlineData(4, 80)]
    [InlineData(5, 150)]
    public void XpForDifficulty_は難易度ごとの経験値を返す(int difficulty, int expected)
    {
        Assert.Equal(expected, Rewards.XpForDifficulty(difficulty));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void XpForDifficulty_は範囲外の難易度で例外(int difficulty)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => Rewards.XpForDifficulty(difficulty));
    }
}
