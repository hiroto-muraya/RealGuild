using Microsoft.AspNetCore.Identity;

namespace RealGuild.Api.Infrastructure;

/// <summary>Identity のエラーメッセージを日本語にする（ユーザーに表示されるものだけ）。</summary>
public class JapaneseIdentityErrorDescriber : IdentityErrorDescriber
{
    public override IdentityError DuplicateEmail(string email) =>
        new() { Code = nameof(DuplicateEmail), Description = "このメールアドレスは既に登録されています。" };

    public override IdentityError DuplicateUserName(string userName) =>
        new() { Code = nameof(DuplicateUserName), Description = "このメールアドレスは既に登録されています。" };

    public override IdentityError InvalidEmail(string? email) =>
        new() { Code = nameof(InvalidEmail), Description = "メールアドレスの形式が正しくありません。" };

    public override IdentityError InvalidUserName(string? userName) =>
        new() { Code = nameof(InvalidUserName), Description = "メールアドレスに使用できない文字が含まれています。" };

    public override IdentityError PasswordTooShort(int length) =>
        new() { Code = nameof(PasswordTooShort), Description = $"パスワードは {length} 文字以上にしてください。" };

    public override IdentityError PasswordRequiresDigit() =>
        new() { Code = nameof(PasswordRequiresDigit), Description = "パスワードには数字を含めてください。" };
}
