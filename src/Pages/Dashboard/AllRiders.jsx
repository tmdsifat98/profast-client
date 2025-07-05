import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaXmark } from "react-icons/fa6";

const AllRiders = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.post("/riders/delete", { email });
    },
    onSuccess: async () => {
      await refetch();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Rider deleted",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Riders</h2>
      {riders.length === 0 ? (
        <p>No riders found.</p>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id} className="text-center">
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.age}</td>
                  <td>{rider.vehicleType}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This action cannot be undone!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(rider.email);
                          }
                        });
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <FaXmark />
                    </button>
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

export default AllRiders;
