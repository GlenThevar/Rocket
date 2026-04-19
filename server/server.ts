import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { toNodeHandler } from "better-auth/node";
import path from "path";

import { auth } from "./lib/auth.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { stripeWebhook } from "./controller/stripeWebhook.js";

import "dotenv/config";

const app = express();

const port = 3000;

const __dirname = path.resolve();

const corsOption: CorsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(",") || [],
    credentials: true,
};

app.use(cors(corsOption));
app.post(
    "/api/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhook
);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json({ limit: "50mb" }));
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "/../client/dist/index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
