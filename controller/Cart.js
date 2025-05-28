const { Cart } = require("../model/Cart");

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  let cart = new Cart({ ...req.body, user: id });
  cart = await cart.populate("product");

  cart
    .save()
    .then((doc) => {
      res.status(201).json(doc);
    })
    .catch((err) => {
      
      res.status(400).json(err);
    });
};

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    const result = await cart.populate("product");
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error);
  }
};
