using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreTrack.api.Data;
using ScoreTrack.api.Models;

namespace ScoreTrack.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreButtonsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScoreButtonsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/scorebuttons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScoreButton>>> GetAll()
        {
            return await _context.ScoreButtons
                .Include(sb => sb.Group)
                .ToListAsync();
        }

        // GET: api/scorebuttons/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ScoreButton>> GetById(int id)
        {
            var button = await _context.ScoreButtons
                .Include(sb => sb.Group)
                .FirstOrDefaultAsync(sb => sb.Id == id);

            if (button == null)
                return NotFound();

            return Ok(button);
        }

        [HttpGet("group/{groupId}")]
        public async Task<ActionResult<IEnumerable<ScoreButton>>> GetButtonsByGroup(int groupId)
        {
            var buttons = await _context.ScoreButtons
                .Where(b => b.GroupId == groupId)
                .ToListAsync();

            return Ok(buttons);
        }

        // POST: api/scorebuttons
        [HttpPost]
        public async Task<ActionResult<ScoreButton>> Create(ScoreButton button)
        {
            _context.ScoreButtons.Add(button);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = button.Id }, button);
        }

        // PUT: api/scorebuttons/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ScoreButton updatedButton)
        {
            if (id != updatedButton.Id)
                return BadRequest("ID mismatch.");

            _context.Entry(updatedButton).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScoreButtonExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/scorebuttons/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var button = await _context.ScoreButtons.FindAsync(id);
            if (button == null)
                return NotFound();

            _context.ScoreButtons.Remove(button);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScoreButtonExists(int id)
        {
            return _context.ScoreButtons.Any(sb => sb.Id == id);
        }
    }
}
