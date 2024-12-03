import React, { useEffect, useState } from 'react';
import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12173;

type ContextType = {
  todos: Todo[];
  setTodos: (todoArr: Todo[]) => void;
  filterStatus: Status;
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>;
  setError: React.Dispatch<React.SetStateAction<ErrorTypes>>;
  error: ErrorTypes;
  deleteTodo: (id: number) => void;
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  addTodo: (title: string) => Promise<void>;
  tempTodoIds: number[];
  setTempTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  tempTodo: Todo | null;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  setTodos: () => {},
  filterStatus: Status.All,
  setFilterStatus: () => {},
  error: ErrorTypes.Empty,
  setError: () => {},
  deleteTodo: () => {},
  isDisabled: false,
  setIsDisabled: () => {},
  addTodo: async () => {},
  tempTodoIds: [],
  setTempTodoIds: () => {},
  tempTodo: null,
  updateTodo: async () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [error, setError] = useState(ErrorTypes.Initial);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodoIds, setTempTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    client
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorTypes.Loading));
  }, []);

  const updateTodo = (newTodo: Todo) => {
    setIsDisabled(true);
    setTempTodoIds(prev => [...prev, newTodo.id]);

    return client
      .updateTodo(newTodo)
      .then(() => {
        setTodos(prev =>
          prev.map(el => (el.id === newTodo.id ? { ...newTodo } : el)),
        );
      })
      .catch(() => {
        setError(ErrorTypes.Update);
        throw new Error();
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodoIds(prev => prev.filter(el => el !== newTodo.id));
      });
  };

  const deleteTodo = (id: number) => {
    setIsDisabled(true);
    setTempTodoIds(prev => [id, ...prev]);

    client
      .deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError(ErrorTypes.Delete))
      .finally(() => {
        setIsDisabled(false);
        setTempTodoIds(prev => prev.filter(n => n !== id));
      });
  };

  const addTodo = (title: string) => {
    const tTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tTodo);
    setError(ErrorTypes.Initial);

    setTempTodoIds(prev => [...prev, 0]);
    setIsDisabled(true);

    return client
      .createTodo(tTodo)
      .then((todo: Todo) => {
        setTodos(prev => [...prev, todo]);
      })
      .catch(() => {
        setError(ErrorTypes.Add);
        throw new Error();
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
        setTempTodoIds(prev => prev.filter(el => el));
      });
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filterStatus,
        setFilterStatus,
        setError,
        error,
        deleteTodo,
        isDisabled,
        setIsDisabled,
        addTodo,
        tempTodoIds,
        setTempTodoIds,
        tempTodo,
        updateTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
