// ===== 1. 화면의 요소들을 가져오기 =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const countText = document.getElementById("todo-count");
const emptyMessage = document.getElementById("empty-message");

// 브라우저 저장소에 저장할 때 쓰는 이름
const STORAGE_KEY = "my-todos";

// ===== 2. 할 일 목록 데이터 =====
// 각 할 일은 { id: 고유번호, text: "내용", done: 완료여부 } 모양입니다.
let todos = loadTodos();

// 저장된 목록 불러오기
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    // 저장소를 쓸 수 없는 환경이면 빈 목록으로 시작
    return [];
  }
}

// 현재 목록을 저장하기
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // 저장에 실패해도 앱은 계속 동작하도록 무시
  }
}

// ===== 3. 화면에 목록 그리기 =====
function render() {
  list.innerHTML = ""; // 기존 목록 지우고 새로 그림

  todos.forEach(function (todo) {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.done ? " done" : "");

    // 완료 체크박스
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", "완료 표시");
    checkbox.addEventListener("change", function () {
      toggleTodo(todo.id);
    });

    // 할 일 내용 (textContent를 써서 입력한 글자가 그대로 안전하게 보이도록)
    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    // 삭제 버튼
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    item.append(checkbox, text, deleteButton);
    list.appendChild(item);
  });

  // 남은 개수와 빈 목록 안내 갱신
  const remaining = todos.filter(function (todo) { return !todo.done; }).length;
  countText.textContent = todos.length > 0
    ? "남은 할 일 " + remaining + "개 / 전체 " + todos.length + "개"
    : "";
  emptyMessage.style.display = todos.length === 0 ? "block" : "none";
}

// ===== 4. 기능: 추가 / 체크 / 삭제 =====
function addTodo(text) {
  todos.push({
    id: Date.now(), // 현재 시각을 고유번호로 사용
    text: text,
    done: false
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map(function (todo) {
    return todo.id === id ? { ...todo, done: !todo.done } : todo;
  });
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(function (todo) { return todo.id !== id; });
  saveTodos();
  render();
}

// ===== 5. '추가' 버튼(또는 Enter)을 눌렀을 때 =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작 막기

  const text = input.value.trim(); // 앞뒤 공백 제거
  if (text === "") {
    input.focus();
    return; // 빈 내용은 추가하지 않음
  }

  addTodo(text);
  input.value = "";
  input.focus();
});

// ===== 6. 처음 열었을 때 화면 그리기 =====
render();
