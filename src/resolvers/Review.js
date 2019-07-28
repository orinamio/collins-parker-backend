const { getUserId } = require("../utils");

module.exports = {
  owner(parent, args, context) {
    const id = getUserId(context);
    return context.prisma.user({ id });
  },
  product({ id }, args, context) {
    return context.prisma
      .review({
        id
      })
      .product();
  }
};
