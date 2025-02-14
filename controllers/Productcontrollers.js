const multer = require("multer");
const Product = require("../models/products"); // Import your Product model
const BusinessUsers = require("../models/BusinessUser"); // Import BusinessUser model

// Controller for adding a product

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      productQuantity,
      actualPrice,
      price,
      expiryDate,
      description,
      address,
      longitude,
      latitude,
      Category,
      expectedDeliveryTime
    } = req.body;
    console.log(Category);
    console.log(req.body);
    
    
    const images = req.files; // Multer will populate `req.files` with uploaded images
    const userId = req.payload; // Assuming userId is extracted from a token or session

    if (
      !productName ||
      !productQuantity ||
      !actualPrice ||
      !price ||
      !expiryDate ||
      !description ||
      !Category ||
      !address ||
      !longitude ||
      !expectedDeliveryTime||
      !latitude
    )      {
      return res.status(400).json({ message: "All fields are required" });

      
    }

    // Fetch username from the BusinessUsers model using userId
    const user = await BusinessUsers.findById(userId).select("username");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Unable to associate username." });
    }

    const username = user.username; // Extract the username

    // Create a new product with the fetched username
    const product = new Product({
      Category,
      productName,
      productQuantity,
      actualPrice,
      price,
      expiryDate,
      description,
      images: images.map((image) => image.path), // Store file paths of uploaded images
      userId,
      username,
      expectedDeliveryTime,
      location: {
        address: address,
        longitude: longitude,
        latitude: latitude,
      },
    });

    // Save the product to the database
    await product.save();

    res.status(200).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Haversine formula to calculate the distance in kilometers
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

