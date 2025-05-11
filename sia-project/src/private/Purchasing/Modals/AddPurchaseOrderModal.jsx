// src/private/Purchasing/Modals/AddPurchaseOrderModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AddPurchaseOrderModal = ({ onAdd, onClose }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    poID: '',
    orderDate: '',
    status: 'Pending',
    supplierID: '',
    items: [
      {
        sku: '',
        genericName: '',
        brandName: '',
        unitOfMeasurement: '',
        packing: '',
        lotNum: '',
        expiryDate: '',
        stock: 1,
        unitPrice: 0,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all POs to determine the next PO number
    axios.get(`${API}/purchasing/purchaseOrders`)
      .then(res => {
        const numbers = res.data
          .map(po => parseInt((po.poID || '').replace('PO-', ''), 10))
          .filter(n => !isNaN(n));
        const nextNum = (numbers.length ? Math.max(...numbers) + 1 : 1);
        const nextID = `PO-${String(nextNum).padStart(4, '0')}`;
        setFormData(fd => ({
          ...fd,
          poID: nextID,
          orderDate: new Date().toISOString().split('T')[0], // set today's date
        }));
      });

    // fetch suppliers
    axios
      .get(`${API}/purchasing/suppliers`)
      .then(res => setSuppliers(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to load suppliers');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTopChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleItemChange = (idx, e) => {
    const { name, value } = e.target;
    setFormData(fd => {
      const items = [...fd.items];
      items[idx][name] = name === 'stock' || name === 'unitPrice'
        ? Math.max(0, parseFloat(value) || 0)
        : value;
      return { ...fd, items };
    });
  };

  const addItem = () => {
    setFormData(fd => ({
      ...fd,
      items: [
        ...fd.items,
        {
          sku: '',
          genericName: '',
          brandName: '',
          unitOfMeasurement: '',
          packing: '',
          lotNum: '',
          expiryDate: '',
          stock: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItem = idx => {
    setFormData(fd => ({
      ...fd,
      items: fd.items.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.orderDate || !formData.supplierID) {
      return alert('Please complete all required fields.');
    }

    // Prepare items as needed (include unitPrice)
    const itemsDetailed = formData.items.map(it => ({
      sku: it.sku,
      name: it.genericName,
      quantity: it.stock,
      brandName: it.brandName,
      unitOfMeasurement: it.unitOfMeasurement,
      packing: it.packing,
      lotNum: it.lotNum,
      expiryDate: it.expiryDate,
      unitPrice: it.unitPrice,
    }));

    const formattedDate = formData.orderDate;

    const payload = {
      ...formData,
      orderDate: formattedDate,
      items: itemsDetailed,
    };

    try {
      const resp = await axios.post(`${API}/purchasing/purchaseOrders`, payload);
      onAdd(resp.data); // Pass the new order to parent
      onClose();
    } catch (err) {
      alert('Failed to add purchase order: ' + (err.response?.data?.error || err.message));
      console.error('Add PO error:', err);
    }
  };


  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow text-center text-gray-900">Loading…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow text-center text-gray-900">
          <p className="text-red-500">{error}</p>
          <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Add New Purchase Order
        </h2>

        {/* Top section */}
        <table className="w-full text-sm border border-gray-300 mb-6 text-gray-900">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-medium">PO Number</td>
              <td className="border px-4 py-2">
                <input
                  name="poID"
                  value={formData.poID}
                  readOnly
                  className="w-full border px-2 py-1 bg-gray-100 text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Order Date</td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  readOnly
                  className="w-full border px-2 py-1 bg-gray-100 text-gray-900"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Status</td>
              <td className="border px-4 py-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleTopChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-medium">Supplier</td>
              <td className="border px-4 py-2">
                <select
                  name="supplierID"
                  value={formData.supplierID}
                  onChange={handleTopChange}
                  className="w-full border px-2 py-1 bg-white text-gray-900"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.supplierID} value={s.supplierID}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bottom section: product fields */}
        <div className="flex justify-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
        </div>
        <table className="table-auto w-full text-sm border border-gray-300 mb-4 text-gray-900 mx-auto">
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
              <th className="border px-2 py-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((it, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="sku"
                    value={it.sku || ''}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="genericName"
                    value={it.genericName}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="brandName"
                    value={it.brandName}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="unitOfMeasurement"
                    value={it.unitOfMeasurement}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="packing"
                    value={it.packing}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    name="lotNum"
                    value={it.lotNum}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="date"
                    name="expiryDate"
                    value={it.expiryDate}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    name="stock"
                    min="1"
                    value={it.stock}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-1 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-6 py-1">
                  <input
                    type="number"
                    name="unitPrice"
                    min="0"
                    value={it.unitPrice}
                    onChange={e => handleItemChange(idx, e)}
                    className="w-full border px-3 py-1 bg-white text-gray-900 text-center"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => removeItem(idx)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addItem}
          className="mb-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          + Add Item
        </button>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

AddPurchaseOrderModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPurchaseOrderModal;
