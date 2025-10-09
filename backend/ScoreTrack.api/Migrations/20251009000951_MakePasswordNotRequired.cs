using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScoreTrack.api.Migrations
{
    /// <inheritdoc />
    public partial class MakePasswordNotRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Groups_Passcode",
                table: "Groups");

            migrationBuilder.AlterColumn<string>(
                name: "Passcode",
                table: "Groups",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_Passcode",
                table: "Groups",
                column: "Passcode",
                unique: true,
                filter: "[Passcode] IS NOT NULL");
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
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Groups_Passcode",
                table: "Groups",
                column: "Passcode",
                unique: true);
        }
    }
}
