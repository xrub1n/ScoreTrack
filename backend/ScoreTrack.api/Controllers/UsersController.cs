using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreTrack.api.Data;
using ScoreTrack.api.Models;


namespace ScoreTrack.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
    {
        return await _context.Users
            .ToListAsync();
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationUser>> GetUser(String id)
    {
        var user = await _context.Users
            .Include(u => u.GroupsJoined)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> CreateUser(ApplicationUser user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Return the created user with a 201 status code by using GetUser{id}
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
}
