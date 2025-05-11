// src/private/Purchasing/Modals/ViewReceivingLogModal.jsx
import PropTypes from 'prop-types';

const ViewReceivingLogModal = ({ log, onClose, onSendToInventory }) => {
  const formatDate = (rawDate) => {
    const d = new Date(rawDate);
    if (isNaN(d)) return rawDate;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-gray-900 overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-center">Receiving Log Details</h2>
        <div className="mb-4 text-sm space-y-1">
          <p><strong>Log Number:</strong> {log.logID}</p>
          <p><strong>PO Number:</strong> {log.poID}</p>
          <p><strong>Date Received:</strong> {log.dateReceived ? formatDate(log.dateReceived) : ''}</p>
          <p><strong>Status:</strong> {log.status}</p>
        </div>

        <h3 className="mt-4 text-lg font-semibold">Supplier</h3>
        <p><strong>Name:</strong> {log.supplierName}</p>

        <div className="flex justify-start mb-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Received Items</h3>
        </div>
        <table className="table-auto w-full text-sm border border-gray-300 mb-6 text-gray-900 mx-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-center">SKU</th>
              <th className="border px-2 py-1 text-center">Generic Name</th>
              <th className="border px-2 py-1 text-center">Brand Name</th>
              <th className="border px-2 py-1 text-center">Unit</th>
              <th className="border px-2 py-1 text-center">Packing</th>
              <th className="border px-2 py-1 text-center">Lot Number</th>
              <th className="border px-2 py-1 text-center">Expiry Date</th>
              <th className="border px-2 py-1 text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {log.items && log.items.length > 0 ? (
              log.items.map((item, idx) => (
                <tr key={idx} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-1">{item.sku || ''}</td>
                  <td className="border px-2 py-1">{item.genericName || item.name || ''}</td>
                  <td className="border px-2 py-1">{item.brandName || ''}</td>
                  <td className="border px-2 py-1">{item.unitOfMeasurement || item.unit || ''}</td>
                  <td className="border px-2 py-1">{item.packing || ''}</td>
                  <td className="border px-2 py-1">{item.lotNum || ''}</td>
                  <td className="border px-2 py-1">{item.expiryDate || ''}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-2 py-1 text-center" colSpan={8}>No items listed.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mt-6 gap-2">
          {log.status === 'Complete' && onSendToInventory && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => onSendToInventory(log)}
            >
              Send to Inventory
            </button>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewReceivingLogModal.propTypes = {
  log: PropTypes.shape({
    logID: PropTypes.string.isRequired,
    poID: PropTypes.string.isRequired,
    supplierName: PropTypes.string.isRequired,
    dateReceived: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        sku: PropTypes.string,
        genericName: PropTypes.string,
        name: PropTypes.string,
        brandName: PropTypes.string,
        unitOfMeasurement: PropTypes.string,
        unit: PropTypes.string,
        packing: PropTypes.string,
        lotNum: PropTypes.string,
        expiryDate: PropTypes.string,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSendToInventory: PropTypes.func,
};

export default ViewReceivingLogModal;
