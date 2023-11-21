import { TaskList } from './components/taskList';
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <button type="submit">Add Task</button>
    </form>
  );
};


const App = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    document.title = `You have ${tasks.filter(task => !task.completed).length} incomplete tasks`;
  }, [tasks]);

  const addTask = useCallback((task) => {
    const newTask = { id: Date.now(), ...task, completed: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, [setTasks]);
  
  const toggleTask = useCallback((id) => {
    setTasks((prevTasks) => prevTasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }, [setTasks]);

  const removeTask = useCallback((id) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);
  
  

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const tasksToRender = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return false; 
  });

  return (
    <Router>
      <div className="app">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">Task App</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <>
              <TaskForm addTask={addTask} />
              <div className="buttons">
                <button className="btn btn-primary" onClick={() => handleFilterChange('all')} disabled={filter === 'all'}>All</button>
                <button className="btn btn-success" onClick={() => handleFilterChange('completed')} disabled={filter === 'completed'}>Completed</button>
                <button className="btn btn-danger" onClick={() => handleFilterChange('incomplete')} disabled={filter === 'incomplete'}>Incomplete</button>
              </div>
              <TaskList tasks={tasksToRender} toggleTask={toggleTask} removeTask={removeTask} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
