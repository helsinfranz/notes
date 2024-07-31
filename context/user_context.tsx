import Loader from "@/components/loader";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState, ReactNode } from "react";

interface Note {
  _id?: string;
  title?: string;
  status?: string;
  priority?: string;
  deadline?: string;
  description?: string;
  time_ago?: number;
  visible?: boolean;
}
// Define the type for the context
interface UserContextType {
  todoData: Note[]; // Replace `any` with a more specific type if possible
  setTodoData: React.Dispatch<React.SetStateAction<Note[]>>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  todoData: [],
  setTodoData: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [todos, setTodos] = useState<any[]>([]); // Replace `any` with a more specific type if possible
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch("/api/getNotes");
        const data1 = await response.json();
        if (response.ok) {
          setTodos(data1);
        } else {
          console.log(data1);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    if (status === "authenticated") {
      setLoading(true);
      fetchNotes();
    }
  }, [status]);

  const contextObject: UserContextType = {
    todoData: todos,
    setTodoData: setTodos,
  };

  return (
    <UserContext.Provider value={contextObject}>
      {loading && <Loader />}
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
