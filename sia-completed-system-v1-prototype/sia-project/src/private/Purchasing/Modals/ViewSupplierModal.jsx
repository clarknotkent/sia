// src/private/Purchasing/Modals/ViewSupplierModal.jsx
import PropTypes from 'prop-types';

const ViewSupplierModal = ({ supplier, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Supplier Details</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Supplier ID</td>
              <td className="border px-4 py-2">{supplier.supplierID}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Supplier Name</td>
              <td className="border px-4 py-2">{supplier.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Contact Person</td>
              <td className="border px-4 py-2">{supplier.contactPerson}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Contact Number</td>
              <td className="border px-4 py-2">{supplier.contactNumber}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
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

ViewSupplierModal.propTypes = {
  supplier: PropTypes.shape({
    supplierID:     PropTypes.string.isRequired,
    name:           PropTypes.string.isRequired,
    contactPerson:  PropTypes.string.isRequired,
    contactNumber:  PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewSupplierModal;
