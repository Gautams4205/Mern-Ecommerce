const { Cart } = require("../model/Cart");

exports.addToCart = async (req, res) => {
  let cart = new Cart(req.body);
  cart = await cart.populate("product");

  cart
    .save()
    .then((doc) => {
      res.status(201).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const cartItems = await Cart.find({ user: user }).populate("user").populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItems = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const cartItems = await Cart.findByIdAndDelete(id);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};
