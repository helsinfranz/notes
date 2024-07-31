import UserContext from "@/context/user_context";
import { useContext, useEffect, useRef, useState, MouseEvent } from "react";
import { CSSProperties } from "react";

// Define the types for props
interface ItemProps {
  d: {
    _id: string;
    title: string;
    description: string;
    priority?: "Urgent" | "Medium" | "Low";
    deadline?: string;
    status: "To do" | "In progress" | "Under review" | "Completed";
    time_ago: number; // Unix timestamp in seconds
  };
  classes: {
    task_card: string;
    spinner: string;
    center: string;
    spinner_blade: string;
    task_priority: string;
    urgent: string;
    medium: string;
    low: string;
    due_date: string;
    time_ago: string;
    options: string;
    form_icon: string;
  };
  setNotes: (note: {
    visible: boolean;
    status: "todos" | "inProgress" | "underReview" | "finished";
    title: string;
    priority?: "Urgent" | "Medium" | "Low";
    deadline?: string;
    description: string;
    _id: string;
    time_ago: number;
  }) => void;
}

export default function Item({ d, classes, setNotes }: ItemProps): JSX.Element {
  const { todoData, setTodoData } = useContext(UserContext);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startX, setStartX] = useState<number>(0); // To store initial mouse X coordinate
  const [isDraggingStarted, setIsDraggingStarted] = useState<boolean>(false);
  const draggableElement = useRef<HTMLDivElement | null>(null);

  const targetIds = ["todo", "progress", "underReview", "finished"];

  function editItemById(id: string, newStatus: string) {
    return todoData.map((item) =>
      item._id === id ? { ...item, status: newStatus } : item
    );
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX); // Capture the starting X coordinate
    const rect = draggableElement.current?.getBoundingClientRect();
    if (rect) {
      setStartOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    // Set a flag indicating dragging might start
    setIsDraggingStarted(true);
  };

  const handleMouseMove = (e: any) => {
    if (isDraggingStarted || Math.abs(e.clientX - startX) > 5) {
      // Drag threshold
      setIsDragging(true);
      setPosition({
        x: e.clientX - startOffset.x,
        y: e.clientY - startOffset.y,
      });
      setIsDraggingStarted(true);
    }
  };

  const handleMouseUp = async (e: any) => {
    // Check if dragging was initiated
    if (isDraggingStarted) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      let dropTargetId: string | null = null;

      for (const id of targetIds) {
        const targetElement = document.getElementById(id);
        const targetRect = targetElement?.getBoundingClientRect();

        if (
          targetRect &&
          mouseX >= targetRect.left &&
          mouseX <= targetRect.right &&
          mouseY >= targetRect.top &&
          mouseY <= targetRect.bottom
        ) {
          dropTargetId = id;
          break;
        }
      }

      if (
        dropTargetId === null ||
        (dropTargetId === "todo" && d.status === "To do") ||
        (dropTargetId === "progress" && d.status === "In progress") ||
        (dropTargetId === "underReview" && d.status === "Under review") ||
        (dropTargetId === "finished" && d.status === "Completed")
      ) {
        setIsDragging(false);
        setIsDraggingStarted(false);
      } else {
        const newStatus =
          dropTargetId === "todo"
            ? "To do"
            : dropTargetId === "progress"
            ? "In progress"
            : dropTargetId === "underReview"
            ? "Under review"
            : "Completed";

        const updatedItems = editItemById(d._id, newStatus);
        setTodoData(updatedItems);

        try {
          await fetch("/api/editNotes", {
            method: "POST",
            body: JSON.stringify({
              _id: d._id,
              title: d.title,
              status: newStatus,
              priority: d.priority,
              deadline: d.deadline,
              description: d.description,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    if (isDraggingStarted || isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingStarted, isDragging]);

  function filterItemById(id: string) {
    return todoData.filter((item) => item._id !== id);
  }

  async function deleteNote() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const filteredItems = filterItemById(d._id);
      setTodoData(filteredItems);
      const response = await fetch(`/api/deleteNote`, {
        method: "POST",
        body: JSON.stringify({ _id: d._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function calculateTimeAgo(databaseTimestamp: number): string {
    const currentTime = Math.floor(Date.now() / 1000);
    const unixTimestamp = Math.floor(databaseTimestamp / 1000);
    const timeDifference = currentTime - unixTimestamp;

    if (timeDifference < 60) {
      return `${timeDifference} sec ago`;
    } else if (timeDifference < 3600) {
      return `${Math.floor(timeDifference / 60)} min ago`;
    } else if (timeDifference < 86400) {
      return `${Math.floor(timeDifference / 3600)} hr ago`;
    } else if (timeDifference < 604800) {
      return `${Math.floor(timeDifference / 86400)} days ago`;
    } else if (timeDifference < 31536000) {
      return `${Math.floor(timeDifference / 604800)} weeks ago`;
    } else {
      return `${Math.floor(timeDifference / 31536000)} years ago`;
    }
  }

  const itemStyle: CSSProperties = isDragging
    ? {
        opacity: 0.7,
        width: draggableElement.current?.offsetWidth,
        height: draggableElement.current?.offsetHeight,
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "grabbing",
      }
    : {
        cursor: "grab",
      };

  return (
    <div
      className={classes.task_card}
      ref={draggableElement}
      onMouseDown={handleMouseDown}
      style={itemStyle}
    >
      <h3>{d.title}</h3>
      <p>{d.description}</p>
      {d.priority && (
        <div
          className={`${classes.task_priority} ${
            d.priority === "Urgent"
              ? classes.urgent
              : d.priority === "Medium"
              ? classes.medium
              : classes.low
          }`}
        >
          {d.priority}
        </div>
      )}
      {d.deadline && (
        <div className={classes.due_date}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6V12H18"
              stroke="#606060"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#606060"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {d.deadline}
        </div>
      )}
      <div className={classes.time_ago}>
        {calculateTimeAgo(d.time_ago)}
        <div className={classes.options}>
          <span
            className={classes.form_icon}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setNotes({
                visible: true,
                status:
                  d.status === "To do"
                    ? "todos"
                    : d.status === "In progress"
                    ? "inProgress"
                    : d.status === "Under review"
                    ? "underReview"
                    : "finished",
                title: d.title,
                priority: d.priority,
                deadline: d.deadline,
                description: d.description,
                _id: d._id,
                time_ago: d.time_ago,
              });
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.3631 5.65147L15.843 4.17148C16.6241 3.39043 17.8904 3.39043 18.6715 4.17148L20.0857 5.5857C20.8667 6.36674 20.8667 7.63307 20.0857 8.41412L18.6057 9.89411M14.3631 5.65147L4.74742 15.2671C4.41535 15.5992 4.21072 16.0375 4.1694 16.5053L3.92731 19.2458C3.87254 19.8658 4.39141 20.3847 5.01143 20.3299L7.75184 20.0878C8.21965 20.0465 8.658 19.8418 8.99007 19.5098L18.6057 9.89411M14.3631 5.65147L18.6057 9.89411"
                stroke="#666666"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            className={classes.form_icon}
            style={{ cursor: "pointer" }}
            onClick={deleteNote}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
