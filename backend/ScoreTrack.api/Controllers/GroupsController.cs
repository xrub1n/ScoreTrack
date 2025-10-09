using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreTrack.api.Data;
using ScoreTrack.api.Models;

namespace ScoreTrack.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GroupsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
    {
        return await _context.Groups
            .Include(g => g.Members)
                .ThenInclude(m => m.User)
            .Include(g => g.ScoreButtons)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGroup(int id)
    {
        var group = await _context.Groups
            .Include(g => g.ScoreButtons)
            .Include(g => g.Members)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (group == null)
            return NotFound();

        return Ok(group);
    }

    // GET: api/groups/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Group>>> GetGroupsForUser(string userId)
    {
        var groups = await _context.GroupMembers
            .Where(gm => gm.UserId == userId)
            .Select(gm => gm.Group)
            .ToListAsync();

        return Ok(groups);
    }



    // POST: api/groups
    [HttpPost]
    public async Task<ActionResult<Group>> CreateGroup([FromBody] Group group)
    {
        // Verify the creator exists in database and get as a User object
        var creator = await _context.Users.FindAsync(group.CreatorId);
        if (creator == null)
        {
            return BadRequest("Invalid CreatorId — user does not exist.");
        }

        // Initialize collections to avoid null refs
        group.Members = new List<GroupMember>();
        group.ScoreButtons = new List<ScoreButton>();

        // Generate a unique passcode for the group
        var passcode = await GenerateUniquePasscodeAsync();
        group.Passcode = passcode;

        _context.Groups.Add(group);

        // Also add the creator as a member of their own group automatically
        var groupMember = new GroupMember
        {
            Group = group,
            User = creator,
            UserId = creator.Id,
            TotalScore = 0
        };
        _context.GroupMembers.Add(groupMember);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGroups), new { id = group.Id }, group);
    }

    // POST: api/groups/join
    [HttpPost("join")]
    public async Task<IActionResult> JoinGroupByPasscode([FromBody] JoinGroupRequest request)
    {
        var group = await _context.Groups
            .FirstOrDefaultAsync(g => g.Passcode == request.Passcode);

        if (group == null)
            return NotFound("Invalid passcode.");

        // Check if user is already a member
        var existingMember = await _context.GroupMembers
            .FirstOrDefaultAsync(gm => gm.GroupId == group.Id && gm.UserId == request.UserId);

        if (existingMember != null)
            return BadRequest("User is already a member.");

        var member = new GroupMember { GroupId = group.Id, UserId = request.UserId, TotalScore = 0 };
        _context.GroupMembers.Add(member);
        await _context.SaveChangesAsync();

        return Ok(member);
    }

    public class JoinGroupRequest
    {
        public string UserId { get; set; } = null!;
        public string Passcode { get; set; } = null!;
    }

    private async Task<string> GenerateUniquePasscodeAsync()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();

        string code;
        bool exists;

        do
        {
            code = new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            exists = await _context.Groups.AnyAsync(g => g.Passcode == code);
        } while (exists);

        return code;
    }
    

}
