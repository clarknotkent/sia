// src/private/Purchasing/Modals/ViewPurchaseOrderModal.jsx

import PropTypes from 'prop-types';

const ViewPurchaseOrderModal = ({ order, onClose, onSendToReceivingLogs }) => {
  const supplier = order.supplier || {};

  const formatDate = (rawDate) => {
    const d = new Date(rawDate);
    if (isNaN(d)) return rawDate;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const totalAmount = order.items?.reduce((sum, item) => sum + ((item.quantity ?? 0) * (item.unitPrice ?? 0)), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-gray-900 overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-center">Purchase Order Details</h2>
        <div className="mb-4 text-sm space-y-1">
          <p><strong>PO Number:</strong> {order.poID}</p>
          <p><strong>Order Date:</strong> {order.orderDate ? formatDate(order.orderDate) : ''}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        <h3 className="mt-4 text-lg font-semibold">Supplier</h3>
        <p><strong>ID:</strong> {order.supplierID}</p>
        <p><strong>Name:</strong> {supplier.name || order.supplierID}</p>
        {supplier.contactPerson && (
          <p><strong>Contact:</strong> {supplier.contactPerson} {supplier.contactNumber ? `| ${supplier.contactNumber}` : ''}</p>
        )}

        <div className="flex justify-start mb-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Order Items</h3>
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
              <th className="border px-2 py-1 text-center">Stock</th>
              <th className="border px-6 py-1 text-center">Unit Price</th>
              <th className="border px-2 py-1 text-center">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <tr key={idx} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-1">{item.sku}</td>
                  <td className="border px-2 py-1">{item.genericName || item.name}</td>
                  <td className="border px-2 py-1">{item.brandName}</td>
                  <td className="border px-2 py-1">{item.unitOfMeasurement}</td>
                  <td className="border px-2 py-1">{item.packing}</td>
                  <td className="border px-2 py-1">{item.lotNum}</td>
                  <td className="border px-2 py-1">{item.expiryDate}</td>
                  <td className="border px-2 py-1 text-center">{item.stock || item.quantity}</td>
                  <td className="border px-6 py-1 text-center">₱{(item.unitPrice ?? 0).toFixed(2)}</td>
                  <td className="border px-2 py-1 text-center">₱{((item.quantity ?? 0) * (item.unitPrice ?? 0)).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-2 py-1 text-center" colSpan={10}>No items listed.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-right font-semibold text-lg">
          Total: ₱{(totalAmount ?? 0).toFixed(2)}
        </div>

        <div className="flex justify-end mt-6 gap-2">
          {order.status === 'Delivered' && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => onSendToReceivingLogs && onSendToReceivingLogs(order)}
            >
              Send to Receiving Logs
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

ViewPurchaseOrderModal.propTypes = {
  order: PropTypes.shape({
    poID: PropTypes.string,
    orderDate: PropTypes.string,
    status: PropTypes.string,
    supplierID: PropTypes.string,
    supplier: PropTypes.shape({
      name: PropTypes.string,
      contactPerson: PropTypes.string,
      contactNumber: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        sku: PropTypes.string,
        genericName: PropTypes.string,
        name: PropTypes.string,
        brandName: PropTypes.string,
        unitOfMeasurement: PropTypes.string,
        packing: PropTypes.string,
        lotNum: PropTypes.string,
        expiryDate: PropTypes.string,
        stock: PropTypes.number,
        quantity: PropTypes.number,
        unitPrice: PropTypes.number,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSendToReceivingLogs: PropTypes.func, // optional
};

export default ViewPurchaseOrderModal;
