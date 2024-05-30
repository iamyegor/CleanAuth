using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Snake_case_auth_type_table_name_and_seed_its_data : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_AuthType_auth_type_id",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuthType",
                table: "AuthType");

            migrationBuilder.RenameTable(
                name: "AuthType",
                newName: "auth_type");

            migrationBuilder.AddPrimaryKey(
                name: "PK_auth_type",
                table: "auth_type",
                column: "id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_users_auth_type_auth_type_id",
                table: "users",
                column: "auth_type_id",
                principalTable: "auth_type",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_auth_type_auth_type_id",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_auth_type",
                table: "auth_type");

            migrationBuilder.DeleteData(
                table: "auth_type",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "auth_type",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "auth_type",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "auth_type",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.RenameTable(
                name: "auth_type",
                newName: "AuthType");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuthType",
                table: "AuthType",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_users_AuthType_auth_type_id",
                table: "users",
                column: "auth_type_id",
                principalTable: "AuthType",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
