import React from 'react';
import './Task.css';

const Task = ({ task, toggleTask, removeTask }) => {
    return (
        <div className="container" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <button onClick={() => toggleTask(task.id)}>Toggle</button>
            <button onClick={() => removeTask(task.id)}>Remove</button>
        </div>
    );
};

export { Task };
