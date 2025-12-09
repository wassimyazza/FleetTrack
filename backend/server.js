import app from "./app.js";

app.listen(process.env.PORT, ()=>{
    console.log("Port "+ process.env.PORT +" is running!");
})