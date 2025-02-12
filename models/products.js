const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Category:{type: String},
    productName: { type: String, required: true },
    productQuantity: { type: String, required: true },
    actualPrice: { type: String, required: true },
    price: { type: String, required: true },
    expiryDate: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    reviews:[{
      name: String,
      comment: String,
      rating:String,
    }],
    userId: {
      required: true,
      type: String,
    }, 
    username:{
      type: String,
    },
    expectedDeliveryTime:{
      type: String,
    },
    location:{
      address: String,
      longitude: String,
      latitude: String
    },
    WishlistUserId:[{type:String,}],
    Cart:[
      {cartuserId: String,
      quantity:String,}
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
