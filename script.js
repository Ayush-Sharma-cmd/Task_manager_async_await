// HTML mein form aur input elements ko select karo
const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const taskListContainer = document.getElementById('taskList');

// READ: localStorage se tasks ko le kar aao
async function getSavedTasks() {
  // localStorage se tasks lo. Agar nahi mile to khaali array do.
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks;
}

// SAVE: updated tasks ko localStorage mein save karo
async function saveTasksToStorage(tasks) {
  // Tasks array ko JSON string mein badalkar localStorage mein save karo
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// READ: sabhi saved tasks ko screen par dikhao
async function showTasksOnScreen() {
  const tasks = await getSavedTasks(); // saved tasks ko lo
  taskListContainer.innerHTML = ''; // purani list ko clear karo

  // Har task ko loop karke screen par dikhate hain
  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task'; // styling ke liye class

    // Task ka content aur buttons add karo
    taskElement.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <div class="task-actions">
        <button onclick="editExistingTask(${index})">Edit</button>
        <button onclick="deleteTaskFromList(${index})">Delete</button>
      </div>
    `;

    // Task element ko task list container mein dalo
    taskListContainer.appendChild(taskElement);
  });
}

// CREATE ya UPDATE: jab form submit ho
taskForm.addEventListener('submit', async function (event) {
  event.preventDefault(); // page reload hone se roko

  // Input fields se values lo
  const taskTitle = titleInput.value.trim();
  const taskDescription = descriptionInput.value.trim();

  // Agar title ya description khaali ho to kuch mat karo
  if (!taskTitle || !taskDescription) return;

  const taskList = await getSavedTasks(); // pehle se bane tasks lo

  // UPDATE: agar form edit mode mein hai
  if (taskForm.dataset.editing !== undefined) {
    const editingIndex = parseInt(taskForm.dataset.editing);
    taskList[editingIndex] = { title: taskTitle, description: taskDescription };
    delete taskForm.dataset.editing; // edit flag hatao
  } else {
    // CREATE: naya task list mein add karo
    taskList.push({ title: taskTitle, description: taskDescription });
  }

  // Save karo aur list ko refresh karo
  await saveTasksToStorage(taskList);
  taskForm.reset(); // form ko clear karo
  showTasksOnScreen(); // naye list ko dikhayo
});

// EDIT: task ko form mein laakar edit karo
window.editExistingTask = async function (index) {
  const taskList = await getSavedTasks();
  const task = taskList[index];

  // Form fields mein task ka data dalo
  titleInput.value = task.title;
  descriptionInput.value = task.description;

  // Form ko edit mode mein daalo
  taskForm.dataset.editing = index;
};

// DELETE: task ko list se hatao
window.deleteTaskFromList = async function (index) {
  const taskList = await getSavedTasks();

  // Index ke task ko hatao
  taskList.splice(index, 1);

  // Save karo aur updated list dikhayo
  await saveTasksToStorage(taskList);
  showTasksOnScreen();
};

// Page load hone par saved tasks dikhayo
showTasksOnScreen();
