import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import "dotenv/config";

import { clerkWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";

import educatorRoutes from "./routes/educatorRoutes.js";

//** Init exprss app
const app = express();

//** connect DB
await connectDB();

//** Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

//** Routes
app.get("/", (req, res) => {
  res.send("Hello Api!");
});
app.post("/clerk", clerkWebhooks);
app.use("/api/educator", educatorRoutes);

//** Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
