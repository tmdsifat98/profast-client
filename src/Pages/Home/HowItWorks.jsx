import { MdCorporateFare } from "react-icons/md";
import { FiTruck } from "react-icons/fi";
import { FaHandHoldingDollar, FaHouseChimneyMedical } from "react-icons/fa6";

const howItWorksData = [
  {
    title: "Booking Pick & Drop",
    description:
      "Seamless doorstep pick-up and drop-off for your packages — fast, safe, and reliable.",
    icon: FiTruck,
  },
  {
    title: "Cash On Delivery",
    description:
      "Pay when you receive. Hassle-free Cash on Delivery for your peace of mind.",
    icon: FaHandHoldingDollar,
  },
  {
    title: "Delivery Hub",
    description: "Convenient hub-based delivery options to suit your schedule.",
    icon: FaHouseChimneyMedical,
  },
  {
    title: "Booking SME & Corporate",
    description:
      "Tailored solutions for SMEs and corporate shipments — reliable and efficient.",
    icon: MdCorporateFare,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          How it Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{<item.icon size={27} />}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
