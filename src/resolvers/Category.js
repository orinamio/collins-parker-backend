module.exports = {
  async image({ id }, args, context) {
    return await context.prisma
      .category({
        id
      })
      .image();
  }
};
