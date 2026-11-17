using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealGuild.Api.Domain.Entities;

namespace RealGuild.Api.Data.Configurations;

public class CharacterConfiguration : IEntityTypeConfiguration<Character>
{
    public void Configure(EntityTypeBuilder<Character> builder)
    {
        builder.ToTable("Characters");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(Character.NameMaxLength);

        // 1 ユーザー 1 キャラクター
        builder.HasIndex(c => c.UserId).IsUnique();
        builder.HasOne(c => c.User)
            .WithOne(u => u.Character)
            .HasForeignKey<Character>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
