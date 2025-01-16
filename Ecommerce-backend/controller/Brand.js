// Import the Brand model from the model folder
const { Brand } = require("../model/Brand");

exports.createBrands = async (req, res) => {
  // Create a new brands instance using the data from the request body
  const brands = new Brand(req.body);

  // Save the brands to the database
  brands
    .save()
    .then((doc) => {
      // If the save is successful, respond with a 201 status and the created brands
      res.status(201).json(doc);
    })
    .catch((err) => {
      // If an error occurs, log the error to the console and respond with a 400 status
      console.log(err);
      res.status(400).json(err);
    });
};

// Define an asynchronous function to fetch all brand documents
exports.fetchBrands = async (req, res) => {
  try {
    // Use the Brand model to retrieve all brand records from the database
    const brands = await Brand.find({}).exec();

    // Send the retrieved brands as a JSON response with a 200 (OK) status
    res.status(200).json(brands);
  } catch (error) {
    // Handle errors by sending a 400 (Bad Request) status with the error details
    res.status(400).json(error);
  }
};
