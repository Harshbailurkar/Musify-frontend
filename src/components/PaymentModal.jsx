import React from "react";
import Modal from "react-modal";
import { IoIosWarning } from "react-icons/io";
Modal.setAppElement("#root");

const PaymentModal = ({ isOpen, onRequestClose, price, onProceedToPay }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#111", // Dark background color
          color: "#f9fafb", // Light text color
          border: "none",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)", // Dark overlay color
        },
      }}
    >
      <h2 className="text-xl font-semibold mb-4 flex item center justify-center py-5">
        {" "}
        <IoIosWarning size={32} color="yellow" />
        <p className="px-4"> Payment Required</p>
      </h2>
      <p className="mb-4">
        You need to buy an entry pass of Rs. {price} to join this concert.
      </p>
      <button
        onClick={onProceedToPay}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Proceed to Pay
      </button>
    </Modal>
  );
};

export default PaymentModal;
