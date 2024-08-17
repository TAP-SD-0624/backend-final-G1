import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";

import {
  cartRouter,
  categoryRouter,
  productRouter,
  commentRouter,
  authRouter,
  userRouter,
} from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    // await sequelize.sync({ force: true });
    // console.log("Database synchronized!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
