let deliveryList = [];

// Simulate confirmed orders coming from Ordering module
let confirmedOrders = [
  {
    id: 1001,
    customerName: "Kent Aspa",
    items: [
      { productId: 1, quantity: 5 },
      { productId: 2, quantity: 2 }
    ],
    status: "confirmed"
  }
];

// Get all deliveries
const getAllDeliveries = (req, res) => {
  res.json(deliveryList);
};

// Create a delivery from a confirmed order
const createDelivery = (req, res) => {
  const { orderId } = req.body;

  const order = confirmedOrders.find(o => o.id === orderId && o.status === "confirmed");
  if (!order) {
    return res.status(404).json({ error: "Confirmed order not found" });
  }

  const newDelivery = {
    id: Date.now(),
    orderId: order.id,
    customerName: order.customerName,
    items: order.items,
    status: "in transit",
    dateCreated: new Date().toISOString()
  };

  deliveryList.push(newDelivery);
  res.status(201).json(newDelivery);
};

module.exports = {
  getAllDeliveries,
  createDelivery
};
