const { getUserId } = require("../utils");

module.exports = {
  async cart(parent, args, context) {
    const userId = getUserId(context);
    const cartArray = await context.prisma.carts({
      where: {
        owner: {
          id: userId
        }
      }
    });
    return cartArray[0];
  },
  async product({ id }, args, context) {
    return await context.prisma
      .cartItem({
        id
      })
      .product();
  },
  async size({ id }, args, context) {
    return await context.prisma
      .cartItem({
        id
      })
      .size();
  }
};
