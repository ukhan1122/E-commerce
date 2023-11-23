const express = require ("express")
const db = require ('./db.js')
const route = require ('./router/Authentcation')
const cors = require('cors')
const catgory = require('./router/Category')
const product = require('./router/productroutes.js')
const Order = require("./router/Orderoute.js")


const app = express()   
const port = 8000

app.use(express.json());
app.use(cors())
app.use('/Authentication' ,route)
app.use('/Category',catgory)
app.use('/Products',product)
app.use('/Orders',Order)

db();
app.get('/',(req,res)=>{
    res.send("hellow signup")
})

app.listen(port,()=>{
    console.log(`server is starting at port ${port}`)
})