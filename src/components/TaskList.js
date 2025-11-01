import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onToggleComplete, onEdit, isTaskOverdue }) => {
    if (tasks.length === 0) {
        return <p>Задачи не найдены</p>;
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    isTaskOverdue={isTaskOverdue}
                />
            ))}
        </div>
    );
};

export default TaskList;