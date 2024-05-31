const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const rawBody = require('raw-body'); // Import raw-body module
const users = require("./Routes/userRoutes");
const cart = require("./Routes/cartItemRoutes");
const frontPage = require("./Routes/frontPageRoutes");
const checkoutStripe = require("./Routes/stripeRoutes");
const subs = require("./Routes/subscribersRoutes");
const fav = require("./Routes/favItemRoutes");
const forgotPass = require("./Routes/forgotPassRoutes");
const completedOrder = require("./Routes/completedOrderRoutes");
const completedOrders = require("./Models/completedOrderModel");
const guest = require("./Routes/guestRoute");

const stripe = require("stripe")(process.env.STRIPE_API);

app.use(express.static("public"));

const url = process.env.URL_FRONTEND
const liveURL = process.env.LIVE_URL_FRONTEND

const PORT = process.env.PORT || 3001;

// app.use(bodyParser.json());
app.use(express.json({verify: (req,res,buf) => { req.rawBody = buf }}));
app.use(cors());
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", users);
app.use("/api/cart", cart);
app.use("/api", frontPage);
app.use("/create-checkout-session", checkoutStripe);
app.use("/api/fav", fav);
app.use("/api", forgotPass);
app.use("/api", completedOrder);
app.use("/api", guest);
// app.use("/subscribers", subs);


const carts = []
// Endpoint to create a checkout session
app.post("/create-checkout-session", async (req, res) => {
const {userId, cartItems, formattedTime } = req.body;
console.log(cartItems)

// Function to remove '_id' field from each object in the array
const removeIdField = (arr) => {
  return arr.map(item => {
    const { _id, ...rest } = item;
    return rest;
  });
};

const baseURL = 'http://localhost:3000'; // Change this to your actual base URL


// Apply the function to remove '_id' field from each object in 'items' array
const modifiedItems = removeIdField(cartItems);
if(cartItems.length > 0){
  carts.push(modifiedItems)
}
  
  try {
    const cartItemsWithFullURLs = cartItems.map(item => ({
      ...item,
      image: baseURL + item.image
    }));
    
    // Prepare line items for Stripe checkout session
    const lineItems = cartItemsWithFullURLs.map((item, index) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100, // Price in cents
      },
      quantity: item.quantity,
    }));
    // // Prepare line items for Stripe checkout session
    // const lineItems = cartItems.map((item, index) => ({
    //   price_data: {
    //     currency: "usd",
    //     product_data: {
    //       name: item.name,
    //       images: [item.image],
    //     },
    //     unit_amount: item.price * 100, // Price in cents
    //   },
    //   quantity: item.quantity,
    // }));
  
    const currentDateTime = new Date().toISOString();

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${url}success`, // Redirect URL after successful payment
      cancel_url: `${url}cancel`,
      payment_intent_data: {
        receipt_email: "customer@example.com", // Specify customer's email for receipt
      },
      
    });

 
    // Send back the session URL and line items in the response
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});



// const endpointSecret = "whsec_467fc8a973ecbba8d4c684eb7ab44941419466427798593bf3060c703af0acaf";
const endpointSecret = "whsec_id672TlNnZ29g3tHfnhw2BVynKYh5TuH"


app.post('/webhooks', async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    // const rawBody = JSON.stringify(request.body); // Convert parsed body back to string
    event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log('failed', checkoutSessionAsyncPaymentFailed)
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.completed':
      const session = event.data.object;
      await saveOrderToDatabase(...carts)
      carts.length = 0
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



async function saveOrderToDatabase(orderDetails) {

  try {
    const result = await completedOrders.insertMany(orderDetails);
    console.log('Order details inserted into database:', result);
  } catch (error) {
    console.error('Error saving order to database:', error);
    // Handle database error (e.g., log, notify, retry, etc.)
  }
}


app.listen(4242, () => console.log('Webhooks Running on port 4242'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
