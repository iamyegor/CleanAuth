using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Rename_restore_password_to_reset_password : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "restore_password_token_expiry_time",
                table: "users",
                newName: "password_reset_token_expiry_time");

            migrationBuilder.RenameColumn(
                name: "restore_password_token",
                table: "users",
                newName: "password_reset_token");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "password_reset_token_expiry_time",
                table: "users",
                newName: "restore_password_token_expiry_time");

            migrationBuilder.RenameColumn(
                name: "password_reset_token",
                table: "users",
                newName: "restore_password_token");
        }
    }
}
