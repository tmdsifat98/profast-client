import React from "react";

const ChargeDetailsModal = ({ isOpen, onClose, parcelType, weight, destination }) => {
  if (!isOpen) return null;

  const withinCity = destination === "within";

  let details = "";
  let totalCharge = 0;

  if (parcelType === "document") {
    if (withinCity) {
      totalCharge = 60;
      details = `Parcel Type: Document\nDelivery: Within City\nCharge: Fixed 60 TK`;
    } else {
      totalCharge = 80;
      details = `Parcel Type: Document\nDelivery: Outside City\nCharge: Fixed 80 TK`;
    }
  } else if (parcelType === "non-document") {
    if (weight <= 3) {
      if (withinCity) {
        totalCharge = 110;
        details = `Parcel Type: Non-Document\nDelivery: Within City\nWeight: ${weight} kg (<=3 kg)\nCharge: Fixed 110 TK`;
      } else {
        totalCharge = 150;
        details = `Parcel Type: Non-Document\nDelivery: Outside City\nWeight: ${weight} kg (<=3 kg)\nCharge: Fixed 150 TK`;
      }
    } else {
      const extraKg = weight - 3;
      const extraCharge = extraKg * 40;

      if (withinCity) {
        totalCharge = 110 + extraCharge;
        details = `Parcel Type: Non-Document\nDelivery: Within City\nWeight: ${weight} kg (>3 kg)\nBase Charge (first 3kg): 110 TK\nExtra Weight: ${extraKg.toFixed(
          2
        )} kg\nExtra Charge: ${extraCharge.toFixed(2)} TK (40 TK per extra kg)\n\nTotal Charge: ${totalCharge.toFixed(2)} TK`;
      } else {
        totalCharge = 150 + extraCharge + 40; // +40 TK extra for outside city over 3kg
        details = `Parcel Type: Non-Document\nDelivery: Outside City\nWeight: ${weight} kg (>3 kg)\nBase Charge (first 3kg): 150 TK\nExtra Fixed Charge: 40 TK\nExtra Weight: ${extraKg.toFixed(
          2
        )} kg\nExtra Charge: ${extraCharge.toFixed(2)} TK (40 TK per extra kg)\n\nTotal Charge: ${totalCharge.toFixed(2)} TK`;
      }
    }
  } else {
    details = "Please select a valid parcel type and delivery destination.";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
        <h3 className="text-xl font-bold mb-4">Parcel Charge Calculation Details</h3>
        <pre className="whitespace-pre-wrap text-gray-800 font-mono">{details}</pre>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ChargeDetailsModal;
