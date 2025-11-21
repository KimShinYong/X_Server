import express from "express";
import * as authRepository from "../data/auth.mjs";

export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  const user = await authRepository.createUser(userid, password, name, email);
  //   res.status(201).json(user);
  if (user) {
    res.status(201).json(user);
  }
}

export async function login(req, res, next) {
  //   const userid = req.body.userid;
  //   const password = req.body.password;
  const { userid, password } = req.body;
  const user = await authRepository.login(userid, password);
  const name = user.name;
  if (user) {
    // res.status(200).json(user);
    res.status(200).json({ message: `${name}님 로그인 완료!` });
  } else {
    res
      .status(404)
      .json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요` });
  }
}
