const { Order } = require("../model/Order");

exports.createOrder = async (req, res) => {
  let order = new Order(req.body);
  order = await order.populate("user");

  order
    .save()
    .then((doc) => {
      res.status(201).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const Orders = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(Orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItems = await Cart.findByIdAndDelete(id);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.fetchAllOrders = async (req, res) => {
  // Initialize the query to fetch all orders
  let query = Order.find();

  // Sort orders by a specific field if _sort and _order query parameters are provided
  //TODO sort by discount price not actual

  if (req.query._sort) {
    let sortField = req.query._sort.replace("-", ""); // Remove "-" if present
    let sortOrder = req.query._sort.startsWith("-") ? -1 : 1; // -1 for desc, 1 for asc

    query = query.sort({ [sortField]: sortOrder });
  }

  // Clone the query to calculate the total number of documents matching the criteria
  const totalDocs = await query.clone().countDocuments().exec();

  // Implement pagination if _page and _limit query parameters are provided
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit; // Number of items per page
    const page = req.query._page; // Current page number
    query = query.skip(pageSize * (page - 1)).limit(pageSize); // Skip and limit for pagination
  }

  try {
    // Execute the query to fetch the orders
    const docs = await query.exec();

    // Set the total count in the response header for pagination
    res.set("X-Total-Count", totalDocs);

    // Respond with the fetched orders
    res.status(200).json(docs);
  } catch (error) {
    // Handle errors and send a 400 status response
    res.status(400).json(error);
  }
};
