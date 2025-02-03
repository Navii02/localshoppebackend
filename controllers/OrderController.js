
const Order = require("../models/Order");
const Product = require("../models/products");
exports.orders=async(req,res)=>{
    try {
        const { userId, productId, address, paymentMethod, paymentId, amount,productName } = req.body;
        console.log(req.body);
        
    
        if (!userId || !productId || !address || !paymentMethod || !amount) {
          return res.status(400).json({ error: "Missing required fields" });
        }
    
        const newOrder = new Order({
          userId,
          productId,
          address,
          productName,
          paymentMethod,
          paymentId: paymentMethod === "Cash On Delivery" ? "COD" : paymentId,
          amount,
          status: paymentMethod === "Cash On Delivery" ? "Pending" : "Paid",
        });
    
        await newOrder.save();
        res.status(200).json({ message: "Order placed successfully!", order: newOrder });
      } catch (error) {
        res.status(406).json({ error: "Failed to place order", details: error.message });
      }
    
}

exports.OrderDetails = async (req, res) => {
  const userId = req.payload;
  console.log("User ID:", userId);

  try {
    // Fetch product IDs associated with the user
    const products = await Product.find({ userId }).select("_id");
    const productIds = products.map((product) => product._id);

    console.log("Product IDs:", productIds);

    if (productIds.length === 0) {
      return res.status(406).json({ message: "No products found for this user." });
    }

    // Check if any of these product IDs exist in the Order collection
    const orders = await Order.find({ productId: { $in: productIds } });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for these products." });
    }

    res.status(200).json({ orders });

  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
