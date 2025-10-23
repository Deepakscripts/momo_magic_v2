//Later we have to delete this
// DEV-ONLY seeding controller
import foodModel from "../models/foodModel.js";

/**
 * New vegetarian-only menu for MMC
 * Images intentionally blank for now; Admin can upload later.
 */
const MENU = [
  // SIZZLERS
  { name: "Exotic Veg Sizzlers", price: 300, category: "Sizzlers" },
  { name: "Exotic Paneer Sizzlers", price: 340, category: "Sizzlers" },

  // COFFEE
  { name: "Hot Coffee", price: 50, category: "Coffee" },
  { name: "Cold Coffee", price: 120, category: "Coffee" },
  { name: "Cold Coffee (with Ice Cream)", price: 140, category: "Coffee" },
  { name: "Java Chip Coffee", price: 160, category: "Coffee" },

  // MAGGI
  { name: "Special Maggi", price: 100, category: "Maggi" },
  { name: "Plain Masala Maggi", price: 60, category: "Maggi" },
  { name: "Veg Maggi", price: 70, category: "Maggi" },
  { name: "Cheese Maggi", price: 80, category: "Maggi" },
  { name: "Veg Cheese Maggi", price: 90, category: "Maggi" },
  { name: "Cheese Corn Maggi", price: 100, category: "Maggi" },
  { name: "Chilli Maggi", price: 80, category: "Maggi" },
  { name: "Chilli Garlic Maggi", price: 100, category: "Maggi" },
  { name: "Onion Capsicum Maggi", price: 90, category: "Maggi" },
  { name: "Paneer Maggi", price: 100, category: "Maggi" },

  // DESSERT
  { name: "Choco Lava", price: 80, category: "Dessert" },
  { name: "ChocoChip Brownie", price: 120, category: "Dessert" },
  { name: "Nutella Brownie", price: 120, category: "Dessert" },
  { name: "Sizzling Brownie", price: 160, category: "Dessert" },

  // BEVERAGES (mocks, shakes, etc.)
  { name: "Fresh Lime Soda", price: 80, category: "Beverages" },
  { name: "Masala Lemonade", price: 90, category: "Beverages" },
  { name: "Hot Chocolate", price: 100, category: "Beverages" },
  { name: "Virgin Mojito", price: 100, category: "Beverages" },
  { name: "Kiwi Mojito", price: 100, category: "Beverages" },
  { name: "Pina Colada Mojito", price: 100, category: "Beverages" },
  { name: "Green Apple Mojito", price: 100, category: "Beverages" },
  { name: "Bubble Gum Mojito", price: 100, category: "Beverages" },
  { name: "Spicy Mango Mojito", price: 100, category: "Beverages" },
  { name: "Blue Lagoon Mojito", price: 100, category: "Beverages" },
  { name: "Kala Khatta Mojito", price: 100, category: "Beverages" },
  { name: "RedBull Mojito", price: 150, category: "Beverages" },
  { name: "Strawberry Shake", price: 140, category: "Beverages" },
  { name: "Butter Scotch Shake", price: 140, category: "Beverages" },
  { name: "Chocolate Shake", price: 140, category: "Beverages" },
  { name: "Kitkat Shake", price: 160, category: "Beverages" },
  { name: "Oreo Shake", price: 160, category: "Beverages" },
  { name: "Brownie Shake", price: 160, category: "Beverages" },
  { name: "Lotus Biscoff Shake", price: 160, category: "Beverages" },
  { name: "Nutella Shake", price: 160, category: "Beverages" },
  { name: "Nutella Brownie Shake", price: 160, category: "Beverages" },
  { name: "Ferrero Rocher Shake", price: 160, category: "Beverages" },
  { name: "Rasmalai Shake", price: 160, category: "Beverages" },

  // CHINESE MAGIC (starters + mains)
  { name: "French Fries", price: 100, category: "Chinese Magic" },
  { name: "French Fries Peri Peri", price: 120, category: "Chinese Magic" },
  { name: "Peri Peri Cheese Loaded Fries", price: 150, category: "Chinese Magic" },
  { name: "Chilli Potato", price: 170, category: "Chinese Magic" },
  { name: "Honey Potato Chilli", price: 190, category: "Chinese Magic" },
  { name: "Paneer Chilli", price: 230, category: "Chinese Magic" },
  { name: "Crispy Veg Chilli Garlic", price: 230, category: "Chinese Magic" },
  { name: "Baby Corn Chilli", price: 230, category: "Chinese Magic" },
  { name: "Baby Corn Mushroom Chilli", price: 240, category: "Chinese Magic" },
  { name: "Mushroom Chilli", price: 230, category: "Chinese Magic" },
  { name: "Veg Manchurian", price: 170, category: "Chinese Magic" },
  { name: "Spring Roll", price: 150, category: "Chinese Magic" },
  { name: "Crispy Spring Roll", price: 170, category: "Chinese Magic" },
  { name: "Fried Rice", price: 160, category: "Chinese Magic" },
  { name: "Paneer Fried Rice", price: 180, category: "Chinese Magic" },
  { name: "Paneer Chilli Rice", price: 240, category: "Chinese Magic" },

  // SOUP
  { name: "Thukpa", price: 120, category: "Soup" },
  { name: "Manchow", price: 120, category: "Soup" },
  { name: "Talumein", price: 120, category: "Soup" },
  { name: "Sweet Corn", price: 120, category: "Soup" },
  { name: "Hot & Sour", price: 120, category: "Soup" },
  { name: "Lemon Coriander", price: 120, category: "Soup" },
  { name: "Wanton", price: 120, category: "Soup" },

  // PASTA
  { name: "White Sauce Pasta", price: 210, category: "Pasta" },
  { name: "Red Sauce Pasta", price: 210, category: "Pasta" },
  { name: "Mix Sauce Pasta", price: 210, category: "Pasta" },
  { name: "Peri Peri Pasta", price: 210, category: "Pasta" },

  // MOBURG
  { name: "Veg Moburg", price: 90, category: "Moburg" },
  { name: "Paneer Moburg", price: 100, category: "Moburg" },

  // MMC SPECIAL DISHES
  { name: "Crispy Corn Salt & Pepper", price: 190, category: "MMC Special Dishes" },
  { name: "Barbeque Papery Paneer", price: 240, category: "MMC Special Dishes" },
  { name: "Taiwan Special Chilli Mushroom & Baby Corn", price: 260, category: "MMC Special Dishes" },

  // CHINESE MAGIC NOODLES
  { name: "Schezwan Noodles", price: 210, category: "Chinese Magic Noodles" },
  { name: "Shanghai Noodles", price: 210, category: "Chinese Magic Noodles" },
  { name: "Hakka Noodles", price: 210, category: "Chinese Magic Noodles" },
  { name: "Chilli Garlic Noodles", price: 210, category: "Chinese Magic Noodles" },
  { name: "Singapuri Noodles", price: 210, category: "Chinese Magic Noodles" },
  { name: "Butter Chilli Garlic Noodles", price: 230, category: "Chinese Magic Noodles" },
  { name: "Exotic Noodles", price: 240, category: "Chinese Magic Noodles" },

  // CHINESE MAGIC RICE
  { name: "Schezwan Rice", price: 210, category: "Chinese Magic Rice" },
  { name: "Shanghai Rice", price: 210, category: "Chinese Magic Rice" },
  { name: "Hakka Rice", price: 210, category: "Chinese Magic Rice" },
  { name: "Chilli Garlic Rice", price: 210, category: "Chinese Magic Rice" },
  { name: "Singapuri Rice", price: 210, category: "Chinese Magic Rice" },
  { name: "Bankok Special Rice", price: 220, category: "Chinese Magic Rice" },
  { name: "Korean Rice", price: 220, category: "Chinese Magic Rice" },
  { name: "Butter Chilli Garlic Rice", price: 230, category: "Chinese Magic Rice" },
  { name: "Exotic Rice", price: 240, category: "Chinese Magic Rice" },

  // MOMOS — three clear sections so customers aren't confused
  // Special Magic Momos (8 pcs)
  { name: "Veg Oyster (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Panfried (8 pcs)", price: 180, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Smokey (8 pcs)", price: 180, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Schezwan (8 pcs)", price: 180, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Crispy (8 pcs)", price: 180, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Pizza (8 pcs)", price: 180, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Chilli (8 pcs)", price: 180, category: "Momos • Special Magic (8 pcs)" },
  { name: "Veg Chilli Garlic (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },

  { name: "Paneer Oyster (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Panfried (8 pcs)", price: 200, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Smokey (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Schezwan (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Crispy (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Pizza (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Chilli (8 pcs)", price: 190, category: "Momos • Special Magic (8 pcs)" },
  { name: "Paneer Chilli Garlic (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },

  { name: "Cheese Corn Oyster (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Cheese Corn Panfried (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Cheese Corn Smokey (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Cheese Corn Schezwan (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Cheese Corn Crispy (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Cheese Corn Pizza (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },
  { name: "Cheese Corn Chilli (8 pcs)", price: 210, category: "Momos • Special Magic (8 pcs)" },

  { name: "Mushroom/Other Veg Oyster (8 pcs)", price: 230, category: "Momos • Special Magic (8 pcs)" },

  // Steam & Fried Momos
  { name: "Veg Steam", price: 100, category: "Momos • Steam & Fried" },
  { name: "Veg Fried", price: 120, category: "Momos • Steam & Fried" },
  { name: "Veg Peri Peri", price: 140, category: "Momos • Steam & Fried" },

  { name: "Paneer Steam", price: 110, category: "Momos • Steam & Fried" },
  { name: "Paneer Fried", price: 130, category: "Momos • Steam & Fried" },
  { name: "Paneer Peri Peri", price: 160, category: "Momos • Steam & Fried" },

  { name: "Cheese Corn Steam", price: 130, category: "Momos • Steam & Fried" },
  { name: "Cheese Corn Fried", price: 150, category: "Momos • Steam & Fried" },
  { name: "Cheese Corn Peri Peri", price: 160, category: "Momos • Steam & Fried" },

  { name: "Chicken Steam (placeholder veg-only menu won’t show)", price: 120, category: "Momos • Steam & Fried" },

  // Tandoori Momos (8 pcs) — vegetarian set
  { name: "Veg Dry (8 pcs)", price: 180, category: "Momos • Tandoori (8 pcs)" },
  { name: "Veg Afghani (8 pcs)", price: 180, category: "Momos • Tandoori (8 pcs)" },
  { name: "Veg Cocktail (8 pcs)", price: 180, category: "Momos • Tandoori (8 pcs)" },
  { name: "Veg Achari (8 pcs)", price: 180, category: "Momos • Tandoori (8 pcs)" },

  { name: "Paneer Dry (8 pcs)", price: 190, category: "Momos • Tandoori (8 pcs)" },
  { name: "Paneer Afghani (8 pcs)", price: 190, category: "Momos • Tandoori (8 pcs)" },
  { name: "Paneer Cocktail (8 pcs)", price: 190, category: "Momos • Tandoori (8 pcs)" },
  { name: "Paneer Achari (8 pcs)", price: 190, category: "Momos • Tandoori (8 pcs)" },

  { name: "Cheese Corn Dry (8 pcs)", price: 210, category: "Momos • Tandoori (8 pcs)" },
  { name: "Cheese Corn Afghani (8 pcs)", price: 210, category: "Momos • Tandoori (8 pcs)" },
  { name: "Cheese Corn Cocktail (8 pcs)", price: 210, category: "Momos • Tandoori (8 pcs)" },
  { name: "Cheese Corn Achari (8 pcs)", price: 210, category: "Momos • Tandoori (8 pcs)" }
];

export const resetMenu = async (req, res) => {
  try {
    await foodModel.deleteMany({});
    const docs = MENU.map((m) => ({
      ...m,
      description: m.description || "Freshly prepared."
    }));
    await foodModel.insertMany(docs);
    res.json({ success: true, message: "Menu reset with new vegetarian items", count: docs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Seed failed" });
  }
};
