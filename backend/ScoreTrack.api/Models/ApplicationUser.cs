using Microsoft.AspNetCore.Identity;

namespace ScoreTrack.api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string DisplayName { get; set; }
        public ICollection<GroupMember> GroupsJoined { get; set; } = new List<GroupMember>();
    }
}
