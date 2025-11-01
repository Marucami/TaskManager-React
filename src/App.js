import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Search from './components/Search';

const storage = {
  get: (key, defaultValue = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Saved ${key} to localStorage:`, value);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('Loading data from localStorage...');

    const savedTasks = storage.get('tasks');
    console.log('Loaded tasks:', savedTasks);
    setTasks(savedTasks);

    const savedTags = storage.get('tags');
    setAllTags(savedTags);

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      console.log('Saving tasks:', tasks);
      storage.set('tasks', tasks);
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.set('tags', allTags);
    }
  }, [allTags, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isInitialized]);

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };

    console.log('Adding new task:', newTask);
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      console.log('Updated tasks array:', updatedTasks);
      return updatedTasks;
    });
  };

  const updateTask = (taskData) => {
    console.log('Updating task:', taskData);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === editingTask.id ? { ...task, ...taskData } : task
      );
      console.log('After update tasks:', updatedTasks);
      return updatedTasks;
    });
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      console.log('Deleting task with id:', id);
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== id);
        console.log('After delete tasks:', updatedTasks);
        return updatedTasks;
      });
    }
  };

  const toggleTaskCompletion = (id) => {
    console.log('Toggling completion for task id:', id);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      return updatedTasks;
    });
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Changing theme to:', newTheme);
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !allTags.includes(trimmedTag)) {
      setAllTags(prevTags => [...prevTags, trimmedTag]);
    }
  };

  const isTaskOverdue = (deadline) => {
    if (!deadline) return false;
    try {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      return deadlineDate < now && !isNaN(deadlineDate.getTime());
    } catch (error) {
      console.error('Error checking deadline:', error);
      return false;
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('Current state - tasks:', tasks, 'isInitialized:', isInitialized);

  return (
    <div className="container">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <TaskForm
        onSubmit={editingTask ? updateTask : addTask}
        editingTask={editingTask}
        onCancel={cancelEditing}
        allTags={allTags}
        addTag={addTag}
      />
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <TaskList
        tasks={filteredTasks}
        onDelete={deleteTask}
        onToggleComplete={toggleTaskCompletion}
        onEdit={startEditing}
        isTaskOverdue={isTaskOverdue}
      />

      {/* Отладочная информация */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px', fontSize: '12px' }}>
        <strong>Отладка:</strong> Задач в состоянии: {tasks.length} |
        Задач в localStorage: {storage.get('tasks').length} |
        Инициализировано: {isInitialized ? 'Да' : 'Нет'}
      </div>
    </div>
  );
}

export default App;