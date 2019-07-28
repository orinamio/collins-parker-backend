const { getUserId } = require("../utils");

module.exports = {
  async owner(parent, args, context) {
    const id = getUserId(context);
    return await context.prisma.user({ id });
  },
  async product({ id }, args, context) {
    return context.prisma
      .savedItem({
        id
      })
      .product();
  }
};
