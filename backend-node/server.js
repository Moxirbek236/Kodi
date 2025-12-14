
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";

const app = express();
app.use(express.json());
app.use(express.static("../admin-dashboard"));

const SECRET = "uzmedia-secret";
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } });

const usersFile = "./data/users.json";
const moviesFile = "./data/movies.json";

const users = JSON.parse(fs.readFileSync(usersFile));
let movies = JSON.parse(fs.readFileSync(moviesFile));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid login" });
  const token = jwt.sign({ role: user.role }, SECRET);
  res.json({ token });
});

function adminOnly(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, SECRET);
    if (data.role !== "admin") return res.sendStatus(403);
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.get("/api/movies", (req, res) => {
  res.json(movies);
});

app.post("/api/movies", adminOnly, (req, res) => {
  movies.push(req.body);
  fs.writeFileSync(moviesFile, JSON.stringify(movies, null, 2));
  res.json({ ok: true });
});

app.post("/api/upload", adminOnly, upload.single("video"), (req, res) => {
  res.json({ file: req.file.originalname });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
