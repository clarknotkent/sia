// src/private/StaffManagement/ConfirmModal.jsx


const ConfirmModal = ({ confirmModal, handleConfirm, handleCancelConfirm }) => {
  if (!confirmModal.show) return null;

  const { action, employee } = confirmModal;

  const modalTitle =
    action === 'remove'
      ? 'Confirm Removal'
      : employee.status === 'Active'
      ? 'Confirm Suspension'
      : 'Confirm Activation';

  const modalMessage =
    action === 'remove'
      ? `Are you sure you want to remove ${employee.name}?`
      : employee.status === 'Active'
      ? `Are you sure you want to suspend ${employee.name}?`
      : `Are you sure you want to activate ${employee.name}?`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-black">
        <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
            onClick={handleConfirm}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleCancelConfirm}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

ConfirmModal.propTypes = {
  confirmModal: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
    employee: PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleCancelConfirm: PropTypes.func.isRequired,
};

export default ConfirmModal;
