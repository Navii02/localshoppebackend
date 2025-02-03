const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  address: { type: String, required: true },
  productName:{ type:String, required: true},
  paymentMethod: { type: String, enum: ["Online Payment", "Cash On Delivery"], required: true },
  paymentId: { type: String, default: null }, // Razorpay payment ID or 'COD'
  amount: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Delivered"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
