using RealGuild.Api.Domain.Entities;
using RealGuild.Api.Domain.GameRules;

namespace RealGuild.Api.Tests.GameRules;

public class StatRulesTests
{
    [Theory]
    [InlineData(0, 1)]
    [InlineData(99, 1)]
    [InlineData(100, 2)]
    [InlineData(350, 4)] // design.md 3.3 の例
    [InlineData(-10, 1)]
    public void FromCategoryXp_は_1_足す_100毎に1上がる(int xp, int expected)
    {
        Assert.Equal(expected, StatRules.FromCategoryXp(xp));
    }

    [Fact]
    public void Of_はカテゴリと能力値を正しく対応させる()
    {
        var character = new Character { Name = "test" };
        character.AddXp(QuestCategory.Study, 350);
        character.AddXp(QuestCategory.Exercise, 200);
        character.AddXp(QuestCategory.Work, 100);

        var stats = StatRules.Of(character);

        Assert.Equal(new CharacterStats(Int: 4, Str: 3, Dex: 2, Cha: 1), stats);
        Assert.Equal(650, character.TotalXp);
    }

    [Fact]
    public void AddXp_に負の値を渡すと経験値が戻る()
    {
        var character = new Character { Name = "test" };
        character.AddXp(QuestCategory.Hobby, 40);
        character.AddXp(QuestCategory.Hobby, -40);

        Assert.Equal(0, character.TotalXp);
        Assert.Equal(0, character.HobbyXp);
    }
}
