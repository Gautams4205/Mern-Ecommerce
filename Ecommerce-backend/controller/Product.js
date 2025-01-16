const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  // Create a new product instance using the data from the request body
  const product = new Product(req.body);

  // Save the product to the database
  product
    .save()
    .then((doc) => {
      // If the save is successful, respond with a 201 status and the created product
      res.status(201).json(doc);
    })
    .catch((err) => {
      // If an error occurs, log the error to the console and respond with a 400 status
      console.log(err);
      res.status(400).json(err);
    });
};

exports.fetchAllProducts = async (req, res) => {
  // Initialize the query to fetch all products
  let query = Product.find({});

  // Filter products by category if a category query parameter is provided
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }

  // Filter products by brand if a brand query parameter is provided
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
  }

  // Sort products by a specific field if _sort and _order query parameters are provided
  //TODO sort by discount price not actual
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
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
    // Execute the query to fetch the products
    const docs = await query.exec();

    // Set the total count in the response header for pagination
    res.set("X-Total-Count", totalDocs);

    // Respond with the fetched products
    res.status(200).json(docs);
  } catch (error) {
    // Handle errors and send a 400 status response
    res.status(400).json(error);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    // Respond with the fetched products
    res.status(200).json(product);
  } catch (error) {
    // Handle errors and send a 400 status response
    res.status(400).json(error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    // Respond with the fetched products
    res.status(200).json(product);
  } catch (error) {
    // Handle errors and send a 400 status response
    res.status(400).json(error);
  }
};
