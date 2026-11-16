import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = env.CORS_ORIGINS
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use("/api/v1", apiRouter);

app.use((_req, _res, next) => {
  next(Object.assign(new Error("Route introuvable"), { statusCode: 404 }));
});

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    const message =
      statusCode === 500
        ? "Une erreur interne est survenue"
        : "Route introuvable";

    res.status(statusCode).json({
      error: {
        message,
      },
    });
  },
);

export default app;