using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScoreTrack.api.Migrations
{
    /// <inheritdoc />
    public partial class AddUniquePasscodeToGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Passcode",
                table: "Groups",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_Passcode",
                table: "Groups",
                column: "Passcode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Groups_Passcode",
                table: "Groups");

            migrationBuilder.AlterColumn<string>(
                name: "Passcode",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
