import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  // router/post.mjs에서 검사할 때 에러발생시
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};
