const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  redirectUrl,
  updateUrl,
} = require("../controllers/urlController");

// POST /shortUrl
router.post("/shortUrl", createShortUrl);

// GET /:shortId
router.get("/:shortId", redirectUrl);

// PATCH /:shortId
router.patch("/:shortId", updateUrl);

module.exports = router;
