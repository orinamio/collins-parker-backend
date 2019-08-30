const { getUserId } = require("../utils");

async function categories(parent, args, context) {
  return await context.prisma.categories();
}

async function cart(parent, args, context) {
  const userId = getUserId(context);
  const userCart = await context.prisma.carts({
    where: {
      owner: {
        id: args.id || userId
      }
    }
  });

  const cartItemsCount = await context.prisma.cartItems({
    where: {
      cart: {
        id: userCart[0].id
      }
    }
  });

  return {
    cart: userCart[0],
    count: cartItemsCount.length
  };
}

async function user(parent, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({
    id: args.id || userId
  });
}

async function search(parent, { searchString, ...args }, context) {
  return await context.prisma.productsConnection({
    ...args,
    where: {
      OR: [
        {
          name_contains: searchString
        },
        {
          brand: {
            name_contains: searchString
          }
        }
      ]
    }
  });
}

async function filter(parent, args, context) {
  let orderBy, gender, productType, size, price, argsObj, AND;

  // assign special filter arguments to corresponding variables
  searchString = args.searchString;
  orderBy = args.orderBy;
  gender = args.gender;
  productType = args.productType;
  size = args.size;
  price = args.price;
  AND = [];

  // make a copy of argument and delete special filter arguments
  // so that defined prisma arguments for productsConnection can be sent to prisma
  argsObj = { ...args };
  searchString && delete argsObj["searchString"];
  orderBy && delete argsObj["orderBy"];
  gender && delete argsObj["gender"];
  productType && delete argsObj["productType"];
  size && delete argsObj["size"];
  price && delete argsObj["price"];

  // define filter defaults
  // =>>> orderBy
  switch (orderBy) {
    case "ASC":
      orderBy = "price_ASC";
      break;
    case "DESC":
    default:
      orderBy = "price_DESC";
      break;
  }
  argsObj = { ...argsObj, orderBy };

  // searchString
  searchString &&
    (AND = [
      ...AND,
      {
        OR: [
          {
            name_contains: searchString
          },
          {
            brand: {
              name_contains: searchString
            }
          }
        ]
      }
    ]);

  // gender
  gender &&
    (AND = [
      ...AND,
      {
        gender
      }
    ]);

  // productType (category name)
  productType &&
    (AND = [
      ...AND,
      {
        category: {
          name: productType
        }
      }
    ]);

  // size
  size &&
    (AND = [
      ...AND,
      {
        sizes_some: {
          size
        }
      }
    ]);

  // price
  if (price) {
    let splitPrice = price.split("-");
    AND = [
      ...AND,
      {
        price_gt: Number(splitPrice[0]),
        price_lt: Number(splitPrice[1])
      }
    ];
  }

  return await context.prisma.productsConnection({
    ...argsObj,
    where: {
      AND
    }
  });
}

async function similarProducts(parent, { categoryId }, context) {
  return await context.prisma.products({
    where: {
      category: {
        id: categoryId
      }
    },
    first: 10
  });
}

async function products(parent, args, context) {
  return await context.prisma.productsConnection({
    ...args
  });
}

async function product(parent, { id }, context) {
  return await context.prisma.product({ id });
}

async function promoCodes(parent, args, context) {
  return await context.prisma.discountCodes({
    where: {
      type: "PROMO_CODE"
    }
  });
}

async function discountCode(parent, { code }, context) {
  return await context.prisma.discountCode({ code });
}

async function savedItems(parent, args, context) {
  const userId = getUserId(context);
  return await context.prisma.savedItemsConnection({
    where: {
      owner: {
        id: userId
      }
    }
  });
}

async function orders(parent, args, context) {
  const userId = getUserId(context);
  return await context.prisma.orders({
    where: {
      owner: {
        id: userId
      }
    }
  });
}

async function sizes(parent, args, context) {
  return await context.prisma.sizes();
}

module.exports = {
  categories,
  cart,
  user,
  search,
  filter,
  similarProducts,
  products,
  product,
  promoCodes,
  discountCode,
  savedItems,
  orders,
  sizes
};
