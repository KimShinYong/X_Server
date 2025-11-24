import express from "express";
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";

const secretkey = "abcdefg1234!@#$";
const bcryptSaltRounts = 10;
const jwtExpiresInDays = "2d";

// JWT 토큰 생성 함수
async function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// 회원 가입 함수
export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  // 회원 중복 체크
  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: `${userid}이 이미 있습니다.` });
  }
  // 비밀번호 해싱
  const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);
  const user = await authRepository.createUser(userid, hashed, name, email);
  // 토큰 생성
  const token = await createJwtToken(user.id);
  // console.log(token);
  res.status(201).json({ user: user, token: token });
}

// 로그인 함수
export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  // 사용자 없음
  if (!user) {
    return res.status(401).json({ message: `${userid}를 찾을 수 없음` });
  }
  const isValidPassword = await bcrypt.compareSync(password, user.password);
  // 비밀번호 불일치
  if (!isValidPassword) {
    return res.status(401).json({ message: `비밀번호 오류` });
  }
  // 토큰 생성
  const token = await createJwtToken(user.id);
  res.status(200).json({ user, token });
}

// 로그인 유지 함수
export async function me(req, res, next) {
  //   const user = await authRepository.findByUserid(req.id);
  //   if (!user) {
  //     return res.status(401).json({ message: "사용자를 찾을 수 없음" });
  //   }
  //   res.status(200).json({ token: req.token, userid: user.userid });
  res.status(200).json({ message: "성공했어 !" });
}

// export async function signup(req, res, next) {
//   const { userid, password, name, email } = req.body;
//   const user = await authRepository.createUser(userid, password, name, email);
//   //   res.status(201).json(user);
//   if (user) {
//     res.status(201).json(user);
//   }
// }

// export async function login(req, res, next) {
//   //   const userid = req.body.userid;
//   //   const password = req.body.password;
//   const { userid, password } = req.body;
//   const user = await authRepository.login(userid, password);
//   const name = user.name;
//   if (user) {
//     // res.status(200).json(user);
//     res.status(200).json({ message: `${name}님 로그인 완료!` });
//   } else {
//     res
//       .status(404)
//       .json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요` });
//   }
// }
