namespace ScoreTrack.api.Models
{
    public class Group
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public required string CreatorId { get; set; }
        public ApplicationUser? Creator { get; set; }

        public ICollection<GroupMember>? Members { get; set; }
        public ICollection<ScoreButton> ScoreButtons { get; set; } = new List<ScoreButton>();

        public string? Passcode { get; set; } = null!;
    }
}
