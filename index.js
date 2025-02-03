const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
require('dotenv').config()

require('./db')
const router = require('./router')

app.use(express.json());
app.use(router);
// app.use('/',(req,res)=> {
//     res.send("This is Express Server")
// })
app.use('/upload', express.static('./uploads'))
app.use('/products', express.static('products'));


const port=4000||process.env.PORT
app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
    
})