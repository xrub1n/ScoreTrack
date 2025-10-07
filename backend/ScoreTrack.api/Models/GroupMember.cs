using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreTrack.api.Models
{
    public class GroupMember
    {
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        [ForeignKey(nameof(Group))]
        public int GroupId { get; set; }
        public Group? Group { get; set; }

        public int TotalScore { get; set; } = 0;
    }
}
