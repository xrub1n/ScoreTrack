namespace ScoreTrack.api.Models
{
    public class ScoreButton
    {
        public int Id { get; set; }
        public required string Label { get; set; }
        public int Points { get; set; }

        public int GroupId { get; set; }
        public Group? Group { get; set; }
    }
}
