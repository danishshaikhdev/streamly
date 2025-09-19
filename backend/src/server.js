import express from 'express';
import "dotenv/config.js";

const app = express();

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
    res.send("Hello World From Express!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});