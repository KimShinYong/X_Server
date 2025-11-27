// fetch로 /auth, /post 호출 + JWT 헤더 붙이기

const BASE_URL = "http://127.0.0.1:8080";

const TOKEN_COOKIE_NAME = "accessToken";

function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split("; ");
  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return value;
  }
  return null;
}

function setTokenCookie(token) {
  if (!token) return;
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)};path=/`;
}

function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE_NAME}=;path=/; max-age=0;`;
}

export function getToken() {
  return getCookie(TOKEN_COOKIE_NAME);
}

// 공통 요청 함수 (쿠키 기반 인증)
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};

  // body가 있는 경우에 JSON 헤더 설정
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (res.status === 401) {
    clearTokenCookie();
  }

  if (!res.ok) {
    const msg = data?.message || `API Error (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// 회원가입
export async function signup({ userid, password, name, email }) {
  return request("/auth/signup", {
    method: "POST",
    body: { userid, password, name, email },
    auth: false,
  });
}

// 로그인 (서버가 Set-Cookie 로 JWT 쿠키 내려줌)
export async function login({ userid, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { userid, password },
    auth: false,
  });

  if (data?.token) {
    setTokenCookie(data.token);
  }

  return data;
}

// 로그인 유지/상태 확인
export async function me() {
  return request("/auth/me", {
    method: "POST",
    auth: true,
  });
}

// 포스트 조회
export async function allPosts(userid) {
  const query = userid ? `?userid=${encodeURIComponent(userid)}` : "";
  return request(`/post${query}`, {
    method: "GET",
    auth: true,
  });
}

// 포스트 작성
export async function postCreate(text) {
  return request("/post", {
    method: "POST",
    body: { text },
    auth: true,
  });
}

// 포스트 수정
export async function postUpdate(id, text) {
  return request(`/post/${id}`, {
    method: "PUT",
    body: { text },
    auth: true,
  });
}

// 포스트 삭제
export async function postDelete(id) {
  return request(`/post/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
