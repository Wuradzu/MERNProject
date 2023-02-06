const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3500;

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));

app.all('*', (req, res) =>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')){
        res.json({message: '404 Resource Not Found'})
    } else{
        res.type('txt').send('404 Resource Not Found')
    }
})

// app.get("/", (req, res) => {
//   res.status(200).json("server worked");
// });

const asyncStart = () => {
  app.listen(PORT, () => {
    console.log(`Server start at port ${PORT}`);
  });
};

asyncStart();
