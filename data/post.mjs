import { db } from "../db/database.mjs";

const SELECT_JOIN =
  "select p.id, p.text, p.createAt, u.userid, u.name, u.url from users as u join posts as p on u.idx = p.useridx";
const ORDER_DESC = "order by p.createAt desc";
const ORDER_ASC = "order by p.createAt asc";

// 모든 포스트를 리턴
export async function getAll() {
  return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
}

// 사용자 아이디(userid)에 대한 포스트를 리턴
export async function getAllByUserid(userid) {
  return db
    .execute(`${SELECT_JOIN} where u.userid=? ${ORDER_DESC}`, [userid])
    .then((result) => result[0]);
  // return posts.filter((post) => post.userid === userid); // 필터함수를 사용해서 해당 userid만 return
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} where p.id=?`, [id])
    .then((result) => result[0][0]);
  // return posts.find((post) => post.id === id); // find함수로 해당 id 포스트를 찾는다
}

// 포스트를 작성
export async function create(text, idx) {
  return db
    .execute("insert into posts (useridx, text) values (?, ?)", [idx, text])
    .then((result) => getById(result[0].insertId));
  // const post = {
  //   id: Date.now().toString(),
  //   userid,
  //   name,
  //   text,
  //   createdAt: Date.now().toString(),
  // };
  // posts = [post, ...posts];
  // return post;
}

// 포스트를 변경
export async function update(id, text) {
  return db
    .execute("update posts set text=? where id=?", [text, id])
    .then(() => getById(id));
  // const post = posts.find((post) => post.id === id);
  // if (post) {
  //   post.text = text;
  // }
  // return post;
}

// 포스트를 삭제
export async function remove(id) {
  return db.execute("delete from posts where id=?", [id]);
  // posts = posts.filter((post) => post.id !== id); // 해당 id만 posts에 담기지 못함
}
