app.post("/create-checkout-session", async (req, res) => {
  const { cartItems } = req.body;

  try {
    // Prepare line items for Stripe checkout session
    const lineItems = cartItems.map((item) => ({
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

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});