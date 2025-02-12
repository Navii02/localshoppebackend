const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({
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
    }
})
const Admin= mongoose.model("admins",AdminSchema)
module.exports = Admin