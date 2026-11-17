namespace RealGuild.Api.Domain.Entities;

/// <summary>
/// プレイヤーのキャラクター（1 ユーザーにつき 1 体）。
/// レベルと能力値は保存せず、経験値から GameRules で計算する。
/// </summary>
public class Character
{
    public const int NameMaxLength = 20;

    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public AppUser? User { get; set; }

    public required string Name { get; set; }

    /// <summary>累計経験値</summary>
    public int TotalXp { get; set; }

    // カテゴリ別の累計経験値（能力値の計算に使う）
    public int StudyXp { get; set; }
    public int ExerciseXp { get; set; }
    public int WorkXp { get; set; }
    public int HobbyXp { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>経験値を加算する（取り消し時は負の値を渡す）。</summary>
    public void AddXp(QuestCategory category, int amount)
    {
        TotalXp += amount;
        switch (category)
        {
            case QuestCategory.Study: StudyXp += amount; break;
            case QuestCategory.Exercise: ExerciseXp += amount; break;
            case QuestCategory.Work: WorkXp += amount; break;
            case QuestCategory.Hobby: HobbyXp += amount; break;
            default: throw new ArgumentOutOfRangeException(nameof(category), category, null);
        }
    }
}
