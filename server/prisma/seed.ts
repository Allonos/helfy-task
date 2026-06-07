import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  // Electronics
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium over-ear headphones with 30hr battery life and active noise cancellation.",
    price: 149.99,
    stock: 40,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/headphones/600/400",
  },
  {
    name: '4K Ultra HD Smart TV 55"',
    description:
      "55-inch 4K OLED smart TV with HDR10+, built-in streaming apps, and voice control.",
    price: 899.99,
    stock: 15,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/smarttv/600/400",
  },
  {
    name: "Mechanical Gaming Keyboard",
    description:
      "Compact TKL mechanical keyboard with RGB backlighting and tactile blue switches.",
    price: 89.99,
    stock: 60,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/keyboard/600/400",
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof IPX7 speaker with 360° surround sound and 20-hour playtime.",
    price: 59.99,
    stock: 80,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/speaker/600/400",
  },
  {
    name: "Wireless Charging Pad",
    description:
      "15W fast wireless charger compatible with all Qi-enabled devices.",
    price: 29.99,
    stock: 120,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/charger/600/400",
  },

  // Clothing
  {
    name: "Classic Slim-Fit Chinos",
    description:
      "Versatile slim-fit chinos in stretch cotton blend, available in multiple colors.",
    price: 49.99,
    stock: 100,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/chinos/600/400",
  },
  {
    name: "Premium Merino Wool Sweater",
    description:
      "Lightweight merino wool crew-neck sweater, naturally temperature-regulating.",
    price: 79.99,
    stock: 55,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/sweater/600/400",
  },
  {
    name: "Waterproof Hiking Jacket",
    description:
      "3-layer Gore-Tex shell jacket with sealed seams and adjustable hood.",
    price: 199.99,
    stock: 30,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/jacket/600/400",
  },
  {
    name: "Organic Cotton T-Shirt",
    description:
      "Soft 100% GOTS-certified organic cotton tee with a relaxed modern fit.",
    price: 24.99,
    stock: 200,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/tshirt/600/400",
  },
  {
    name: "Leather Chelsea Boots",
    description:
      "Full-grain leather Chelsea boots with elastic side panels and stacked heel.",
    price: 159.99,
    stock: 45,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/boots/600/400",
  },

  // Books
  {
    name: "The Pragmatic Programmer",
    description:
      "A timeless guide to software craftsmanship covering best practices and career advice.",
    price: 34.99,
    stock: 75,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/pragprog/600/400",
  },
  {
    name: "Clean Code",
    description:
      "Robert C. Martin's definitive guide to writing readable, maintainable software.",
    price: 29.99,
    stock: 90,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/cleancode/600/400",
  },
  {
    name: "Designing Data-Intensive Applications",
    description:
      "Deep dive into the principles behind reliable, scalable, and maintainable systems.",
    price: 44.99,
    stock: 50,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/ddia/600/400",
  },
  {
    name: "Atomic Habits",
    description:
      "James Clear's proven framework for building good habits and breaking bad ones.",
    price: 19.99,
    stock: 150,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/atomichabits/600/400",
  },
  {
    name: "The Art of War",
    description:
      "Sun Tzu's ancient treatise on strategy, leadership, and competitive advantage.",
    price: 9.99,
    stock: 200,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/artofwar/600/400",
  },

  // Home
  {
    name: "Ceramic Pour-Over Coffee Set",
    description:
      "Handcrafted ceramic dripper and carafe set for a refined pour-over brewing experience.",
    price: 54.99,
    stock: 35,
    category: "Home",
    imageUrl: "https://picsum.photos/seed/pourover/600/400",
  },
  {
    name: "Bamboo Cutting Board Set",
    description:
      "Set of 3 eco-friendly bamboo cutting boards with juice grooves and non-slip feet.",
    price: 39.99,
    stock: 70,
    category: "Home",
    imageUrl: "https://picsum.photos/seed/cuttingboard/600/400",
  },
  {
    name: "Linen Duvet Cover Set",
    description:
      "100% stonewashed French linen duvet cover with two pillowcases, queen size.",
    price: 129.99,
    stock: 25,
    category: "Home",
    imageUrl: "https://picsum.photos/seed/duvet/600/400",
  },
  {
    name: "Scented Soy Candle Collection",
    description:
      "Set of 4 hand-poured soy wax candles in amber glass jars with wooden wicks.",
    price: 44.99,
    stock: 60,
    category: "Home",
    imageUrl: "https://picsum.photos/seed/candles/600/400",
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Double-wall vacuum insulated 32oz bottle that keeps drinks cold 24hrs or hot 12hrs.",
    price: 34.99,
    stock: 110,
    category: "Home",
    imageUrl: "https://picsum.photos/seed/waterbottle/600/400",
  },
];

async function main(): Promise<void> {
  console.log("Seeding database...");

  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
