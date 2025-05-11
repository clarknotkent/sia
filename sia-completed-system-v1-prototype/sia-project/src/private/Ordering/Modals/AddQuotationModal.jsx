// src/private/Ordering/Modals/AddQuotationModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddQuotationModal = ({ onAdd, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    quotationID: '',
    quotationDate: '',
    status: 'Pending',
    client: null,
    items: [{ productId: '', quantity: 0 }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = 'http://localhost:5000';
        const [clientRes, inventoryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/orders/clients`),
          axios.get(`${API_BASE_URL}/api/inventory`),
        ]);
        setClients(clientRes.data);
        setInventoryItems(inventoryRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Generate a unique Quotation ID
    const generateQuotationID = () => {
      const randomID = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
      return `Q-${randomID}`;
    };

    // Set the generated Quotation ID when the modal is opened
    setFormData((prev) => ({
      ...prev,
      quotationID: generateQuotationID(),
    }));

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (e) => {
    const selected = clients.find((c) => c.clientID === e.target.value);
    setFormData((prev) => ({ ...prev, client: selected }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === 'quantity' ? parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = () => {
    if (!formData.quotationDate || !formData.client) {
      return alert("Please complete all required fields.");
    }

    const itemsDetailed = formData.items.map((item) => {
      const product = inventoryItems.find((p) => p.id === item.productId);
      if (!product) {
        alert("One or more selected products are invalid.");
        throw new Error("Invalid product selection.");
      }
      return {
        name: product.genericName,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    const totalAmount = itemsDetailed.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const dateObj = new Date();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    const formattedDate = `${mm}-${dd}-${yyyy} | ${hh}:${min}`;

    onAdd({
      ...formData,
      quotationDate: formattedDate,
      items: itemsDetailed,
      totalAmount,
    });
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] text-gray-900">
        <h2 className="text-xl font-bold text-center mb-4">Add New Quotation</h2>

        <table className="w-full text-sm border border-gray-300 mb-4">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">Quotation ID</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="quotationID"
                  value={formData.quotationID}
                  readOnly
                  className="w-full border px-2 py-1 bg-gray-100 text-gray-800"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Quotation Date</td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="quotationDate"
                  value={formData.quotationDate}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Status</td>
              <td className="border px-4 py-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Client</td>
              <td className="border px-4 py-2">
                <select
                  onChange={handleClientSelect}
                  value={formData.client?.clientID || ''}
                  className="w-full border px-2 py-1 bg-white"
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.clientID} value={c.clientID}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            {formData.client && (
              <>
                <tr>
                  <td className="border px-4 py-2">License No.</td>
                  <td className="border px-4 py-2">{formData.client.licenseNo}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Contact Person</td>
                  <td className="border px-4 py-2">{formData.client.contactPerson}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Contact Number</td>
                  <td className="border px-4 py-2">{formData.client.contactNumber}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Email</td>
                  <td className="border px-4 py-2">{formData.client.email}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quotation Items</h3>
        <table className="w-full text-sm border border-gray-300 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Product</th>
              <th className="border px-2 py-1 text-right">Qty</th>
              <th className="border px-2 py-1 text-right">Price</th>
              <th className="border px-2 py-1 text-right">Stock</th>
              <th className="border px-2 py-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => {
              const selected = inventoryItems.find((p) => p.id === item.productId);
              return (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full border px-1 py-1 bg-white"
                    >
                      <option value="">Select Product</option>
                      {inventoryItems.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.genericName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full border px-1 py-1 text-right bg-white"
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {selected ? `₱${selected.price}` : ''}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {selected?.inventory?.stockLevel || ''}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
          onClick={addItem}
        >
          + Add Item
        </button>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddQuotationModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddQuotationModal;
