// Import the User model from the model folder
const { User } = require("../model/User");



exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve all User documents from the database
    const user = await User.findById(id).exec();

    // Send the retrieved user as a JSON response with a 200 (OK) status
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors and send a 400 (Bad Request) status with the error details
    res.status(400).json(error);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    // Respond with the fetched user
    res.status(200).json(user);
  } catch (error) {
    // Handle errors and send a 400 status response
    res.status(400).json(error);
  }
};