import express from "express";
import PChat from "../models/PChat.js";
import User from "../models/User.js";

const router = express.Router();

// Create or get chat between a standard and professional user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user=await User.findOne({_id:userId})
  
      try {
        // Find any professional user
        let professionalId=""
        if(user.role!='professional'){
          const professional = await User.findOne({ role: "professional" });

          if (!professional) {
            return res.status(404).json({ error: "No professional users available." });
          }

          professionalId = professional._id;
        }
         professionalId= "671bd3d4b7146e59073eb75d";
        // Find or create a chat between the standard user and the professional
        let chat = await PChat.findOne({
          participants: { $all: [userId, professionalId] },
        }).populate("messages.sender", "name role");

        if (!chat) {
          chat = await PChat.create({ participants: [userId, professionalId], messages: [] });
        }

        res.status(200).json(chat);
      } catch (error) {
        res.status(500).json({ error: "Server Error" });
      }
    
});

// Add a message to a chat
router.post("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { senderId, text } = req.body;

  try {
    const chat = await PChat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: { sender: senderId, text } },
      },
      { new: true }
    ).populate("messages.sender", "name role");

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
