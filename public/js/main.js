// main.js

import {
  signup,
  login,
  me,
  allPosts,
  postCreate,
  postUpdate,
  postDelete,
} from "./api.js";

import {
  renderPosts,
  showLoginCard,
  showSignupCard,
  hideAuthCards,
  showPostEditor,
  hidePostEditor,
  setUserInfo,
  showMessage,
  clearMessage,
  bindLoginSubmit,
  bindSignupSubmit,
  bindSwitchAuthCards,
  bindNewPost,
  bindLogout,
  bindSearch,
} from "./ui.js";

let currentUserId = "";

// 🔹 post 객체에서 안전하게 id 꺼내는 헬퍼
function getPostId(post) {
  return post?.id ?? post?._id ?? post?.postId ?? null;
}

// ===== 포스트 로드 + 렌더 =====
async function loadAndRenderPosts(useridFilter = "") {
  try {
    clearMessage();
    const posts = await allPosts(useridFilter);
    renderPosts(posts, {
      onEdit: handleEditPost,
      onDelete: handleDeletePost,
    });
  } catch (err) {
    console.error(err);
    showMessage(err.message || "포스트 목록을 불러오지 못했습니다.");
  }
}

// ===== 로그인 =====
async function handleLogin({ userid, password }) {
  if (!userid || !password) {
    showMessage("아이디와 비밀번호를 입력해주세요.");
    return;
  }

  try {
    clearMessage();
    await login({ userid, password });

    const meInfo = await me().catch(() => null);
    currentUserId = meInfo?.userid ?? userid;
    setUserInfo(currentUserId);
    hideAuthCards();

    await loadAndRenderPosts();
  } catch (err) {
    console.error(err);
    showMessage(err.message || "로그인에 실패했습니다.");
  }
}

// ===== 회원가입 =====
async function handleSignup({ userid, password, name, email }) {
  if (!userid || !password || !name || !email) {
    showMessage("모든 항목을 입력해주세요.");
    return;
  }

  try {
    clearMessage();
    await signup({ userid, password, name, email });

    const meInfo = await me().catch(() => null);
    currentUserId = meInfo?.userid ?? userid;
    setUserInfo(currentUserId);
    hideAuthCards();

    await loadAndRenderPosts();
  } catch (err) {
    console.error(err);
    showMessage(err.message || "회원가입에 실패했습니다.");
  }
}

// ===== 새 글 / 수정 저장 =====
async function handleSavePost(payload) {
  // 새 글 버튼에서 호출: handler() 만 호출 → payload 없음
  if (!payload) {
    showPostEditor({ mode: "create" });
    return;
  }

  const { id, text } = payload;
  if (!text) {
    showMessage("내용을 입력해주세요.");
    return;
  }

  try {
    clearMessage();
    if (id) {
      await postUpdate(id, text);
    } else {
      await postCreate(text);
    }
    hidePostEditor();
    await loadAndRenderPosts();
  } catch (err) {
    console.error(err);
    showMessage(err.message || "포스트 저장에 실패했습니다.");
  }
}

// ===== 수정 버튼 =====
function handleEditPost(post) {
  const id = getPostId(post);
  if (!id) {
    console.error("수정할 포스트 ID를 찾을 수 없습니다.", post);
    showMessage("포스트 ID를 찾을 수 없습니다.");
    return;
  }

  showPostEditor({
    mode: "edit",
    text: post.text,
    id,
  });
}

// ===== 삭제 버튼 =====
async function handleDeletePost(post) {
  const id = getPostId(post);
  if (!id) {
    console.error("삭제할 포스트 ID를 찾을 수 없습니다.", post);
    showMessage("포스트 ID를 찾을 수 없습니다.");
    return;
  }

  const ok = window.confirm("정말 삭제할까요?");
  if (!ok) return;

  try {
    clearMessage();
    await postDelete(id);
    await loadAndRenderPosts();
  } catch (err) {
    console.error(err);
    showMessage(err.message || "포스트 삭제에 실패했습니다.");
  }
}

// ===== 로그아웃 =====
function handleLogout() {
  document.cookie = "accessToken=;path=/;max-age=0;";
  currentUserId = "";
  setUserInfo("");
  showLoginCard();
}

// ===== 검색 =====
async function handleSearch(useridFilter) {
  await loadAndRenderPosts(useridFilter);
}

// ===== 초기화 =====
async function init() {
  // UI 이벤트 연결
  bindLoginSubmit(handleLogin);
  bindSignupSubmit(handleSignup);
  bindSwitchAuthCards();
  bindNewPost(handleSavePost);
  bindLogout(handleLogout);
  bindSearch(handleSearch);

  // 첫 진입: 로그인 확인
  try {
    const meInfo = await me();
    if (meInfo && meInfo.userid) {
      currentUserId = meInfo.userid;
      setUserInfo(currentUserId);
      hideAuthCards();
      await loadAndRenderPosts();
    } else {
      setUserInfo("");
      showLoginCard();
    }
  } catch (err) {
    console.error(err);
    setUserInfo("");
    showLoginCard();
  }
}

document.addEventListener("DOMContentLoaded", init);
