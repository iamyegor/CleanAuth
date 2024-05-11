using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_restore_password_token_expiry_time : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RestorePasswordToken",
                table: "users",
                newName: "restore_password_token");

            migrationBuilder.AddColumn<DateTime>(
                name: "restore_password_token_expiry_time",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "restore_password_token_expiry_time",
                table: "users");

            migrationBuilder.RenameColumn(
                name: "restore_password_token",
                table: "users",
                newName: "RestorePasswordToken");
        }
    }
}
