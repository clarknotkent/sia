import React from 'react';

const ReceiptModal = ({ receipt, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-gray-800">
            <h2 className="text-xl font-bold mb-4">Receipt</h2>
            <pre>{JSON.stringify(receipt, null, 2)}</pre>
            <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
        </div>
    </div>
);

export default ReceiptModal;
