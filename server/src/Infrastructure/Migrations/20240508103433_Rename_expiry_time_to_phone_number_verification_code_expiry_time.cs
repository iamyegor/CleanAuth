using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Rename_expiry_time_to_phone_number_verification_code_expiry_time : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "expiry_time",
                table: "users",
                newName: "phone_number_verification_code_expiry_time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "phone_number_verification_code_expiry_time",
                table: "users",
                newName: "expiry_time");
        }
    }
}
