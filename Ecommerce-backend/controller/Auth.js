// Import the User model from the model folder
const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  // Create a new User instance using the data from the request body
  const user = new User(req.body);

  // Save the User to the database
  user
    .save()
    .then((doc) => {
      // If the save is successful, respond with a 201 status and the created User
      res.status(201).json(doc);
    })
    .catch((err) => {
      // If an error occurs, log the error to the console and respond with a 400 status
      console.log(err);
      res.status(400).json(err);
    });
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(401).json({ message: "No such user exist " });
    } else if (user.password === req.body.password) {
      res
        .status(201)
        .json({ id: user.id, email: user.email, role: user.role, name: user.name, addresses: user.addresses, orders: user.orders });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
