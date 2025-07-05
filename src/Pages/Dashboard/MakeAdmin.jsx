import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useDebounce from "../../hooks/useDebounce";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // ✅ Search query
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchUsers", debouncedSearch],
    enabled: !!debouncedSearch, // Only run when search term exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    // Fetch users based on the debounced search term
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await axiosSecure.get(
        `/users/search?email=${debouncedSearch}`
      );
      return res.data;
    },
  });

  // ✅ Make admin mutation
  const makeAdminMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/users/admin/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch(); // Refetch users after making an admin
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User has been made admin.",
        timer: 1500,
        showConfirmButton: false,
        position: "center",
      });
    },
    onError: (error) => {
      console.error("Error making admin:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to make admin!",
      });
    },
  });

  return (
    <div className="p-4">
      <form>
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>SL</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Make Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role !== "admin" ? (
                      <button
                        onClick={() => makeAdminMutation.mutate(user._id)}
                        className="btn btn-primary btn-sm text-black"
                        disabled={makeAdminMutation.isLoading}
                      >
                        {makeAdminMutation.isLoading
                          ? "Processing..."
                          : "Make Admin"}
                      </button>
                    ) : (
                      "Already Admin"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
