import express from "express";
import { routes } from "./src/routes.js";
import { connect } from "./src/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(routes);
app.use(express.static("public/imgs"));
connect();

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
