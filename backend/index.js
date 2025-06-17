const express=require('express')

const app=express();
const PORT=8000

app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(PORT,()=>{
    console.log(`Backend Server is running on port ${PORT}`)
})