exports.allproducts = async (req, res) => {
  const userId = req.payload; // Assuming you have user data in req.payload
  const { location } = req.query; // Location passed from the frontend
  console.log("Query Params:", req.query);

  if (!location) {
    const products = await Product.find();
    return res.status(200).json({ products });
  }

  try {
    // Parse the location JSON string
    const userLocation = JSON.parse(location);
    const { lat, lon } = userLocation;

    // Validate the latitude and longitude
    if (!lat || !lon) {
      const products = await Product.find();
      res.status(200).json(products);
    }else{

    // Fetch all products (this can be optimized depending on your use case)
    const products = await Product.find();

    // Filter products based on the distance (within 10 km)
    const nearbyProducts = products.filter((product) => {
      // Parse product location latitude and longitude
      const productLat = parseFloat(product.location.latitude); // Parse latitude to float
      const productLon = parseFloat(product.location.longitude); // Parse longitude to float

      // Check if parsing was successful
      if (isNaN(productLat) || isNaN(productLon)) {
        return false; // Skip products with invalid location
      }

      const distance = haversineDistance(lat, lon, productLat, productLon);
      return distance <= 10; // 10 km radius
    });

    res.status(200).json({ products: nearbyProducts });
  }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.userproducts = async (req, res) => {
  const userId = req.payload;
  try {
    const userproducts = await Product.find({ userId });
    res.status(200).json(userproducts);
  } catch (error) {
    res.status(401).json(error);
  }
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.payload;
  const {
    productName,
    productQuantity,
    actualPrice,
    price,
    expiryDate,
    description,
    expectedDeliveryTime,
  } = req.body;
  const images = req.files;

  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productQuantity,
        actualPrice,
        price,
        expiryDate,
        description,
        expectedDeliveryTime,

        images: [
          ...(req.body.existingImages || []),
          ...(images ? images.map((image) => image.path) : []),
        ],
        userId,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(500).json({ message: "Failed to update product" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
exports.updateProductWithoutPicture = async (req, res) => {
  const { id } = req.params;
  const userId = req.payload;
  const {
    productName,
    productQuantity,
    actualPrice,
    price,
    expiryDate,
    description,
    expectedDeliveryTime,
  } = req.body;


  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productQuantity,
        actualPrice,
        price,
        expiryDate,
        description,
        expectedDeliveryTime,

      
        userId,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(500).json({ message: "Failed to update product" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    res.status(401).json(error);
  }
};
exports.addToWishlist = async (req, res) => {
  const userId = req.payload;
  const { _id } = req.body;
  console.log(req.body);

  try {
    // Find the product by ID
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user ID is already in the WishlistUserId array
    if (product.WishlistUserId.includes(userId)) {
      return res.status(406).json({ message: "Product already in wishlist" });
    }

    // Add the user ID to the WishlistUserId array
    product.WishlistUserId.push(userId);
    await product.save();

    res
      .status(200)
      .json({ message: "Added to wishlist successfully", product });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Failed to add to wishlist", error });
  }
};
exports.deletewishlist=async(req,res) => {

  const{productId}=req.body
  userId=req.payload
  //console.log(userId,productId);
  try {

    const product = await Product.findByIdAndUpdate(
        productId,
        { $pull: { WishlistUserId: userId } }, 
        { new: true }
    );

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Removed from wishlist", product });
} catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error" });
}
  
  
}
exports.getWishlist = async (req, res) => {
  const userId = req.payload; // Extracted from the token by JWT middleware

  try {
    // Find all products where the user's ID is in the WishlistUserId array
    const wishlistProducts = await Product.find({ WishlistUserId: userId });

    res.status(200).json(wishlistProducts);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist", error });
  }
};
exports.productDetails = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const product = await Product.findOne({ _id: id });
    res.status(200).json(product);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
exports.addToCart = async (req, res) => {
  const userId = req.payload; // Extract user ID from request payload
  const { _id, quantity } = req.body; // Extract product ID and quantity

  try {
    // Find the product by ID
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already has this product in their cart
    const existingCartItem = product.Cart.find(item => item.cartuserId === userId);

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      existingCartItem.quantity = (parseInt(existingCartItem.quantity) + parseInt(quantity)).toString();
    } else {
      // If the product is not in the cart, add a new entry
      product.Cart.push({ cartuserId: userId, quantity: quantity });
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Added to cart successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  userId = req.payload;
  //console.log(userId);

  try {
    const CartProducts = await Product.find({ "Cart.cartuserId": userId });
    res.status(200).json(CartProducts);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist", error });
  }
};
exports.removeFromCart = async (req, res) => {
  const { id } = req.params; // Product ID
  const userId = req.payload; // User ID from request payload

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { $pull: { Cart: { cartuserId: userId } } }, // Removes only the user's entry from the Cart array
      { new: true } // Returns the updated product document
    );

    if (product) {
      res.status(200).json({ message: "Product removed from cart successfully", product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart", error });
  }
};

exports.chartDetails = async(req,res)=>{
  userId = req.payload;
  //console.log(userId);
  
try{
  const chartproducts = await Product.find({userId: userId});
  //console.log(chartproducts);
  
  res.status(200).json(chartproducts)
}catch(e){
  res.status(406).json(e)
}
}
exports.addreview=async(req,res)=>{
  const {user,rating,comment}=req.body
  //console.log(req.body);
  const { id } = req.params;
 // console.log(req.params);
//console.log(user,rating,comment);

  try{
    const reviewproducts =await Product.findByIdAndUpdate(id,{
      reviews:[{
        name:user,
        rating:rating,
        comment:comment
      }
      ]
    },{ new: true })
    res.status(200).json(reviewproducts)
  }catch(err){
    res.status(500).json(err)
  }
  
  
}
exports.productreviews=async(req,res)=>{
  const userId=req.payload
  try{
  const reviewproducts = await Product.find({userId})
  res.status(200).json(reviewproducts)
}catch(err){
  res.status(400).json(err)
}
}
exports.cartitemincrement=async(req,res)=>{

  const { productId, userId, updatedQuantity } = req.body;
  console.log(req.body);
  

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user has already added this product to the cart
    const userCartItem = product.Cart.find(
      (item) => item.cartuserId === userId
    );

    if (userCartItem) {
      // Update quantity for the existing user
      userCartItem.quantity = updatedQuantity;
    } else {
      // If the user hasn't added this product to the cart, return an error
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Quantity updated successfully", product });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: "Failed to update quantity" });
  }
};