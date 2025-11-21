import express from "express";
import postsRouter from "./router/post.mjs";
import authRouter from "./router/auth.mjs";

const app = express();

app.use(express.json()); // json으로 통신하도록 미들웨어에 등록

app.use("/post", postsRouter); // /post로 접근
app.use("/auth", authRouter); // /auth로 접근

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(8080); // port번호 지정
