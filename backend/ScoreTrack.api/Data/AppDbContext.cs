using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ScoreTrack.api.Models;

namespace ScoreTrack.api.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<ScoreButton> ScoreButtons { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Group -> Creator (User) relationship
            builder.Entity<Group>()
                .HasOne(g => g.Creator)
                .WithMany() // No navigation from AppUser to groups for now
                .HasForeignKey(g => g.CreatorId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting user deletes their groups

            // GroupMember -> Group relationship
            builder.Entity<GroupMember>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.Members)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent multiple cascade paths

            // GroupMember -> User relationship
            builder.Entity<GroupMember>()
                .HasOne(gm => gm.User)
                .WithMany()
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting user deletes membership

            // ScoreButton -> Group relationship
            builder.Entity<ScoreButton>()
                .HasOne(sb => sb.Group)
                .WithMany(g => g.ScoreButtons)
                .HasForeignKey(sb => sb.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting group deletes buttons
            
            // Ensure Passcode is unique
            builder.Entity<Group>()
                .HasIndex(g => g.Passcode)
                .IsUnique();
        }
    }

    
}
