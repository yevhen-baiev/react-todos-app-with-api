import { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';
import { ErrorTypes } from '../../types/ErrorTypes';

export const TodoHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const { isDisabled, todos, addTodo, setError, updateTodo } =
    useContext(TodosContext);

  const active = todos.filter(el => !el.completed);

  const hendlerToggleAll = () => {
    const arrOfTodos = active.length ? active : todos;
    const checkedArr = arrOfTodos.map(el => ({
      ...el,
      completed: !!active.length,
    }));

    checkedArr.forEach(todo => {
      updateTodo(todo);
    });
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorTypes.Empty);
      setTitle('');

      return;
    }

    addTodo(trimmedTitle).then(() => setTitle(''));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: !active.length })}
          data-cy="ToggleAllButton"
          aria-label="Toggle"
          onClick={hendlerToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          value={title}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
