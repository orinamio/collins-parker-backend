const { getUserId } = require("../utils");

module.exports = {
  async owner(parent, args, context) {
    const id = getUserId(context);
    return await context.prisma.user({ id });
  },
  async items({ id }, args, context) {
    return await context.prisma.orderItems({ where: { order: { id } } });
  }
};
