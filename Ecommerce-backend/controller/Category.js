// Import the Category model from the model folder
const { Category } = require("../model/Category");

exports.createCategory = async (req, res) => {
  // Create a new Category instance using the data from the request body
  const category = new Category(req.body);

  // Save the Category to the database
  category
    .save()
    .then((doc) => {
      // If the save is successful, respond with a 201 status and the created Category
      res.status(201).json(doc);
    })
    .catch((err) => {
      // If an error occurs, log the error to the console and respond with a 400 status
      console.log(err);
      res.status(400).json(err);
    });
};

// Define an asynchronous function to fetch all categories
exports.fetchCategory = async (req, res) => {
  try {
    // Retrieve all category documents from the database
    const Categories = await Category.find({}).exec();

    // Send the retrieved categories as a JSON response with a 200 (OK) status
    res.status(200).json(Categories);
  } catch (error) {
    // Handle any errors and send a 400 (Bad Request) status with the error details
    res.status(400).json(error);
  }
};
