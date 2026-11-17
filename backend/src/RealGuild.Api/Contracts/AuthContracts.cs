using System.ComponentModel.DataAnnotations;
using RealGuild.Api.Domain.Entities;

namespace RealGuild.Api.Contracts;

public record RegisterRequest(
    [Required(ErrorMessage = "メールアドレスを入力してください。")]
    [EmailAddress(ErrorMessage = "メールアドレスの形式が正しくありません。")]
    [MaxLength(256, ErrorMessage = "メールアドレスが長すぎます。")]
    string Email,

    [Required(ErrorMessage = "パスワードを入力してください。")]
    [MaxLength(100, ErrorMessage = "パスワードは 100 文字以内にしてください。")]
    string Password,

    [Required(ErrorMessage = "キャラクター名を入力してください。")]
    [MaxLength(Character.NameMaxLength, ErrorMessage = "キャラクター名は 20 文字以内にしてください。")]
    string CharacterName);

public record LoginRequest(
    [Required(ErrorMessage = "メールアドレスを入力してください。")]
    string Email,

    [Required(ErrorMessage = "パスワードを入力してください。")]
    string Password);

public record MeResponse(Guid UserId, string Email);
