using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OwnsProductItemOrdered : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_ProductItemOrdered_ItemOrderedId",
                table: "OrderItems");

            migrationBuilder.DropTable(
                name: "ProductItemOrdered");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ItemOrderedId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "PaymentSummary_Id",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShippingAddress_Id",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "ItemOrderedId",
                table: "OrderItems",
                newName: "ItemOrdered_ProductId");

            migrationBuilder.AddColumn<string>(
                name: "ItemOrdered_PictureUrl",
                table: "OrderItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ItemOrdered_ProductName",
                table: "OrderItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemOrdered_PictureUrl",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "ItemOrdered_ProductName",
                table: "OrderItems");

            migrationBuilder.RenameColumn(
                name: "ItemOrdered_ProductId",
                table: "OrderItems",
                newName: "ItemOrderedId");

            migrationBuilder.AddColumn<int>(
                name: "PaymentSummary_Id",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ShippingAddress_Id",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ProductItemOrdered",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PictureUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductItemOrdered", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ItemOrderedId",
                table: "OrderItems",
                column: "ItemOrderedId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_ProductItemOrdered_ItemOrderedId",
                table: "OrderItems",
                column: "ItemOrderedId",
                principalTable: "ProductItemOrdered",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
