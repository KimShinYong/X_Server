import MongoDB from "mongodb";
import { useVirtualId } from "../db/database.mjs";
import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema(
  {
    userid: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    url: String,
  },
  { versionKey: false } // veirsionKey: Mongoose가 문서를 저장할 때 자동으로 추가하는 _v라는 필드를 설정
);

useVirtualId(userSchema);
const User = Mongoose.model("User", userSchema);

// 회원가입
export async function createUser(user) {
  return new User(user).save().then((data) => data.id); // insert
}

// 회원 체크
export async function findByUserid(userid) {
  return User.findOne({ userid });
}

// ID로 찾기
export async function findById(id) {
  return User.findById(id);
}
