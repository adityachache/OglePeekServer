const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")

//.env
const dotenv = require("dotenv");
dotenv.config();

// app and constants
const PORT = process.env.PORT || 8000;
const MONGO_LOCAL_URI = process.env.LOCAL_URI || "mongodb://localhost:27017/oglepeek"
const MONGO_PROD_URI = process.env.PROD_URI || "mongodb://localhost:27017/oglepeek"

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_LOCAL_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });


app.get("/", (req, res) => {
    res.send("I am OglePeek Server");
})

app.listen(PORT, (req, res) => {
    console.log(`Server started at PORT ${PORT}`)
})

