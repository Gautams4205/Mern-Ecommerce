# 🛒 MERN E-commerce App

A full-featured E-commerce web application built with the **MERN** stack (MongoDB, Express, React, Node.js), with user authentication handled by **Passport.js** and global state management using **Redux**.

## 🚀 Features

* 🔐 **Authentication & Authorization** using Passport.js (local strategy)

  * Secure login, signup, and logout
  * Role-based access control (Admin/User)
* 🧾 **Product Management**

  * Filter products by category, brand, rating, and price
  * View detailed product pages
  * Admin access to add, edit, or delete products
* 🛒 **Shopping Cart**

  * Add or remove items, update quantities
  * Cart data managed using Redux for persistence
* 💳 **Order System & Payments**

  * Place orders with user-specific order history
  * Checkout with dynamic price calculation
  * **Stripe integration** for secure online payments

## 🛠️ Tech Stack

* **Frontend**: React, Redux, Redux Thunk, Axios
* **Backend**: Node.js, Express.js, MongoDB, Passport.js
* **Database**: MongoDB (with Mongoose)
* **Authentication**: Passport.js (Local Strategy)
* **Other Tools**: dotenv, crypto, jsonwebtoken, nodemon

## 📂 Project Setup

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/Gautams4205/Mern-Ecommerce.git
```

<br>
```bash
cd Mern-Ecommerce
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `/server` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 4. Start the backend server

```bash
npm run dev
```

Now this project is running on the environment-defined port. Stripe payments may not work properly in local development; please check the [live deployed link](https://mern-ecommerce-one-olive.vercel.app/) for full payment functionality.
