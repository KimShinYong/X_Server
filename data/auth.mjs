import { db } from "../db/database.mjs";

// 회원가입
export async function createUser(user) {
  const { userid, password, name, email, url } = user;
  return db
    .execute(
      "insert into users (userid, password, name, email, url) values (?, ?, ?, ?, ?)",
      [userid, password, name, email, url]
    )
    .then((result) => result[0].insertId);

  //   id: Date.now().toString(),
  //   userid,
  //   password,
  //   name,
  //   email,
  //   url: "https://randomuser.me/api/portraits/men/29.jpg",
  // };
  // users = [user, ...users];
  // return user;
}

// // 로그인
// export async function login(userid, password) {
//   return users.find(
//     (user) => user.userid === userid && user.password === password
//   );
// }

// 회원 체크
export async function findByUserid(userid) {
  return db
    .execute("select idx, password from users where userid=?", [userid])
    .then((result) => {
      console.log(result);
      return result[0][0];
    });
  // return users.find((user) => user.userid === userid);
}

// ID로 찾기
export async function findById(idx) {
  return db
    .execute("select idx, userid from users where idx=?", [idx])
    .then((result) => result[0][0]);
  // return users.find((user) => user.id === id);
}
