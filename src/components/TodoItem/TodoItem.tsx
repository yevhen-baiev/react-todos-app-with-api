import { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const { deleteTodo, isDisabled, tempTodoIds, updateTodo } =
    useContext(TodosContext);

  const handleToggleChange = () => {
    const newTodo = { ...todo, completed: !completed };

    updateTodo(newTodo);
  };

  const handleOnEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const aditFunc = (str: string) => {
    const trimmedTitle = str.trim();

    if (!trimmedTitle) {
      deleteTodo(id);
      setIsEditing(false);
      setNewTitle(title);

      return;
    }

    if (trimmedTitle === title) {
      setNewTitle(title);
      setIsEditing(false);

      return;
    }

    const todoUpdated = { ...todo, title: trimmedTitle };

    setNewTitle(trimmedTitle);

    updateTodo(todoUpdated)
      .then(() => setIsEditing(false))
      .catch(() => inputRef.current?.focus());
  };

  const handleOnBlur = () => {
    aditFunc(newTitle);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    aditFunc(newTitle);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleOnChange}
            onKeyUp={handleOnEscape}
            onBlur={handleOnBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {newTitle || title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDisabled && tempTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
