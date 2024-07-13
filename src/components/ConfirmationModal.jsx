import React from "react";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-musify-dark text-white rounded-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Confirmation</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            className="btn bg-red-500 text-white px-4 py-2 rounded mr-4"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="btn bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
