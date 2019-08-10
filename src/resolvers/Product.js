module.exports = {
  async sizes({ id }, args, context) {
    return await context.prisma
      .product({
        id
      })
      .sizes();
  },
  async images({ id }, args, context) {
    return await context.prisma
      .product({
        id
      })
      .images({ ...args });
  },
  async reviews({ id }, args, context) {
    return await context.prisma
      .product({
        id
      })
      .reviews({
        first: 10,
        ...args
      });
  }
};
