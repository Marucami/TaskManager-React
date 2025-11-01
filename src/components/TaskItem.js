import React from 'react';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit, isTaskOverdue }) => {
    const overdue = isTaskOverdue(task.deadline);

    // Форматирование даты и времени для отображения
    const formatDeadline = (deadlineString) => {
        if (!deadlineString) return 'Без дедлайна';

        const deadline = new Date(deadlineString);
        return `До ${deadline.toLocaleDateString('ru-RU')} ${deadline.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    };

    return (
        <div className={`task-card ${overdue && !task.completed ? 'overdue' : ''}`}>
            <div className="task-header">
                <div className="task-title">{task.title}</div>
                <div className="task-actions">
                    <button
                        className="task-action"
                        onClick={() => onToggleComplete(task.id)}
                        title={task.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
                    >
                        {task.completed ? '✓' : '○'}
                    </button>
                    <button
                        className="task-action"
                        onClick={() => onEdit(task)}
                        title="Редактировать"
                    >
                        ✏️
                    </button>
                    <button
                        className="task-action"
                        onClick={() => onDelete(task.id)}
                        title="Удалить"
                    >
                        🗑️
                    </button>
                </div>
            </div>
            <div className="task-description">{task.description}</div>
            <div className="tag-list">
                {task.tags.map(tag => (
                    <div key={tag} className="tag">{tag}</div>
                ))}
            </div>
            <div className="task-meta">
                <div className={`task-deadline ${overdue && !task.completed ? '' : 'normal'}`}>
                    {formatDeadline(task.deadline)}
                    {overdue && !task.completed ? ' (ПРОСРОЧЕНО)' : ''}
                </div>
                <div>{task.completed ? 'Выполнено' : 'В процессе'}</div>
            </div>
        </div>
    );
};

export default TaskItem;