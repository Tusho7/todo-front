import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  _id: string;
  username: string;
}

interface ResourceData {
  name: string;
  description: string;
  assignee: string;
}

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold mb-6">Create Task Page</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Task Name Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter task title"
            name="name"
            value={resourceData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Task Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter description"
            name="description"
            value={resourceData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Assign To
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <div className="flex items-center justify-between">
          <button
            onClick={createResource}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Create Task
          </button>
          <button
            onClick={seeTasks}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            See Tasks
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
