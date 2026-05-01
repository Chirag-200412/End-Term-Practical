const URL = require("../models/url");
const { nanoid } = require("nanoid");

// CREATE SHORT URL
exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate URL
    try {
      new global.URL(longUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Check duplicate
    const existing = await URL.findOne({ longUrl });
    if (existing) {
      return res.json({
        shortUrl: `http://localhost:3000/${existing.shortId}`,
      });
    }

    const shortId = nanoid(8);

    await URL.create({
      shortId,
      longUrl,
    });

    res.json({
      shortUrl: `http://localhost:3000/${shortId}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// REDIRECT + COUNT
exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $inc: { accessCount: 1 } },
      { new: true },
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    res.redirect(entry.longUrl);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// UPDATE URL / COUNT
exports.updateUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { longUrl, accessCount } = req.body;

    const updateData = {};

    if (longUrl) {
      try {
        new global.URL(longUrl);
        updateData.longUrl = longUrl;
      } catch {
        return res.status(400).json({ error: "Invalid URL" });
      }
    }

    if (accessCount !== undefined) {
      updateData.accessCount = accessCount;
    }

    const updated = await URL.findOneAndUpdate({ shortId }, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
