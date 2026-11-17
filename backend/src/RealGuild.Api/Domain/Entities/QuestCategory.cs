namespace RealGuild.Api.Domain.Entities;

/// <summary>クエストのカテゴリ。DB には整数で保存する。</summary>
public enum QuestCategory
{
    /// <summary>勉強 → 知力 (INT)</summary>
    Study = 0,
    /// <summary>運動 → 体力 (STR)</summary>
    Exercise = 1,
    /// <summary>仕事 → 技量 (DEX)</summary>
    Work = 2,
    /// <summary>趣味 → 感性 (CHA)</summary>
    Hobby = 3,
}
