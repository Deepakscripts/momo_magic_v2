import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = userData.cartData || {};
    const id = String(req.body.itemId);

    cartData[id] = (cartData[id] || 0) + 1;

    await userModel.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = userData.cartData || {};
    const id = String(req.body.itemId);

    if (cartData[id] > 0) {
      cartData[id] = cartData[id] - 1;
      if (cartData[id] <= 0) delete cartData[id];
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

// get user cart
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

/**
 * Merge a client-provided cart map into the user's server cart.
 * Body: { cart: { [itemId:string]: number } }
 * Returns: { success, cartData }
 */
const mergeCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const incoming = req.body.cart || {};

    const user = await userModel.findById(userId);
    const current = user?.cartData || {};
    const merged = { ...current };

    for (const [rawId, rawQty] of Object.entries(incoming)) {
      const id = String(rawId);
      const qty = Math.max(0, Number(rawQty) || 0);
      if (qty > 0) merged[id] = (merged[id] || 0) + qty;
    }

    await userModel.findByIdAndUpdate(userId, { cartData: merged }, { new: true });
    res.json({ success: true, cartData: merged, message: "Cart merged" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export { addToCart, removeFromCart, getCart, mergeCart }
