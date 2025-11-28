// 카드(모달) 열기/닫기, 뉴모피즘 버튼 상태 등 UI 제어
// ui.js

// ===== DOM 캐시 =====
const overlayRootEl = document.getElementById("overlay-root");

const loginCardEl = document.getElementById("login-card");
const signupCardEl = document.getElementById("signup-card");
const postEditorCardEl = document.getElementById("post-editor-card");
const postEditorTitleEl = document.getElementById("post-editor-title");

const loginFormEl = document.getElementById("login-form");
const signupFormEl = document.getElementById("signup-form");
const postEditorFormEl = document.getElementById("post-editor-form");

const loginUseridEl = document.getElementById("login-userid");
const loginPasswordEl = document.getElementById("login-password");

const signupUseridEl = document.getElementById("signup-userid");
const signupPasswordEl = document.getElementById("signup-password");
const signupNameEl = document.getElementById("signup-name");
const signupEmailEl = document.getElementById("signup-email");

const postIdEl = document.getElementById("post-id");
const postTextEl = document.getElementById("post-text");
const btnEditorCancel = document.getElementById("btn-editor-cancel");

const postListEl = document.getElementById("post-list");

const searchUseridEl = document.getElementById("search-userid");
const btnSearchEl = document.getElementById("btn-search");
const btnNewPostEl = document.getElementById("btn-new-post");

const btnToSignupEl = document.getElementById("to-signup");
const btnToLoginEl = document.getElementById("to-login");

const userInfoEl = document.getElementById("user-info");
const btnLogoutEl = document.getElementById("btn-logout");

const messageBoxEl = document.getElementById("message-box");

// ===== 오버레이 제어 =====
function openOverlay() {
  overlayRootEl.classList.remove("hidden");
  overlayRootEl.classList.add("active");
}

function closeOverlayIfNoCard() {
  if (
    loginCardEl.classList.contains("hidden") &&
    signupCardEl.classList.contains("hidden") &&
    postEditorCardEl.classList.contains("hidden")
  ) {
    overlayRootEl.classList.add("hidden");
    overlayRootEl.classList.remove("active");
  }
}

// 로그인/회원가입/작성 카드 토글
export function showLoginCard() {
  openOverlay();
  loginCardEl.classList.remove("hidden");
  signupCardEl.classList.add("hidden");
  postEditorCardEl.classList.add("hidden");
  loginUseridEl.focus();
}

export function showSignupCard() {
  openOverlay();
  signupCardEl.classList.remove("hidden");
  loginCardEl.classList.add("hidden");
  postEditorCardEl.classList.add("hidden");
  signupUseridEl.focus();
}

export function hideAuthCards() {
  loginCardEl.classList.add("hidden");
  signupCardEl.classList.add("hidden");
  closeOverlayIfNoCard();
}

export function showPostEditor({ mode, text = "", id = "" }) {
  openOverlay();
  postEditorCardEl.classList.remove("hidden");
  loginCardEl.classList.add("hidden");
  signupCardEl.classList.add("hidden");

  postEditorTitleEl.textContent =
    mode === "edit" ? "포스트 수정" : "새 글 작성";

  postTextEl.value = text;
  postIdEl.value = id || "";
  postTextEl.focus();
}

export function hidePostEditor() {
  postEditorCardEl.classList.add("hidden");
  postEditorFormEl.reset();
  closeOverlayIfNoCard();
}

// ===== 상단 유저 정보 =====
export function setUserInfo(userid) {
  if (!userid) {
    userInfoEl.textContent = "";
    btnLogoutEl.classList.add("hidden");
  } else {
    userInfoEl.textContent = `@${userid} 님`;
    btnLogoutEl.classList.remove("hidden");
  }
}

// ===== 메시지 박스 =====
export function showMessage(text, type = "error") {
  messageBoxEl.textContent = text;
  messageBoxEl.dataset.type = type;
  messageBoxEl.classList.remove("hidden");
}

export function clearMessage() {
  messageBoxEl.textContent = "";
  messageBoxEl.classList.add("hidden");
  delete messageBoxEl.dataset.type;
}

// ===== 포스트 렌더링 =====
export function renderPosts(posts, { onEdit, onDelete } = {}) {
  postListEl.innerHTML = "";

  if (!Array.isArray(posts) || posts.length === 0) {
    const emptyEl = document.createElement("p");
    emptyEl.className = "post-empty";
    emptyEl.textContent = "작성된 포스트가 없습니다.";
    postListEl.appendChild(emptyEl);
    return;
  }

  posts.forEach((post) => {
    const section = document.createElement("section");
    section.className = "post-card";

    const header = document.createElement("div");
    header.className = "post-card__header";

    const userSpan = document.createElement("span");
    userSpan.className = "post-card__user";
    userSpan.textContent = `${post.name ?? ""} (@${post.userid ?? ""})`;

    const dateSpan = document.createElement("span");
    dateSpan.className = "post-card__date";
    if (post.createdAt) {
      const d = new Date(post.createdAt);
      dateSpan.textContent = d.toLocaleString();
    }

    header.appendChild(userSpan);
    header.appendChild(dateSpan);

    const textP = document.createElement("p");
    textP.className = "post-card__text";
    textP.textContent = post.text ?? "";

    const actions = document.createElement("div");
    actions.className = "post-card__actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn post-card__btn";
    editBtn.textContent = "수정";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn post-card__btn btn-danger";
    deleteBtn.textContent = "삭제";

    if (typeof onEdit === "function") {
      editBtn.addEventListener("click", () => onEdit(post));
    }
    if (typeof onDelete === "function") {
      deleteBtn.addEventListener("click", () => onDelete(post));
    }

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    section.appendChild(header);
    section.appendChild(textP);
    section.appendChild(actions);

    postListEl.appendChild(section);
  });
}

// ===== 이벤트 바인딩 헬퍼 =====
export function bindLoginSubmit(handler) {
  if (!loginFormEl) return;
  loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userid = loginUseridEl.value.trim();
    const password = loginPasswordEl.value.trim();
    handler({ userid, password });
  });
}

export function bindSignupSubmit(handler) {
  if (!signupFormEl) return;
  signupFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userid = signupUseridEl.value.trim();
    const password = signupPasswordEl.value.trim();
    const name = signupNameEl.value.trim();
    const email = signupEmailEl.value.trim();
    handler({ userid, password, name, email });
  });
}

export function bindSwitchAuthCards() {
  btnToSignupEl?.addEventListener("click", () => {
    clearMessage();
    showSignupCard();
  });
  btnToLoginEl?.addEventListener("click", () => {
    clearMessage();
    showLoginCard();
  });
}

export function bindNewPost(handler) {
  btnNewPostEl?.addEventListener("click", () => {
    clearMessage();
    handler(); // 새 글 모드
  });

  postEditorFormEl?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = postIdEl.value.trim();
    const text = postTextEl.value.trim();
    handler({ id, text });
  });

  btnEditorCancel?.addEventListener("click", () => {
    hidePostEditor();
  });
}

export function bindLogout(handler) {
  btnLogoutEl?.addEventListener("click", () => handler());
}

export function bindSearch(handler) {
  btnSearchEl?.addEventListener("click", () => {
    const userid = searchUseridEl.value.trim();
    handler(userid);
  });

  searchUseridEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const userid = searchUseridEl.value.trim();
      handler(userid);
    }
  });
}
