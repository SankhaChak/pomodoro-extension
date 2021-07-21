const timeOptions = document.querySelector("#time-options");
const saveBtn = document.querySelector("#save-btn");

timeOptions.addEventListener("change", ({ target }) => {
  const value = target.value;
  if (value < 1 || value > 60) {
    timeOptions.value = 25;
  }
});

saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: 0,
    timeOption: timeOptions.value,
  });
});

chrome.storage.local.get(["timeOption"], (res) => {
  const timer = res.timeOption ?? 0;
  timeOptions.value = timer;
});
