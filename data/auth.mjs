import MongoDB from "mongodb";
import { getUsers } from "../db/database.mjs";
const ObjectID = MongoDB.ObjectId;

// 회원가입
export async function createUser(user) {
  // const user = {
  //   id: Date.now().toString(),
  //   userid,
  //   password,
  //   name,
  //   email,
  //   url: "https://randomuser.me/api/portraits/men/29.jpg",
  // };
  // users = [user, ...users];
  // return user
  return getUsers()
    .insertOne(user)
    .then((result) => result.insertedId.toString());
}

// 로그인
// export async function login(userid, password) {
//   return users.find(
//     (user) => user.userid === userid && user.password === password
//   );
// }

// 회원 체크
export async function findByUserid(userid) {
  return getUsers().find({ userid }).next().then(mapOptionalUser);
}

// ID로 찾기
export async function findById(id) {
  return getUsers()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalUser);
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
