using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Make_auth_type_a_value_object : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_auth_type_auth_type_id",
                table: "users");

            migrationBuilder.DropTable(
                name: "auth_type");

            migrationBuilder.DropIndex(
                name: "IX_users_auth_type_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "auth_type_id",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "auth_type",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "auth_type",
                table: "users");

            migrationBuilder.AddColumn<int>(
                name: "auth_type_id",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "auth_type",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    auth_type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auth_type", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "auth_type",
                columns: new[] { "id", "auth_type" },
                values: new object[,]
                {
                    { 1, "Standard" },
                    { 2, "Apple" },
                    { 3, "Vk" },
                    { 4, "Google" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_users_auth_type_id",
                table: "users",
                column: "auth_type_id");

            migrationBuilder.AddForeignKey(
                name: "FK_users_auth_type_auth_type_id",
                table: "users",
                column: "auth_type_id",
                principalTable: "auth_type",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
