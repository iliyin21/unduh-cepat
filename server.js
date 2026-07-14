require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const instagramRoutes = require("./routes/instagramRoutes");

const app = express();

const PORT = process.env.PORT || 3000;


// ======================
// Middleware
// ======================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ======================
// Static Frontend
// ======================
app.use(express.static(
    path.join(__dirname, "public")
));


// ======================
// Instagram API
// ======================
app.use("/api", instagramRoutes);


// ======================
// Health Check
// ======================
app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Unduh Cepat API berjalan dengan baik."
    });

});


// ======================
// SPA Landing Page
// ======================
app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// ======================
// Start Server
// ======================
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `🚀 Server berjalan pada port ${PORT}`
    );

});