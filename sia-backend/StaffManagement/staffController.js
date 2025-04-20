let staffList = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    role: "Admin",
    email: "juan@example.com",
    contact: "09123456789",
    status: "Active"
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Cashier",
    email: "maria@example.com",
    contact: "09987654321",
    status: "Suspended"
  },
  {
    id: 3,
    name: "Juan Santos",
    role: "Delivery",
    email: "Juan@example.com",
    contact: "09123456789",
    status: "Suspended"
  }
];

// Get all staff
const getAllStaff = (req, res) => {
  res.json(staffList);
};

// Add new staff
const addStaff = (req, res) => {
  const maxId = staffList.length > 0 ? Math.max(...staffList.map(s => s.id)) : 0;
  const newStaff = { id: maxId + 1, ...req.body };
  staffList.push(newStaff);
  res.status(201).json(newStaff);
};

// Update staff
const updateStaff = (req, res) => {
  const id = parseInt(req.params.id);
  const index = staffList.findIndex(s => s.id === id);
  if (index !== -1) {
    staffList[index] = { ...staffList[index], ...req.body };
    res.json(staffList[index]);
  } else {
    res.status(404).json({ error: "Staff not found" });
  }
};

// Delete staff
const deleteStaff = (req, res) => {
  const id = parseInt(req.params.id);
  staffList = staffList.filter(s => s.id !== id);
  res.status(204).send();
};

module.exports = {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff
};
