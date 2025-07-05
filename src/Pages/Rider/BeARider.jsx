import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useLoaderData } from "react-router";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

export const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();
  const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];
  const getDistrictsByRegion = (region) =>
    serviceCenters.filter((w) => w.region === region).map((w) => w.district);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const vehicleType = watch("vehicleType");
  const district = watch("region");
  const riderMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosSecure.post("/riders", formData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Rider registered successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      console.error("Error submitting:", error);
      alert("Something went wrong!");
    },
  });

  const onSubmit = (data) => {
    const riderData = {
      ...data,
      name: user.displayName,
      email: user.email,
      status: "pending",
    };
    riderMutation.mutate(riderData);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Be A Rider</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            defaultValue={user?.displayName || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block mb-1 font-medium">Region</label>
          <select
            {...register("region", { required: true })}
            className="py-2 rounded px-3 select-bordered w-full border"
          >
            <option value="">Select Region</option>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block mb-1 font-medium">District</label>
          <select
            {...register("district", { required: true })}
            className="py-2 rounded px-3 select-bordered w-full border"
          >
            <option value="">Select Service Center</option>
            {getDistrictsByRegion(district).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              min: { value: 18, message: "Minimum age is 18" },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="bicycle"
                {...register("vehicleType", {
                  required: "Select a vehicle type",
                })}
              />
              Bicycle
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="motorbike"
                {...register("vehicleType")}
              />
              Motorbike
            </label>
          </div>
          {errors.vehicleType && (
            <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>
          )}
        </div>

        {/* Bike Registration */}
        {vehicleType === "motorbike" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Bike Registration Number
            </label>
            <input
              type="text"
              {...register("bikeRegistration", {
                required:
                  "Bike Registration is required when motorbike selected",
              })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.bikeRegistration && (
              <p className="text-red-500 text-sm">
                {errors.bikeRegistration.message}
              </p>
            )}
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Enter a valid phone number",
              },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={riderMutation.isPending}
          className="btn btn-primary text-black w-full"
        >
          {riderMutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
