import express from "express";
import auth from "../middleware/auth.js";
import GratitudeEntry from "../models/GratitudeEntry.js";

const router = express.Router();

// Get paginated gratitude entries
router.get("/", auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const entries = await GratitudeEntry.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await GratitudeEntry.countDocuments({
      userId: req.user.userId,
    });

    res.json({
      entries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new gratitude entry
router.post("/", auth, async (req, res) => {
  try {
    const { content, sentiment } = req.body;

    const entry = new GratitudeEntry({
      userId: req.user.userId,
      content,
      sentiment: sentiment || "Neutral",
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;