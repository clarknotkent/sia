// src/private/Ordering/Modals/ViewClientModal.jsx
import PropTypes from 'prop-types';

const ViewClientModal = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Client Details</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Client ID</td>
              <td className="border px-4 py-2">{client.clientID}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Company Name</td>
              <td className="border px-4 py-2">{client.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">License No.</td>
              <td className="border px-4 py-2">{client.licenseNo}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Address</td>
              <td className="border px-4 py-2">{client.address || '—'}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Contact Person</td>
              <td className="border px-4 py-2">{client.contactPerson}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Contact Number</td>
              <td className="border px-4 py-2">{client.contactNumber}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Email</td>
              <td className="border px-4 py-2">{client.email}</td>
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

ViewClientModal.propTypes = {
  client: PropTypes.shape({
    clientID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    licenseNo: PropTypes.string.isRequired,
    address: PropTypes.string,
    contactPerson: PropTypes.string.isRequired,
    contactNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewClientModal;
