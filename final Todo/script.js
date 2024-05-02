let date = document.querySelector(".date")
// console.log(date);
let hrs = document.querySelector("#hour")
// console.log(hrs);
let min = document.querySelector("#minute")
let sec = document.querySelector("#second")
let prd = document.querySelector("#period")

const months= ["January","February","March","April","May","June","july","August","September","ooctober","November","December"];

const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"];
setInterval(()=>{

let presentTime = new Date();
document.querySelector('.date').innerText=(days[presentTime.getDay()] + ', ' + presentTime.getDate()+ ' '+ months[presentTime.getMonth()]+ ' '+presentTime.getFullYear());

//  console.log(presentTime)
hrs.innerText= (presentTime.getHours()<10?"0":"")+presentTime.getHours();
//  console.log(hrs.innerText)
min.innerText=  (presentTime.getMinutes()<10?"0":"")+presentTime.getMinutes();;
sec.innerText=  (presentTime.getSeconds()<10?"0":"")+presentTime.getSeconds();
// prd.innerText=presentTime.get
},1000);

// modal
const modal = document.querySelector(".modal");
const taskBtn = document.querySelector(".taskbtn");
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.querySelector(".task-list");
const totalTasksCount = document.getElementById("totalTasks");
const tasksRemainingCount = document.getElementById("tasksRemaining");
const tasksCompletedCount = document.getElementById("tasksCompleted");

let totalTasks = 0;
let tasksRemaining = 0;
let tasksCompleted = 0;
let isEditing = false;
let editedTaskItem;

taskBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const category = taskCategory.value;

  if (taskText !== "") {
    if (isEditing) {
      editedTaskItem.querySelector("span").textContent = `${taskText} (${category})`;
      isEditing = false;
      modal.style.display = "none";
      updateTaskInLocalStorage(editedTaskItem, taskText, category);
    } else {
      const taskItem = createTaskItem(taskText, category);
      taskList.appendChild(taskItem);
      taskInput.value = "";
      modal.style.display = "none";
      addTaskToLocalStorage(taskItem, taskText, category);
      totalTasks++;
      tasksRemaining++;
      updateTaskCounters();
    }
  }
});

function createTaskItem(taskText, category) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.innerHTML = `
    <span>${taskText} (${category})</span>
    <div>
      <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="complete-btn"><i class="fa-solid fa-check"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-trash-can-arrow-up"></i></button>
    </div>
  `;

  const completeBtn = taskItem.querySelector(".complete-btn");
  completeBtn.addEventListener("click", toggleTaskCompletion);

  const editBtn = taskItem.querySelector(".edit-btn");
  editBtn.addEventListener("click", editTask);

  const deleteBtn = taskItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteTask);

  return taskItem;
}

function toggleTaskCompletion(e) {
  const taskItem = e.currentTarget.parentElement.parentElement;
  taskItem.classList.toggle("completed");

  if (taskItem.classList.contains("completed")) {
    tasksCompleted++;
    tasksRemaining--;
  } else {
    tasksCompleted--;
    tasksRemaining++;
  }

  updateTaskCounters();
  updateTaskInLocalStorage(taskItem);
}

function editTask(e) {
  isEditing = true;
  editedTaskItem = e.currentTarget.parentElement.parentElement;
  const taskText = editedTaskItem.querySelector("span").textContent.split("(")[0].trim();
  const category = editedTaskItem.querySelector("span").textContent.split("(")[1].replace(")", "").trim();

  taskInput.value = taskText;
  taskCategory.value = category;
  modal.style.display = "block";
}

function deleteTask(e) {
  const taskItem = e.currentTarget.parentElement.parentElement;
  taskList.removeChild(taskItem);

  if (taskItem.classList.contains("completed")) {
    tasksCompleted--;
  } else {
    tasksRemaining--;
  }
  totalTasks--;

  updateTaskCounters();
  removeTaskFromLocalStorage(taskItem);
}

function updateTaskCounters() {
  totalTasksCount.textContent = totalTasks;
  tasksRemainingCount.textContent = tasksRemaining;
  tasksCompletedCount.textContent = tasksCompleted;
}

function addTaskToLocalStorage(taskItem, taskText, category) {
  const taskData = {
    text: taskText,
    category: category,
    completed: false,
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskItem, taskText, category) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const taskIndex = tasks.findIndex((task) => task.text === taskItem.querySelector("span").textContent.split("(")[0].trim());

  if (taskIndex !== -1) {
    if (taskText && category) {
      tasks[taskIndex].text = taskText;
      tasks[taskIndex].category = category;
    } else {
      tasks[taskIndex].completed = taskItem.classList.contains("completed");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function removeTaskFromLocalStorage(taskItem) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const taskIndex = tasks.findIndex((task) => task.text === taskItem.querySelector("span").textContent.split("(")[0].trim());

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const taskItem = createTaskItem(task.text, task.category);

    if (task.completed) {
      taskItem.classList.add("completed");
      tasksCompleted++;
    } else {
      tasksRemaining++;
    }

    totalTasks++;
    taskList.appendChild(taskItem);
  });

  updateTaskCounters();
  container.classList.add("show-container");
}

window.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);