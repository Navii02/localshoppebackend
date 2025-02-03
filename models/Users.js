const mongoose = require('mongoose')
const UsersSchema = new mongoose.Schema({
    username:{
        required: true,
        type: String,
    },
    email:{
         required: true,
        type: String,
    },
    password:{
        required: true,
        type: String,
    },
    mobileNo:{
        type:String
    },
    location: {
        lat: Number,
        lon: Number,
        address: String,
      },
})
const Users= mongoose.model("users",UsersSchema)
module.exports = Users