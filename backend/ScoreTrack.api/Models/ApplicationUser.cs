using Microsoft.AspNetCore.Identity;

namespace ScoreTrack.api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public ICollection<GroupMember> GroupsJoined { get; set; }
    }
}
