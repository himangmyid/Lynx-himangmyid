import { root, useEffect, useRef, useState } from "@lynx-js/react";
import type { NodesRef, BaseEventOrig } from "@lynx-js/types";
import "./index.scss";

// @ts-ignore
interface XInputEvent extends BaseEventOrig<{ value: string }> {}

// @ts-ignore
interface ViewProps {
  className?: string;
  ref?: any;
}

// @ts-ignore
interface TextProps extends ViewProps {
  bindtap?: (e: any) => void;
}

// @ts-ignore
interface ScrollViewProps extends ViewProps {
  id?: string;
  'scroll-orientation'?: 'vertical' | 'horizontal';
}

// @ts-ignore
interface InputProps {
  value?: string;
  'bottom-inset'?: string;
  placeholder?: string;
  className?: string;
  bindinput?: (e: XInputEvent) => void;
  type?: string;
  onChange?: (e: any) => void;
  onInput?: (e: any) => void;
  style?: any;
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'bottom-inset'?: string;
    bindinput?: (e: XInputEvent) => void;
  }
}

// @ts-ignore
declare namespace JSX {
  // @ts-ignore
  interface IntrinsicElements {
    'input': InputProps;
    'view': ViewProps;
    'text': TextProps;
    'scroll-view': ScrollViewProps;
  }
}

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

interface TodoItemProps {
  todo: Todo;
  isLastOne: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

function TodoItem({ todo, isLastOne, onToggle, onDelete }: TodoItemProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    // always scroll the last one into view.
    if (isLastOne) {
      ref.current
        ?.invoke({
          method: "scrollIntoView",
          params: {
            scrollIntoViewOptions: {
              behavior: "smooth",
              block: "center",
              inline: "start",
            },
          },
        })
        .exec();
    }
  }, [isLastOne]);

  return (
    <view className="item" ref={ref}>
      <text className="btn" bindtap={(e) => onToggle(todo)}>
        {todo.done ? "✅" : ""}
      </text>
      <text className="item__content">{todo.text}</text>
      <text className="btn" bindtap={(e) => onDelete(todo)}>
        🗑️
      </text>
    </view>
  );
}

function Footer() {
  return (
    <view className="footer">
      <text className="footer__text">Created with ❤️ by HimangMyId</text>
    </view>
  );
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleChange = (todo: Todo) => {
    setTodos((list) => list.map((item) => (item === todo ? { ...item, done: !item.done } : item)));
  };

  const handleDelete = (todo: Todo) => {
    setTodos((list) => list.filter((item) => item !== todo));
  };

  return (
    <scroll-view className="app" id="app">
      <view className="header">
        <text className="header__title">Mang Todo</text>
      </view>
      <scroll-view className="list" scroll-orientation="vertical">
        {todos.map((todo) => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleChange}
              onDelete={handleDelete}
              isLastOne={todo === todos[todos.length - 1]}
            />
          );
        })}
      </scroll-view>
      <AddTodo setTodos={setTodos} />
      <Footer />
    </scroll-view>
  );
}

interface AddTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

function AddTodo({ setTodos }: AddTodoProps) {
  const [inputValue, setInputValue] = useState("");
  const handleInput = (e: XInputEvent) => {
    setInputValue(e.detail.value);
  };

  const handleAddTodo = () => {
    setTodos((prevTodos: Todo[]) => [
      ...prevTodos,
      { id: nextId++, done: false, text: inputValue },
    ]);
    setInputValue("");
  };

  return (
    <view className="item addTodo">
      {/* @ts-ignore */}
      <input
        value={inputValue}
        bottom-inset={"28px"}
        placeholder={"Tulis Mangtodo"}
        className="item__content addTodo__input"
        bindinput={handleInput}
      />
      <text className="btn btn--action" bindtap={handleAddTodo}>
      ✍️
      </text>
    </view>
  );
}

const initialTodos = [
  { id: 0, done: true, text: "Hi" },
  { id: 1, done: true, text: "ReactLynx 3" },
  { id: 2, done: true, text: "suka suka kau lah" },
  { id: 3, done: true, text: "apalah kau ni" },
];
let nextId = 2;

export default TodoApp;
root.render(<TodoApp />);
