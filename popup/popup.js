let tasks = [];

const time = document.querySelector("#time");

const updateTime = () => {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    const timer = res.timer ?? 0;
    const minutes = `${res.timeOption - Math.ceil(timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (timer % 60) {
      seconds = `${60 - (timer % 60)}`.padStart(2, "0");
    }
    time.textContent = `${minutes}:${seconds}`;
  });
};

updateTime();
setInterval(updateTime, 1000);

const resetTimerBtn = document.querySelector("#reset_timer");
const startTimerBtn = document.querySelector("#start_timer");
const addTaskBtn = document.querySelector("#add_task");
const taskContainer = document.querySelector("#task_container");

resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      isRunning: false,
      timer: 0,
    },
    () => {
      startTimerBtn.textContent = "Start Timer";
    }
  );
});

startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerBtn.textContent = res.isRunning
          ? "Resume Timer"
          : "Pause Timer";
      }
    );
  });
});

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ?? [];
  renderTasks();
});

const renderTask = (taskIdx) => {
  const taskRow = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a placeholder...";
  text.value = tasks[taskIdx];
  text.focus();
  text.addEventListener("change", () => {
    tasks[taskIdx] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";

  deleteBtn.addEventListener("click", () => {
    deleteTask(taskIdx);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  taskContainer.appendChild(taskRow);
};

const saveTasks = () => {
  chrome.storage.sync.set({
    tasks,
  });
};

const addTask = () => {
  const taskIdx = tasks.length;
  tasks.push("");

  renderTask(taskIdx);
};

const deleteTask = (taskIdx) => {
  tasks.splice(taskIdx, 1);
  saveTasks();
  renderTasks();
};

const renderTasks = () => {
  taskContainer.innerHTML = ``;
  tasks.forEach((_, idx) => {
    renderTask(idx);
  });
};

addTaskBtn.addEventListener("click", () => addTask());
