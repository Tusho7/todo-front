import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Assignee, Task } from "../types/task";

const AllTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<Assignee[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{
    [taskId: string]: string;
  }>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
    fetchTasks();
  }, []);

  const addTaskAssignee = async (taskId: string, assigneeId: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}/assignee`,
        { assigneeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Task Assigned",
        text: "The task has been assigned successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error assigning task. Please try again later.",
      });
      console.error("Error adding task assignee:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      Swal.fire({
        icon: "success",
        title: "Task Deleted",
        text: "The task has been deleted successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error deleting task. Please try again later.",
      });
      console.error("Error deleting task:", error);
    }
  };

  const editTaskTitle = async (taskId: string, newTitle: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}`,
        { name: newTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, name: newTitle } : task
        )
      );
      Swal.fire({
        icon: "success",
        title: "Task Title Updated",
        text: "The task title has been updated successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error editing task title. Please try again later.",
      });
      console.error("Error editing task title:", error);
    }
  };

  const editTaskDescription = async (
    taskId: string,
    newDescription: string
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}`,
        { description: newDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, description: newDescription } : task
        )
      );
      Swal.fire({
        icon: "success",
        title: "Task Description Updated",
        text: "The task description has been updated successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error editing task description. Please try again later.",
      });
      console.error("Error editing task description:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8 animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-center mb-6">All Tasks</h1>
        <div className="mb-6">
          <ul>
            {tasks.map((task) => (
              <li
                key={task._id}
                className="mb-4 p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex flex-wrap justify-start gap-7 lg:gap-0 lg:justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Task Title: {task.name}
                    </h2>
                    <p className="text-gray-600">
                      Task Description: {task.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Enter new title:",
                          input: "text",
                          inputValue: task.name,
                          showCancelButton: true,
                        }).then((result) => {
                          if (result.value) {
                            editTaskTitle(task._id, result.value);
                          }
                        });
                      }}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                    >
                      Edit Title
                    </button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Enter new description:",
                          input: "textarea",
                          inputValue: task.description,
                          showCancelButton: true,
                        }).then((result) => {
                          if (result.value) {
                            editTaskDescription(task._id, result.value);
                          }
                        });
                      }}
                      className="text-green-500 hover:text-green-600 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                    >
                      Edit Description
                    </button>
                  </div>
                  {task?.assignee?.username ? (
                    <h1 className="text-2xl">
                      User: {task?.assignee?.username}
                    </h1>
                  ) : (
                    <div className="flex justify-between items-center">
                      <select
                        value={selectedUsers[task._id] || ""}
                        onChange={(e) => {
                          const userId = e.target.value;
                          setSelectedUsers({
                            ...selectedUsers,
                            [task._id]: userId,
                          });
                        }}
                        className="border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const selectedUserId = selectedUsers[task._id];
                          if (selectedUserId)
                            addTaskAssignee(task._id, selectedUserId);
                        }}
                        className="text-blue-500 hover:text-blue-600 ml-2 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                      >
                        Assign Task
                      </button>
                    </div>
                  )}
                  {task.completed ? (
                    <p className="text-green-500 font-semibold">Completed</p>
                  ) : (
                    <p className="text-red-500 font-semibold">Unfulfilled</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <section className="flex justify-between mt-6">
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            Dashboard
          </button>
        </section>
      </div>
    </div>
  );
};

export default AllTasks;
