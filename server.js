require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const instagramRoutes = require("./routes/instagramRoutes");

const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


app.use(express.static(
    path.join(__dirname, "public")
));


app.use("/api", instagramRoutes);


app.get("/api/health", (req,res)=>{
    res.json({
        success:true,
        message:"Unduh Cepat API berjalan."
    });
});


app.get("/", (req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});


app.listen(PORT,"0.0.0.0",()=>{
    console.log(
        `🚀 Server berjalan pada port ${PORT}`
    );
});