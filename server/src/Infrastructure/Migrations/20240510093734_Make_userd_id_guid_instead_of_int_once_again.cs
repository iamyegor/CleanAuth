using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Make_userd_id_guid_instead_of_int_once_again : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AlterColumn<Guid>(
            //     name: "id",
            //     table: "users",
            //     type: "uuid",
            //     nullable: false,
            //     oldClrType: typeof(int),
            //     oldType: "integer")
            //     .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
            migrationBuilder.Sql("alter table users drop column id");
            migrationBuilder.Sql(
                "alter table users add column id uuid primary key default gen_random_uuid()"
            );

            migrationBuilder.AddColumn<bool>(
                name: "is_phone_number_verified",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AddColumn<string>(
                name: "phone_number",
                table: "users",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "phone_number_verification_code",
                table: "users",
                type: "integer",
                nullable: true
            );

            migrationBuilder.AddColumn<DateTime>(
                name: "phone_number_verification_code_expiry_time",
                table: "users",
                type: "timestamp with time zone",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_users_phone_number",
                table: "users",
                column: "phone_number",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "IX_users_phone_number", table: "users");

            migrationBuilder.DropColumn(name: "is_phone_number_verified", table: "users");

            migrationBuilder.DropColumn(name: "phone_number", table: "users");

            migrationBuilder.DropColumn(name: "phone_number_verification_code", table: "users");

            migrationBuilder.DropColumn(
                name: "phone_number_verification_code_expiry_time",
                table: "users"
            );

            migrationBuilder.Sql("alter table users drop column id");
            migrationBuilder.Sql("alter table users add column id serial primary key");

            // migrationBuilder.AlterColumn<int>(
            //     name: "id",
            //     table: "users",
            //     type: "integer",
            //     nullable: false,
            //     oldClrType: typeof(Guid),
            //     oldType: "uuid")
            //     .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
        }
    }
}
