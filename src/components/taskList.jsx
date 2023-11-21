import React from 'react';
import { Task } from './task';

const TaskList = ({ tasks, toggleTask, removeTask }) => {
    return (
        <div>
            {tasks.map((task) => (
                <Task key={task.id} task={task} toggleTask={toggleTask} removeTask={removeTask} />
            ))}
        </div>
    );
};

export { TaskList };
