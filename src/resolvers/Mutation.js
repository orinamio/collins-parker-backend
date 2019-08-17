const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId, randomString } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const random = randomString();
  const sn = "CP-" + random.toUpperCase();

  const user = await context.prisma.createUser({
    ...args,
    sn,
    password,
    cart: {
      create: {}
    }
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  let user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  delete user["password"];

  return {
    token,
    user
  };
}

async function addToCart(parent, args, context, info) {
  const userId = getUserId(context);

  // get user cart
  const getUserCart = await context.prisma.carts({
    where: {
      owner: {
        id: userId
      }
    }
  });

  const userCart = getUserCart[0];
  const userCartId = userCart.id;

  // get product
  const product = await context.prisma.product({ id: args.productId });
  let total = product.price * args.quantity;

  if (product.discountedPrice) {
    total = product.discountedPrice * args.quantity;
  }

  // update cart total, subtotal and shippingFee
  let newCartTotal = userCart.total ? userCart.total : 0,
    newCartShippingFee = userCart.shippingFee ? userCart.shippingFee : 0,
    newCartSubtotal = userCart.subtotal ? userCart.subtotal : 0;

  newCartSubtotal += total;
  product.shippingFee && (newCartShippingFee += product.shippingFee);
  newCartTotal = newCartSubtotal + newCartShippingFee;

  await context.prisma.updateCart({
    data: {
      subtotal: newCartSubtotal,
      shippingFee: newCartShippingFee,
      total: newCartTotal
    },
    where: {
      id: userCartId
    }
  });

  return await context.prisma.createCartItem({
    quantity: args.quantity,
    total,
    cart: {
      connect: { id: userCartId }
    },
    product: {
      connect: {
        id: args.productId
      }
    }
  });
}

async function removeItemFromCart(parent, args, context, info) {
  const userId = getUserId(context);
  const user = await context.prisma.user({ id: userId });
  let cartItem;

  if (!user) {
    throw new Error("Not authorized");
  }

  cartItem = await context.prisma.deleteCartItem({ id: args.cartItemId });

  if (!cartItem) {
    throw new Error("Couldn't remove item from cart");
  }

  return {
    success: true
  };
}

async function createOrder(parent, args, context, info) {
  const userId = getUserId(context);
  let getUserCart, userCart, userCartId, cartItems, order;

  // get user cart id
  getUserCart = await context.prisma.carts({
    where: {
      owner: {
        id: userId
      }
    }
  });

  userCart = getUserCart[0];
  userCartId = userCart.id;

  // fetch cart items
  cartItems = await context.prisma
    .cartItems({
      where: {
        cart: {
          id: userCartId
        }
      }
    })
    .$fragment(`{ id product { id price discountedPrice } total quantity }`);

  // create order
  const { shippingFee, subtotal, total } = userCart;
  order = await context.prisma.createOrder({
    owner: {
      connect: {
        id: userId
      }
    },
    status: "RECEIVED",
    shippingFee,
    subtotal,
    total
  });

  // for each cart item, create an order item and connect the order id to each order item
  cartItems.map(async cartItem => {
    // get product
    let price = cartItem.product.price;

    if (cartItem.product.discountedPrice)
      price = cartItem.product.discountedPrice;

    return await context.prisma.createOrderItem({
      order: {
        connect: {
          id: order.id
        }
      },
      product: {
        connect: {
          id: cartItem.product.id
        }
      },
      price,
      quantity: cartItem.quantity,
      total: cartItem.total
    });
  });

  // delete cart items
  cartItems.map(async cartItem => {
    await context.prisma.deleteCartItem({
      id: cartItem.id
    });
  });

  // fetch and return the created order with order items
  return await context.prisma.order({ id: order.id });
}

async function cancelOrder(parent, { args: { id } }, context, info) {
  const userId = getUserId(context);
  return await context.prisma.updateOrder({
    where: {
      id
    },
    data: {
      cancelled: true
    }
  });
}

async function updateUser(parent, args, context, info) {
  const userId = getUserId(context);
  return await context.prisma.updateUser({
    where: { id: userId },
    data: {
      ...args
    }
  });
}

async function deactivateUser(parent, args, context, info) {
  const userId = getUserId(context);
  return await context.prisma.updateUser({
    where: { id: userId },
    data: {
      disabled: true
    }
  });
}

async function createAddress(parent, args, context, info) {
  const userId = getUserId(context);
  return await context.prisma.createAddress({
    ...args,
    owner: {
      connect: {
        id: userId
      }
    }
  });
}

async function updateAddress(parent, args, context, info) {
  return await context.prisma.updateAddress({
    where: { id: args.id },
    data: {
      ...args
    }
  });
}

async function deleteAddress(parent, args, context, info) {
  return await context.prisma.deleteAddress({ id: args.id });
}

async function saveItem(parent, args, context, info) {
  const userId = getUserId(context);
  return await context.prisma.createSavedItem({
    owner: {
      connect: {
        id: userId
      }
    },
    product: {
      connect: {
        id: args.productId
      }
    }
  });
}

async function deleteSavedItem(parent, args, context, info) {
  return await context.prisma.deleteSavedItem({ id: args.id });
}

async function createReview(parent, args, context, info) {
  const userId = getUserId(context);
  return await context.prisma.createReview({
    ...args,
    owner: {
      connect: {
        id: userId
      }
    },
    product: {
      connect: {
        id: args.productId
      }
    }
  });
}

module.exports = {
  login,
  signup,
  addToCart,
  removeItemFromCart,
  createOrder,
  cancelOrder,
  updateUser,
  deactivateUser,
  createAddress,
  updateAddress,
  deleteAddress,
  saveItem,
  deleteSavedItem,
  createReview
};
