const express = require("express");
const router = express.Router();

const {
    downloadInstagram
} = require("../controllers/instagramController");

router.post("/download", downloadInstagram);

module.exports = router;