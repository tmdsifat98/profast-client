import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaXmark } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch pending riders
  const { data:pendingRiders=[], isLoading, isError, refetch } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/riders?status=pending");
      return res.data;
    },
  });

  // ✅ Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.post(`/api/riders/accept?email=${email}`);
    },
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Rider approved",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    },
  });

  // ✅ Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.post(`/api/riders/reject?email=${email}`);
    },
    onSuccess: () => {
        Swal.fire({
        position: "center",
        icon: "success",
        title: "Rider rejected",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Rider Requests</h2>
      {pendingRiders.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Vehicle</th>
                <th>Region</th>
                <th>District</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRiders.map((rider) => (
                <tr key={rider._id} className="text-center">
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.age}</td>
                  <td>{rider.vehicleType}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => approveMutation.mutate(rider.email)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        <GiCheckMark />
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(rider.email)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaXmark />
                      </button>
                    </div>
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

export default PendingRiders;
