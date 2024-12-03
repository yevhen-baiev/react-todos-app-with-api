import { useContext } from 'react';
import { TodoFilter } from '../TodoFilter';
import { TodosContext } from '../TodosContext/TodosContext';

export const TodoFooter: React.FC = () => {
  const { todos, filterStatus, setFilterStatus, deleteTodo } =
    useContext(TodosContext);
  const activeItems = todos.reduce((count, todo) => {
    return count + +!todo.completed;
  }, 0);

  const completedIds = todos.filter(el => el.completed).map(el => el.id);

  const countMessage = `${activeItems} item${activeItems === 1 ? '' : 's'} left`;

  const hasCompleted = !!(todos.length - activeItems);

  const handleDeleteCompleted = () => {
    completedIds.forEach(id => deleteTodo(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countMessage}
      </span>
      <TodoFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <button
        type="button"
        className="todoapp__clear-completed disabled"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
