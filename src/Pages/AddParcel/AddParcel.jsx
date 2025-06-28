import React from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ChargeDetailsModal from "../../modals/ChargeDetailsModal";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const AddParcel = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, watch } = useForm();

  const serviceCenters = useLoaderData();

  // Extract unique regions
  const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];

  // Get districts by region
  const getDistrictsByRegion = (region) =>
    serviceCenters.filter((w) => w.region === region).map((w) => w.district);

  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");
  const parcelTypeWatch = watch("parcelType");
  const weightWatch = watch("weight") ? parseFloat(watch("weight")) : 0;
  const senderCenter = watch("sender_center");
  const receiverCenter = watch("receiver_center");
  const deliveryDestination =
    senderCenter && receiverCenter && senderCenter === receiverCenter
      ? "within"
      : "outside";

  // Generate Tracking ID
  function generateTrackingID() {
    const prefix = "TRK";
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${randomPart}-${timestamp}`;
  }

  // Calculate Charge
  function calculateParcelCharge(parcelType, weightKg, destination) {
    if (!["document", "non-document"].includes(parcelType)) {
      throw new Error("Invalid parcel type");
    }
    if (!["within", "outside"].includes(destination)) {
      throw new Error("Invalid destination");
    }

    let charge = 0;

    if (parcelType === "document") {
      charge = destination === "within" ? 60 : 80;
    } else if (parcelType === "non-document") {
      if (weightKg <= 3) {
        charge = destination === "within" ? 110 : 150;
      } else {
        const extraKg = weightKg - 3;
        const extraCharge = extraKg * 40;
        charge =
          destination === "within" ? 110 + extraCharge : 150 + extraCharge + 40;
      }
    }

    return charge;
  }

  const onSubmit = (data) => {
    // Compare sender_center and receiver_center
    const isWithinCity = data.sender_center === data.receiver_center;
    const delivery_destination = isWithinCity ? "within" : "outside";
    const parcelType = data.parcelType;
    const weight =
      data.parcelType === "document" ? 0 : parseFloat(data.weight || 0);

    const finalWeight =
      data.parcelType === "document" ? 0 : parseFloat(data.weight || "0");

    const charge = calculateParcelCharge(
      data.parcelType,
      finalWeight,
      delivery_destination
    );
    let baseCharge = 0;
    let extraKg = 0;
    let extraCharge = 0;
    let fixedExtraCharge = 0; // For outside city over 3kg

    if (parcelType === "document") {
      baseCharge = deliveryDestination === "within" ? 60 : 80;
    } else if (parcelType === "non-document") {
      if (weight <= 3) {
        baseCharge = deliveryDestination === "within" ? 110 : 150;
      } else {
        extraKg = weight - 3;
        extraCharge = extraKg * 40;
        baseCharge = deliveryDestination === "within" ? 110 : 150;
        fixedExtraCharge = deliveryDestination === "within" ? 0 : 40;
      }
    }

    const totalCharge = baseCharge + extraCharge + fixedExtraCharge;

    const details = `
Parcel Type: ${parcelType === "document" ? "Document" : "Non-Document"}
Delivery Destination: ${
      deliveryDestination === "within" ? "Within City" : "Outside City"
    }

${
  parcelType === "document"
    ? `Fixed Charge: ${baseCharge} TK`
    : `Base Charge (first 3 kg): ${baseCharge} TK
Weight: ${weight} kg
Extra Weight: ${extraKg.toFixed(2)} kg
Extra Charge: ${extraCharge.toFixed(2)} TK (40 TK per extra kg)
${fixedExtraCharge > 0 ? `Fixed Extra Charge: ${fixedExtraCharge} TK\n` : ""}
`
}

Total Charge: ${totalCharge.toFixed(2)} TK
`;

    Swal.fire({
      title: "Parcel Charge Details",
      html: `<pre style="text-align:left; white-space: pre-wrap; font-family: monospace;">${details}</pre>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const stripe = await stripePromise;

        // Create Checkout Session on server
        const response = await axiosSecure.post("/create-checkout-session", {
          amount: charge,
          metadata: {
            tracking_id: data.tracking_id,
            sender_email: data.sender_email,
            receiver_email: data.receiver_email,
          },
        });

        const session = response.data;

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          Swal.fire("Error", result.error.message, "error");
        }
        Swal.fire({
          title: "Processing Payment...",
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        setTimeout(() => {
          Swal.close();
          Swal.fire(
            "Payment Successful!",
            "Your parcel is being processed.",
            "success"
          );

          // Payment সফল হলে এখন ডাটাবেজে ডাটা POST কর
          const parcelData = {
            ...data,
            weight: finalWeight,
            delivery_status: "Not Collected",
            creation_date: new Date().toISOString(),
            tracking_id: generateTrackingID(),
            charge: charge,
            delivery_destination,
          };

          axiosSecure
            .post("/parcels", parcelData)
            .then((res) => {
              console.log(res.data);
              Swal.fire("Success", "Parcel added successfully!", "success");
            })
            .catch((err) => {
              console.error(err);
              Swal.fire("Error", "Failed to add parcel. Try again.", "error");
            });
        }, 2000); // এখানে payment processing simulation, তুই নিজের payment integration দিবি
      }
    });
  };

  const isDocument = parcelTypeWatch === "document";

  return (
    <div className="max-w-6xl mx-auto bg-base-100 shadow-md rounded-xl p-8 mt-8">
      <h2 className="text-3xl font-bold text-primary mb-6">Add Parcel</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Type Selection */}
        <div>
          <p className="font-semibold text-lg mb-2">
            Enter your parcel details
          </p>
          <div className="flex items-center gap-4">
            <label className="label cursor-pointer">
              <input
                defaultChecked
                type="radio"
                value="document"
                {...register("parcelType", { required: true })}
                className="radio checked:bg-green-500"
              />
              <span className="ml-2">Document</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="radio"
                value="non-document"
                {...register("parcelType", { required: true })}
                className="radio"
              />
              <span className="ml-2">Non-Document</span>
            </label>
          </div>
        </div>

        {/* Parcel Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Parcel Email"
            {...register("parcelEmail")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="label">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            {...register("weight")}
            disabled={isDocument}
            className={`input input-bordered w-full mt-1 ${
              isDocument ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="Enter weight"
          />
        </div>
        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Info */}
          <div className="border p-4 rounded-xl shadow-md space-y-4">
            <h3 className="font-semibold text-xl">Sender Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("sender_email", { required: true })}
                className="input input-bordered w-full"
                placeholder="Email"
                type="email"
              />
              <input
                {...register("sender_name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Name"
              />
              <input
                {...register("sender_contact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Contact"
              />
              <select
                {...register("sender_region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("sender_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(senderRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                {...register("sender_address", { required: true })}
                className="input input-bordered w-full"
                placeholder="Address"
              />
              <textarea
                {...register("pickup_instruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Pickup Instruction"
              />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="border p-4 rounded-xl shadow-md space-y-4">
            <h3 className="font-semibold text-xl">Receiver Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("receiver_email", { required: true })}
                className="input input-bordered w-full"
                placeholder="Email"
                type="email"
              />
              <input
                {...register("receiver_name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Name"
              />
              <input
                {...register("receiver_contact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Contact"
              />
              <select
                {...register("receiver_region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("receiver_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(receiverRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                {...register("receiver_address", { required: true })}
                className="input input-bordered w-full"
                placeholder="Address"
              />
              <textarea
                {...register("delivery_instruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Delivery Instruction"
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          * PickUp Time 4pm–7pm Approx.
        </p>

        <button
          type="submit"
          className="btn bg-lime-400 hover:bg-lime-500 border-none text-white mt-4"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default AddParcel;
