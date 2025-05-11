import { useState, useEffect } from 'react';
import axios from 'axios';
import ViewPurchaseOrderModal from './Modals/ViewPurchaseOrderModal';
import EditPurchaseOrderModal from './Modals/EditPurchaseOrderModal';
import AddPurchaseOrderModal from './Modals/AddPurchaseOrderModal';
import Pagination from '../../components/Pagination';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const formatDateTime = date => {
  const d = new Date(date);
  if (isNaN(d)) return date;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

const PurchaseOrdersTable = () => {
  const [orders, setOrders]           = useState([]);
  const [suppliers, setSuppliers]     = useState([]);
  const [searchTerm, setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortCol, setSortCol]         = useState(null);
  const [sortOrder, setSortOrder]     = useState('asc');
  const [page, setPage]               = useState(1);
  const [modalType, setModalType]     = useState(null);
  const [selected, setSelected]       = useState(null);
  const pageSize = 5;

  useEffect(() => {
    axios.get(`${API}/purchasing/purchaseOrders`)
      .then(r => setOrders(r.data))
      .catch(console.error);

    axios.get(`${API}/purchasing/suppliers`)
      .then(r => setSuppliers(r.data))
      .catch(console.error);
  }, []);

  // Helper to get supplier name by ID
  const getSupplierName = supplierID => {
    const supplier = suppliers.find(s => s.supplierID === supplierID);
    return supplier ? supplier.name : supplierID;
  };

  const getSupplierByID = id => suppliers.find(s => s.supplierID === id);

  const filtered = orders.filter(o =>
    (o.poID.toLowerCase().includes(searchTerm) ||
     getSupplierName(o.supplierID).toLowerCase().includes(searchTerm)) &&
    (!statusFilter || o.status === statusFilter)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    let va = a[sortCol], vb = b[sortCol];
    if (sortCol === 'supplierID') {
      va = getSupplierName(a.supplierID);
      vb = getSupplierName(b.supplierID);
    }
    if (va < vb) return sortOrder === 'asc' ? -1 : 1;
    if (va > vb) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const pageData = sorted.slice((page-1)*pageSize, page*pageSize);

  const openModal = (order, type) => {
    if (type === 'view' && order) {
      setSelected({
        ...order,
        supplier: getSupplierByID(order.supplierID) || {}
      });
    } else {
      setSelected(order);
    }
    setModalType(type);
  };

  const closeModal = () => { setSelected(null); setModalType(null); };

  const handleAdd = newOrder => {
    setOrders(o => [...o, newOrder]);
    closeModal();
  };

  const handleSave = data => {
    axios.put(`${API}/purchasing/purchaseOrders/${data.poID}`, data)
      .then(r => setOrders(
        orders.map(o => o.poID === r.data.poID ? r.data : o)
      ))
      .finally(closeModal);
  };

  const handleDelete = poID => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
    axios.delete(`${API}/purchasing/purchaseOrders/${poID}`)
      .then(() => setOrders(orders.filter(o => o.poID !== poID)))
      .catch(err => {
        console.error(err);
        alert('Failed to delete purchase order.');
      });
  };

  const toggleSort = col => {
    if (!['poID', 'supplierID', 'orderDate'].includes(col)) return;
    if (sortCol === col) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortOrder('asc'); }
  };

  const sendToReceivingLogs = async (order) => {
    const logID = `RL-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateReceived = new Date().toISOString().split('T')[0];
    const items = (order.items || []).map(it => ({
      name: it.genericName ?? it.name,
      quantity: it.quantity ?? it.stock
    }));
    try {
      await axios.post(`${API}/purchasing/receivingLogs`, {
        logID,
        poID: order.poID,
        supplierName: order.supplierID,
        dateReceived,
        items
      });
      alert('Sent to Receiving Logs');
      closeModal(); // close the view modal
    } catch (err) {
      console.error(err);
      alert('Failed to send to Receiving Logs');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Orders</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search PO# or Supplier"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value.toLowerCase())}
            className="border p-2 rounded bg-white text-gray-800 w-[400px]"
          />
          <select
            className="border p-2 rounded bg-white text-gray-800"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => openModal(null,'add')}
        >
          + Add Purchase Order
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('poID')}>PO#</th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('supplierID')}>Supplier</th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('orderDate')}>Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(o => (
            <tr key={o.poID} className="hover:bg-gray-100">
              <td className="border p-2">{o.poID}</td>
              <td className="border p-2">{getSupplierName(o.supplierID)}</td>
              <td className="border p-2">{formatDateTime(o.orderDate)}</td>
              <td className="border p-2">{o.status}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => openModal(o,'view')} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">View</button>
                <button onClick={() => openModal(o,'edit')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Edit</button>
                <button onClick={() => handleDelete(o.poID)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={page}
                  totalPages={Math.ceil(sorted.length/pageSize)}
                  onPageChange={setPage} />

      {modalType === 'add'  && <AddPurchaseOrderModal  onAdd={handleAdd} onClose={closeModal} />}
      {modalType === 'edit' && <EditPurchaseOrderModal po={selected} onSave={handleSave} onClose={closeModal} />}
      {modalType === 'view' && selected && (
        <ViewPurchaseOrderModal
          order={selected}
          onClose={closeModal}
          onSendToReceivingLogs={sendToReceivingLogs}
        />
      )}
    </div>
  );
};

export default PurchaseOrdersTable;
