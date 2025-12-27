import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));
    form.append("model", "whisper-1");
    form.append("language", "hi");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders()
        },
        body: form
      }
    );

    const data = await response.json();
    fs.unlinkSync(req.file.path);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
