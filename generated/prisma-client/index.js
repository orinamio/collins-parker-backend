"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "AddressType",
    embedded: false
  },
  {
    name: "DiscountCodeType",
    embedded: false
  },
  {
    name: "Gender",
    embedded: false
  },
  {
    name: "OrderStatus",
    embedded: false
  },
  {
    name: "Role",
    embedded: false
  },
  {
    name: "Address",
    embedded: false
  },
  {
    name: "Cart",
    embedded: false
  },
  {
    name: "CartItem",
    embedded: false
  },
  {
    name: "Category",
    embedded: false
  },
  {
    name: "DiscountCode",
    embedded: false
  },
  {
    name: "Image",
    embedded: false
  },
  {
    name: "Order",
    embedded: false
  },
  {
    name: "OrderItem",
    embedded: false
  },
  {
    name: "Product",
    embedded: false
  },
  {
    name: "Review",
    embedded: false
  },
  {
    name: "SavedItem",
    embedded: false
  },
  {
    name: "Size",
    embedded: false
  },
  {
    name: "Brand",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/orinami-olatunji-e12313/collins-parker-backend/dev`
});
exports.prisma = new exports.Prisma();
