module.exports = {
  order(parent, args, context) {
    return context.prisma
      .orderItem({
        id: parent.id
      })
      .order();
  },
  product(parent, args, context) {
    return context.prisma
      .orderItem({
        id: parent.id
      })
      .product();
  }
};
