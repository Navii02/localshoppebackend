const mongoose = require("mongoose");
const BusinessUserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  businessname: {
    default: "",
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  LicenseNo: {
    type: String,
  },
  LicenseImg: {
    type: String,
  },
  PancardImg: {
    type: String,
  },
  BusinessType: {
    type: String,
  },
  GSTNo: {
    type: String,
  },
  BankDetails: {
    Name: {
      type: String,
    },
    AccountNo: {
      type: String,
    },
    IFSCode: {
      type: String,
    },
  },
  PanName: {
    type: String,
  },
  PanCardNo: {
    type: String,
  },
  photo: {
    type: String,
  },
  Location:{
    type:String,
  },
  address:{type:String,},
  latitude:{type:String,},
  longitude:{type:String,}
});
const BusinessUsers = mongoose.model("BusinessUsers", BusinessUserSchema);
module.exports = BusinessUsers;
