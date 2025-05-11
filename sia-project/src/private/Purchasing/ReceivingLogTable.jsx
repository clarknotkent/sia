import { useState, useEffect } from 'react';
import axios from 'axios';
import ViewReceivingLogModal from './Modals/ViewReceivingLogModal';
import AddReceivingLogModal from './Modals/AddReceivingLogModal';
import EditReceivingLogModal from './Modals/EditReceivingLogModal';
import Pagination from '../../components/Pagination';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ReceivingLogTable = () => {
  const [logs, setLogs]           = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortCol, setSortCol]     = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const pageSize = 5;

  useEffect(() => {
    axios.get(`${API}/purchasing/receivingLogs`)
      .then(r => setLogs(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`${API}/purchasing/suppliers`).then(r => setSuppliers(r.data));
  }, []);

  const supplierMap = Object.fromEntries(suppliers.map(s => [s.supplierID, s.name]));

  const filtered = logs.filter(l =>
    (l.logID.toLowerCase().includes(searchTerm) ||
     l.poID.toLowerCase().includes(searchTerm) ||
     (supplierMap[l.supplierID] || l.supplierName || '').toLowerCase().includes(searchTerm))
  );

  const sorted = [...filtered].sort((a,b) => {
    if (!sortCol) return 0;
    const va = a[sortCol], vb = b[sortCol];
    if (va < vb) return sortOrder==='asc'?-1:1;
    if (va > vb) return sortOrder==='asc'?1:-1;
    return 0;
  });

  const pageData = sorted.slice((page-1)*pageSize, page*pageSize);

  const open = log => {
    setSelected({
      ...log,
      supplierName: supplierMap[log.supplierID] || log.supplierName || log.supplierID
    });
    setIsModalOpen(true);
    setModalType('view');
  };

  const openModal = (log, type) => {
    setSelected(log
      ? { ...log, supplierName: supplierMap[log.supplierID] || log.supplierName || log.supplierID }
      : null
    );
    setIsModalOpen(true);
    setModalType(type);
  };

  const close = () => { setSelected(null); setIsModalOpen(false); setModalType(null); };

  const handleAdd = async newLog => {
    const formData = { ...newLog };
    await axios.post(`${API}/purchasing/receivingLogs`, formData);
    setLogs(prevLogs => [...prevLogs, newLog]);
    close();
  };

  const sendToInventory = async log => {
    await axios.post(`${API}/purchasing/receivingLogs/${log.logID}/send-to-inventory`);
    setLogs(prev => prev.filter(l => l.logID !== log.logID));
  };

  const toggleSort = col => {
    if (!['logID','poID','supplier','dateReceived', 'supplierName'].includes(col)) return;
    if (sortCol === col) setSortOrder(o=>o==='asc'?'desc':'asc');
    else { setSortCol(col); setSortOrder('asc'); }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Receiving Logs</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search Log#, PO#, or Supplier"
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
            <option>Complete</option>
            <option>Partial</option>
            <option>Pending</option>
          </select>
        </div>
        <button
          onClick={() => openModal(null, 'add')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add to Receiving Logs
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-gray-800 text-sm text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('logID')}>Log#</th>
            <th className="w-2/12 border p-2 text-center">PO#</th>
            <th className="w-3/12 border p-2 text-center">Supplier</th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort('dateReceived')}>Received</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(l => (
            <tr key={l.logID} className="hover:bg-gray-100">
              <td className="border p-2">{l.logID}</td>
              <td className="border p-2">{l.poID}</td>
              <td className="border p-2">
                {supplierMap[l.supplierID] || l.supplierName || l.supplierID}
              </td>
              <td className="border p-2">{l.dateReceived}</td>
              <td className="border p-2">{l.status}</td>
              <td className="border p-2 space-x-1">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => open(l)}
                >
                  View
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => openModal(l, 'edit')}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={async () => {
                    if (window.confirm('Delete this receiving log?')) {
                      await axios.delete(`${API}/purchasing/receivingLogs/${l.logID}`);
                      setLogs(prev => prev.filter(log => log.logID !== l.logID));
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={page}
                  totalPages={Math.ceil(sorted.length/pageSize)}
                  onPageChange={setPage} />

      {isModalOpen && modalType === 'view' && selected && (
        <ViewReceivingLogModal
          log={selected}
          onClose={close}
          onSendToInventory={sendToInventory}
        />
      )}

      {isModalOpen && modalType === 'add' && (
        <AddReceivingLogModal onAdd={handleAdd} onClose={close} />
      )}

      {isModalOpen && modalType === 'edit' && selected && (
        <EditReceivingLogModal
          log={selected}
          onSave={async updatedLog => {
            await axios.put(`${API}/purchasing/receivingLogs/${updatedLog.logID}`, updatedLog);
            setLogs(prev =>
              prev.map(l => l.logID === updatedLog.logID ? updatedLog : l)
            );
            close();
          }}
          onClose={close}
        />
      )}
    </div>
  );
};

export default ReceivingLogTable;
