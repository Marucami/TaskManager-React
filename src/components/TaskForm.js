import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, editingTask, onCancel, allTags, addTag }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title || '');
            setDescription(editingTask.description || '');

            if (editingTask.deadline) {
                try {
                    const deadline = new Date(editingTask.deadline);
                    if (!isNaN(deadline.getTime())) {
                        setDeadlineDate(deadline.toISOString().split('T')[0]);
                        setDeadlineTime(deadline.toTimeString().slice(0, 5));
                    }
                } catch (error) {
                    console.error('Error parsing deadline:', error);
                }
            } else {
                setDeadlineDate('');
                setDeadlineTime('');
            }

            setTags(editingTask.tags || []);
        } else {
            resetForm();
        }
    }, [editingTask]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDeadlineDate('');
        setDeadlineTime('');
        setTags([]);
        setNewTag('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Пожалуйста, введите название задачи');
            return;
        }

        let deadline = null;
        if (deadlineDate) {
            try {
                if (deadlineTime) {
                    deadline = new Date(`${deadlineDate}T${deadlineTime}`).toISOString();
                } else {
                    deadline = new Date(`${deadlineDate}T23:59:59`).toISOString();
                }
            } catch (error) {
                console.error('Error creating deadline:', error);
            }
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            deadline,
            tags
        };

        console.log('Submitting task data:', taskData);
        onSubmit(taskData);
        if (!editingTask) {
            resetForm();
        }
    };

    const handleAddTag = () => {
        const tagText = newTag.trim();
        if (tagText && !tags.includes(tagText)) {
            const updatedTags = [...tags, tagText];
            setTags(updatedTags);
            addTag(tagText);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const now = new Date();
    const minDate = now.toISOString().split('T')[0];
    const minTime = now.toTimeString().slice(0, 5);

    return (
        <div className="task-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="taskTitle">Название задачи *</label>
                    <input
                        type="text"
                        id="taskTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите название задачи"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="taskDescription">Описание</label>
                    <textarea
                        id="taskDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание задачи"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="taskDeadline">Дедлайн</label>
                    <div className="deadline-inputs">
                        <input
                            type="date"
                            id="taskDeadlineDate"
                            value={deadlineDate}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            min={minDate}
                        />
                        <input
                            type="time"
                            id="taskDeadlineTime"
                            value={deadlineTime}
                            onChange={(e) => setDeadlineTime(e.target.value)}
                            min={deadlineDate === minDate ? minTime : undefined}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Теги</label>
                    <div className="tag-input-container">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={handleTagInputKeyPress}
                            className="tag-input"
                            placeholder="Введите тег"
                        />
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handleAddTag}
                        >
                            Добавить
                        </button>
                    </div>
                    <div className="tag-list">
                        {tags.map(tag => (
                            <div key={tag} className="tag">
                                {tag}
                                <button
                                    type="button"
                                    className="tag-remove"
                                    onClick={() => removeTag(tag)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="button-group">
                    <button type="submit" className="btn-primary">
                        {editingTask ? 'Обновить задачу' : 'Сохранить задачу'}
                    </button>
                    {editingTask && (
                        <button type="button" className="btn-secondary" onClick={onCancel}>
                            Отмена
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskForm;