import { useContext, useEffect, useRef, useState } from "react";
import classes from "./add_notes.module.css";
import UserContext from "@/context/user_context";
import Spinner from "./spinner";

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

interface UserContextType {
  todoData: Note[];
  setTodoData: React.Dispatch<React.SetStateAction<Note[]>>;
}

interface AddNotesProps {
  notes: Note;
  setNotes: React.Dispatch<React.SetStateAction<Note>>;
}

export default function AddNotes({ notes, setNotes }: AddNotesProps) {
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { todoData, setTodoData } = useContext<UserContextType>(UserContext);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);
  const priorityRef = useRef<HTMLSelectElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!notes.visible) {
      titleRef.current!.value = "";
      statusRef.current!.value = "";
      priorityRef.current!.value = "";
      dateRef.current!.value = "";
      descriptionRef.current!.value = "";
      setStatus("");
      setPriority("");
      setDate("");
    } else {
      const statusVal = notes.status;
      if (statusVal === "todos") {
        statusRef.current!.value = "To do";
        setStatus("To do");
      } else if (statusVal === "inProgress") {
        statusRef.current!.value = "In progress";
        setStatus("In progress");
      } else if (statusVal === "underReview") {
        statusRef.current!.value = "Under review";
        setStatus("Under review");
      } else if (statusVal === "finished") {
        statusRef.current!.value = "Completed";
        setStatus("Completed");
      } else {
        statusRef.current!.value = "";
        setStatus("");
      }
      titleRef.current!.value = notes.title ?? "";
      priorityRef.current!.value = notes.priority ?? "";
      setPriority(notes.priority ?? "");
      dateRef.current!.value = notes.deadline ?? "";
      setDate(notes.deadline ?? "");
      descriptionRef.current!.value = notes.description ?? "";
    }
  }, [notes]);

  function editItemById(id: string, newData: Note): Note[] {
    return todoData.map((item) =>
      item._id === id ? { ...item, ...newData } : item
    );
  }

  async function handleFormSubmit() {
    if (loading) {
      return;
    }
    const title = titleRef.current!.value;
    const status = statusRef.current!.value;
    const priority = priorityRef.current!.value;
    const date = dateRef.current!.value;
    const description = descriptionRef.current!.value;
    if (!title) {
      window.alert("Title cannot be empty");
      return;
    }
    if (!status) {
      window.alert("Status cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const timeAgo = Date.now();
      const res = await fetch("/api/addNotes", {
        method: "POST",
        body: JSON.stringify({
          title,
          status,
          priority,
          deadline: date,
          description,
          time_ago: timeAgo,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTodoData((prev) => [
          ...prev,
          {
            _id: data._id,
            title,
            status,
            priority,
            deadline: date,
            description,
            time_ago: timeAgo,
          },
        ]);

        setNotes({
          visible: false,
          status: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function handleFormEdit() {
    if (loading) {
      return;
    }
    const title = titleRef.current!.value;
    const status = statusRef.current!.value;
    const priority = priorityRef.current!.value;
    const date = dateRef.current!.value;
    const description = descriptionRef.current!.value;
    if (!title) {
      window.alert("Title cannot be empty");
      return;
    }
    if (!status) {
      window.alert("Status cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/editNotes", {
        method: "POST",
        body: JSON.stringify({
          _id: notes._id,
          title,
          status,
          priority,
          deadline: date,
          description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const newData = {
          _id: notes._id!,
          title,
          status,
          priority,
          deadline: date,
          description,
          time_ago: notes.time_ago,
        };
        const updatedItems = editItemById(notes._id!, newData);
        setTodoData(updatedItems);
        setNotes({
          visible: false,
          status: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <div
        className={`${classes.form_container} ${
          notes.visible ? classes.in : classes.out
        }`}
      >
        <div className={classes.form_header}>
          <button
            className={classes.icon_btn}
            onClick={() =>
              setNotes({
                visible: false,
                status: "",
              })
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.7583 17.2426L12.0009 12M12.0009 12L17.2435 6.75732M12.0009 12L6.7583 6.75732M12.0009 12L17.2435 17.2426"
                stroke="#797979"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={classes.icon_btn}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.75 9.75L18 18M18 18V10.08M18 18H10.08"
                stroke="#797979"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.25 14.25L6 6M6 6V13.92M6 6H13.92"
                stroke="#797979"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={classes.header_right}>
            <button className={classes.action_btn}>
              Share
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                  stroke="#797979"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
                  stroke="#797979"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                  stroke="#797979"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 6.5L8.5 10.5"
                  stroke="#797979"
                  strokeWidth="1.5"
                />
                <path
                  d="M8.5 13.5L15.5 17.5"
                  stroke="#797979"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <button className={classes.action_btn}>
              Favorite
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                  stroke="#797979"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {notes._id ? (
              <button
                className={`${classes.action_btn} ${classes.submit_button}`}
                onClick={handleFormEdit}
                style={{ justifyContent: "center" }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    Edit
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 1.25C6.56294 1.25 1.75 6.06294 1.75 12C1.75 17.9371 6.56294 22.75 12.5 22.75C18.4371 22.75 23.25 17.9371 23.25 12C23.25 6.06294 18.4371 1.25 12.5 1.25ZM13.25 8C13.25 7.58579 12.9142 7.25 12.5 7.25C12.0858 7.25 11.75 7.58579 11.75 8V11.25H8.5C8.08579 11.25 7.75 11.5858 7.75 12C7.75 12.4142 8.08579 12.75 8.5 12.75H11.75V16C11.75 16.4142 12.0858 16.75 12.5 16.75C12.9142 16.75 13.25 16.4142 13.25 16V12.75H16.5C16.9142 12.75 17.25 12.4142 17.25 12C17.25 11.5858 16.9142 11.25 16.5 11.25H13.25V8Z"
                        fill="white"
                      ></path>
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <button
                className={`${classes.action_btn} ${classes.submit_button}`}
                onClick={handleFormSubmit}
                style={loading ? { justifyContent: "center" } : {}}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    Submit
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 1.25C6.56294 1.25 1.75 6.06294 1.75 12C1.75 17.9371 6.56294 22.75 12.5 22.75C18.4371 22.75 23.25 17.9371 23.25 12C23.25 6.06294 18.4371 1.25 12.5 1.25ZM13.25 8C13.25 7.58579 12.9142 7.25 12.5 7.25C12.0858 7.25 11.75 7.58579 11.75 8V11.25H8.5C8.08579 11.25 7.75 11.5858 7.75 12C7.75 12.4142 8.08579 12.75 8.5 12.75H11.75V16C11.75 16.4142 12.0858 16.75 12.5 16.75C12.9142 16.75 13.25 16.4142 13.25 16V12.75H16.5C16.9142 12.75 17.25 12.4142 17.25 12C17.25 11.5858 16.9142 11.25 16.5 11.25H13.25V8Z"
                        fill="white"
                      ></path>
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <h1 className={classes.form_title}>
          <input type="text" placeholder="Title" required ref={titleRef} />
        </h1>
        <div className={classes.form_body}>
          <div className={classes.form_row}>
            <span className={classes.form_icon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2V6"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18V22"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 12H18"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12H2"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.9292 4.92896L7.75762 7.75738"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.2427 16.2427L19.0711 19.0711"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.0711 4.92896L16.2427 7.75738"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75713 16.2427L4.92871 19.0711"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={classes.form_label}>Status</span>
            <span className={classes.form_value}>
              {/* <!-- For below change color to #ccc when not selected is selected --> */}
              <select
                ref={statusRef}
                style={status === "" ? { color: "#ccc" } : {}}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Not selected</option>
                <option value="To do">To do</option>
                <option value="In progress">In progress</option>
                <option value="Under review">Under review</option>
                <option value="Completed">Completed</option>
              </select>
            </span>
          </div>
          <div className={classes.form_row}>
            <span className={classes.form_icon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_42_503)">
                  <path
                    d="M11.5757 1.42427C11.81 1.18996 12.1899 1.18996 12.4243 1.42427L22.5757 11.5757C22.81 11.81 22.8101 12.1899 22.5757 12.4243L12.4243 22.5757C12.19 22.81 11.8101 22.8101 11.5757 22.5757L1.42427 12.4243C1.18996 12.19 1.18996 11.8101 1.42427 11.5757L11.5757 1.42427Z"
                    stroke="#666666"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V12"
                    stroke="#666666"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16.0099L12.01 15.9988"
                    stroke="#666666"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_42_503">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span className={classes.form_label}>Priority</span>
            <span className={classes.form_value}>
              {/* <!-- For below change color to #ccc when not selected is selected --> */}
              <select
                ref={priorityRef}
                style={priority === "" ? { color: "#ccc" } : {}}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Not selected</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Urgent">Urgent</option>
              </select>
            </span>
          </div>
          <div className={classes.form_row}>
            <span className={classes.form_icon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 10V6C3 4.89543 3.89543 4 5 4H7"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 2V6"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={classes.form_label}>Deadline</span>
            <span className={classes.form_value}>
              {/* <!-- <input type="text" placeholder="Not selected" required /> --> */}
              <div
                className={classes.datePicker}
                style={date === "" ? { color: "#ccc" } : { color: "black" }}
                onClick={() => dateRef.current?.showPicker()}
              >
                {date === "" ? "Not selected" : date}
              </div>
              <input
                type="date"
                className={classes.datePickerMain}
                ref={dateRef}
                onChange={(e) => setDate(e.target.value)}
              />
              {/* <!-- onClick={(e) => e.currentTarget.showPicker() }/> --> */}
            </span>
          </div>
          <div className={classes.form_row}>
            <span className={classes.form_icon}>
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
            <span className={classes.form_label}>Description</span>
            <span className={classes.form_value}>
              <input
                type="text"
                placeholder="Not selected"
                ref={descriptionRef}
              />
            </span>
          </div>
          <div className={`${classes.form_row} ${classes.add_property}`}>
            <span className={classes.form_icon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H12M12 12H18M12 12V6M12 12V18"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={classes.form_label}>Add custom property</span>
          </div>
        </div>
        <div className={classes.form_footer}>
          <p>Start writing, or drag your own files here.</p>
        </div>
      </div>
      <div
        className={classes.overlay}
        onClick={() => setNotes({ visible: false, status: "" })}
        style={notes.visible ? { opacity: "0.5" } : { pointerEvents: "none" }}
      ></div>
    </>
  );
}
