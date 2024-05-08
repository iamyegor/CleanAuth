using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Change_type_of_email_verification_code_to_int : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "email_verification_token_expiry_time",
                table: "users",
                newName: "email_verification_code_expiry_time"
            );

            migrationBuilder.RenameColumn(
                name: "email_verification_token",
                table: "users",
                newName: "email_verification_code"
            );

            migrationBuilder.Sql("alter table users drop column if exists email_verification_code");
            migrationBuilder.Sql(
                "alter table users add column email_verification_code int null unique"
            );

            // migrationBuilder.AlterColumn<int>(
            //     name: "email_verification_code",
            //     table: "users",
            //     type: "integer",
            //     nullable: true,
            //     oldClrType: typeof(Guid),
            //     oldType: "uuid",
            //     oldNullable: true
            // );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "email_verification_code_expiry_time",
                table: "users",
                newName: "email_verification_token_expiry_time"
            );

            migrationBuilder.RenameColumn(
                name: "email_verification_code",
                table: "users",
                newName: "email_verification_token"
            );

            migrationBuilder.Sql("alter table users drop column if exists email_verification_code");
            migrationBuilder.Sql(
                @"
alter table 
users add column email_verification_code uuid null unique"
            );

            // migrationBuilder.AlterColumn<Guid>(
            //     name: "email_verification_token",
            //     table: "users",
            //     type: "uuid",
            //     nullable: true,
            //     oldClrType: typeof(int),
            //     oldType: "integer",
            //     oldNullable: true
            // );
        }
    }
}
