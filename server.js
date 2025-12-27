import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();

/* ---------- Ensure uploads folder exists ---------- */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ---------- Multer setup ---------- */
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

/* ---------- Health check (optional but useful) ---------- */
app.get("/", (req, res) => {
  res.send("Hindi Tutor Backend is running ✅");
});

/* ---------- Transcription endpoint ---------- */
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));
