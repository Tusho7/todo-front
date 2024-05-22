import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { User } from "../types/user";
import { ResourceData } from "../types/resourceData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resourceData, setResourceData] = useState<ResourceData>({
    name: "",
    description: "",
    assignee: "",
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error fetching users. Please try again later.",
        });
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const createResource = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/resources",
        resourceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Task Created",
          text: "The task has been created successfully!",
        });
        navigate("/all-tasks");
      }
    } catch (error) {
      if ((error as AxiosError).response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error creating resource: ${
            (error as AxiosError)?.response?.data?.message || "Unknown error"
          }`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error creating resource: ${(error as AxiosError).message}`,
        });
      }
    }
  };

  const handleChange = (e: any) => {
    setResourceData({ ...resourceData, [e.target.name]: e.target.value });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const seeTasks = () => {
    navigate("/all-tasks");
  };
  const seeUsers = () => {
    navigate("/all-users");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8 animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-center mb-6">Create Task</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Task Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            type="text"
            placeholder="Enter task title"
            name="name"
            value={resourceData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Task Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            placeholder="Enter description"
            name="description"
            value={resourceData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Assign To
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            name="assignee"
            value={resourceData.assignee}
            onChange={handleChange}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={createResource}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Create Task
          </button>
          <button
            onClick={seeTasks}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            See Tasks
          </button>
          <button
            onClick={seeUsers}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            See Users
          </button>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
