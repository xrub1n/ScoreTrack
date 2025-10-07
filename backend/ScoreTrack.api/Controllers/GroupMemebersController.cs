using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreTrack.api.Data;
using ScoreTrack.api.Models;

namespace ScoreTrack.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupMembersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GroupMembersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/groupmembers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupMember>>> GetAll()
        {
            return await _context.GroupMembers
                .Include(gm => gm.User)
                .Include(gm => gm.Group)
                .ToListAsync();
        }

        // POST: api/groupmembers
        [HttpPost]
        public async Task<ActionResult<GroupMember>> AddMember([FromBody] GroupMember groupMember)
        {
            // check if the user is already in the group
            var existing = await _context.GroupMembers
                .FirstOrDefaultAsync(gm => gm.GroupId == groupMember.GroupId && gm.UserId == groupMember.UserId);

            if (existing != null)
                return BadRequest("User is already a member of this group.");

            _context.GroupMembers.Add(groupMember);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = groupMember.Id }, groupMember);
        }

        // DELETE: api/groupmembers/{groupId}/{userId}
        [HttpDelete("{groupId}/{userId}")]
        public async Task<IActionResult> RemoveMember(int groupId, string userId)
        {
            var member = await _context.GroupMembers
                .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == userId);

            if (member == null)
                return NotFound("Membership not found.");

            _context.GroupMembers.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/groupmembers/{groupMemberId}/addscore
        [HttpPatch("{groupMemberId}/addscore")]
        public async Task<IActionResult> AddScore(int groupMemberId, [FromBody] int points)
        {
            // Find the GroupMember
            var member = await _context.GroupMembers
                .Include(gm => gm.User)
                .Include(gm => gm.Group)
                .FirstOrDefaultAsync(gm => gm.Id == groupMemberId);

            if (member == null)
                return NotFound("GroupMember not found.");

            // Increment the score
            member.TotalScore += points;

            await _context.SaveChangesAsync();

            return Ok(member);
        }

        // PATCH: api/groupmembers/{groupMemberId}/addscore/button/{scoreButtonId}
        [HttpPatch("{groupMemberId}/addscore/button/{scoreButtonId}")]
        public async Task<IActionResult> AddScoreFromButton(int groupMemberId, int scoreButtonId)
        {
            var member = await _context.GroupMembers
                .Include(gm => gm.User)
                .Include(gm => gm.Group)
                .FirstOrDefaultAsync(gm => gm.Id == groupMemberId);

            if (member == null)
                return NotFound("GroupMember not found.");

            var button = await _context.ScoreButtons.FindAsync(scoreButtonId);
            if (button == null)
                return NotFound("ScoreButton not found.");

            member.TotalScore += button.Points;

            await _context.SaveChangesAsync();

            return Ok(member);
        }

    }
}
