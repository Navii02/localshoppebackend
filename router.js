const express = require("express");
const router = new express.Router();
const multer = require("multer");
const jwtmiddleware = require("./middleware/jwtMiddleWare");
const UserController = require("./controllers/BusinessUserControllers");
const multerconfig = require("./middleware/multermiddleware");
const Productcontrollers = require("./controllers/Productcontrollers");
const productmulterconfig = require("./middleware/productmultermiddleware");
const { userregister, UserLogin, saveLocation,UserDetails } = require("./controllers/UserControllers");
const { orders,OrderDetails } = require("./controllers/OrderController");
//UserControllers = require("./controllers/UserControllers");
router.post("/business-register", UserController.Businessregister);

router.post("/business-login", UserController.BusinessLogin);

router.post(
  "/business-registration",
  jwtmiddleware,
  multerconfig.fields([
    { name: "photo", maxCount: 1 },
    { name: "LicenseImg", maxCount: 1 },
    { name: "PancardImg", maxCount: 1 },
  ]),
  UserController.BusinessRegistration
);
//onst upload = multer({ storage: multer.diskStorage({}) }).array('images'); // 'images' is the field name for uploaded files

router.post(
  "/product",
  jwtmiddleware,
  productmulterconfig.array("images"),
  Productcontrollers.addProduct
);
router.get("/products", Productcontrollers.allproducts);
router.get("/user-products", jwtmiddleware, Productcontrollers.userproducts);

router.put(
  "/update-product/:id",
  jwtmiddleware,
  productmulterconfig.array("images"),
  Productcontrollers.updateProduct
);
router.delete(
  "/delete-product/:id",
  jwtmiddleware,
  Productcontrollers.deleteProduct
);

router.post('/user-register',userregister)
router.post('/user-login',UserLogin)
router.post('/wishlist',jwtmiddleware,Productcontrollers.addToWishlist)
router.get('/get-wishlist',jwtmiddleware,Productcontrollers.getWishlist)
router.get('/product-detail/:id',Productcontrollers.productDetails)
router.post('/addto-cart',jwtmiddleware,Productcontrollers.addToCart)
router.get('/get-cart',jwtmiddleware,Productcontrollers.getCart)
router.delete('/remove-from-cart/:id',jwtmiddleware,Productcontrollers.removeFromCart)
router.put('/save-location',jwtmiddleware,saveLocation)
router.get('/user-details',jwtmiddleware,UserDetails)
router.post('/orderplacement',orders)
router.get('/business/order-details',jwtmiddleware,OrderDetails)
module.exports = router;
