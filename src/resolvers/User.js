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
  async orders(parent, args, context) {
    const userId = getUserId(context);
    return await context.prisma.orders({
      where: {
        owner: {
          id: userId
        }
      }
    });
  },
  async savedItems(parent, args, context) {
    const userId = getUserId(context);
    return await context.prisma.savedItems({
      where: {
        owner: {
          id: userId
        }
      }
    });
  },
  async addresses(parent, args, context) {
    const userId = getUserId(context);
    return await context.prisma.addresses({
      where: {
        owner: {
          id: userId
        }
      }
    });
  }
};
