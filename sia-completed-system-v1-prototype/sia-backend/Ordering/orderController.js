// File: sia-backend/Ordering/orderController.js
const axios = require('axios');

// In-memory stores (replace with database in a real app)
let clientList = [
  { clientID: "C001", name: "ABC Pharmacy", licenseNo: "FDA12345", address: "123 St, Davao City", contactPerson: "Jane Dela Cruz", contactNumber: "0917-123-4567", email: "abc@pharmacy.com" },
  { clientID: "C002", name: "XYZ Drugstore", licenseNo: "FDA67890", address: "4321 St, Davao City", contactPerson: "Mark Santos", contactNumber: "0918-456-7890", email: "xyz@drugstore.com" }
];
let quotationList = [];
let orderList = [];

const INVENTORY_API_URL = 'http://localhost:5000/api/inventory'; // Assuming backend runs on 5000

// Helper function to get product details (including ID and current stock) from Inventory by name
async function getProductFromInventoryByName(productName) {
  try {
    // Assuming your inventory API supports filtering by genericName
    // Adjust query parameter if your API uses a different field for name
    const response = await axios.get(`${INVENTORY_API_URL}?genericName=${encodeURIComponent(productName)}`);
    // If your API returns an array, find the specific product.
    // This example assumes the API returns an array and we take the first match.
    // A more robust API might return a single object or 404 if not found.
    if (response.data && response.data.length > 0) {
      const product = response.data.find(p => p.genericName === productName);
      return product || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product "${productName}" from inventory:`, error.message);
    return null;
  }
}

// Helper function to update product inventory
async function updateProductInventory(productId, inventoryUpdate) {
  try {
    const response = await axios.put(`${INVENTORY_API_URL}/${productId}`, { inventory: inventoryUpdate });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error(`Error updating inventory for product ID "${productId}":`, errorMessage);
    throw new Error(`Inventory update failed for ${productId}: ${errorMessage}`);
  }
}


// CLIENT CONTROLLERS (remain unchanged)
const getAllClients = (req, res) => res.json(clientList);
const addClient = (req, res) => {
  const existing = clientList.find(c => c.clientID === req.body.clientID);
  if (existing) return res.status(400).json({ error: "Client ID already exists" });
  clientList.push(req.body);
  res.status(201).json(req.body);
};
const updateClient = (req, res) => {
  const idx = clientList.findIndex(c => c.clientID === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Client not found" });
  clientList[idx] = { ...clientList[idx], ...req.body };
  res.json(clientList[idx]);
};
const deleteClient = (req, res) => {
  clientList = clientList.filter(c => c.clientID !== req.params.id);
  res.status(204).send();
};


// QUOTATION CONTROLLERS
const getAllQuotations = (req, res) => res.json(quotationList);

const addQuotation = async (req, res) => {
  const quotationData = req.body; // Get the data from the request body

  // Ensure the quotationID is included in the data
  if (!quotationData.quotationID) {
    return res.status(400).json({ error: "Quotation ID is required." });
  }

  if (quotationData.quotationDate) {
    const d = new Date(quotationData.quotationDate);
    quotationData.quotationDate = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } else {
    quotationData.quotationDate = new Date().toISOString();
  }

  try {
    // Add the new quotation to the in-memory list
    const newQuotation = { ...quotationData, status: "Pending" };
    quotationList.push(newQuotation);

    res.status(201).json(newQuotation); // Respond with the created quotation
  } catch (error) {
    console.error("Error adding quotation:", error);
    res.status(500).json({ error: "Failed to add quotation." });
  }
};

const updateQuotation = async (req, res) => {
  const quotationID = req.params.id;
  const updatedQuotationData = req.body;
  const originalQuotationIndex = quotationList.findIndex(q => q.quotationID === quotationID);

  if (originalQuotationIndex === -1) return res.status(404).json({ error: "Quotation not found" });

  if (updatedQuotationData.quotationDate && updatedQuotationData.quotationDate.length === 10) {
    // It's probably "YYYY-MM-DD"
    updatedQuotationData.quotationDate = new Date(updatedQuotationData.quotationDate).toISOString();
  }

  const originalQuotation = { ...quotationList[originalQuotationIndex] }; // Deep copy items if they are objects
  originalQuotation.items = JSON.parse(JSON.stringify(originalQuotation.items));


  const itemChanges = []; // To track changes for rollback and updates

  try {
    // 1. Revert old reservations
    for (const item of originalQuotation.items) {
      const product = await getProductFromInventoryByName(item.name);
      if (product) {
        const newReservedStock = product.inventory.reservedStock - item.quantity;
        await updateProductInventory(product.id, { ...product.inventory, reservedStock: Math.max(0, newReservedStock) });
        itemChanges.push({ type: 'reverted', productId: product.id, quantity: item.quantity, oldInventory: product.inventory });
      }
    }

    // 2. Apply new reservations and stock checks
    for (const item of updatedQuotationData.items) {
      const product = await getProductFromInventoryByName(item.name);
      if (!product) throw new Error(`Product ${item.name} not found.`);
      
      const currentAvailable = product.inventory.stockLevel - (product.inventory.reservedStock - (originalQuotation.items.find(oi => oi.name === item.name)?.quantity || 0) );

      if (currentAvailable < item.quantity) {
         throw new Error(`Insufficient stock for ${item.name}. Available (after considering this quotation's original reservation): ${currentAvailable}, Requested: ${item.quantity}`);
      }
      const newReservedStock = product.inventory.reservedStock + item.quantity; // This needs adjustment; it was already decremented above
                                                                                // Correct logic: find product again or use state before reversion for this item.

      // Let's refetch product to get its state after all old items were reverted.
      const productAfterReversions = await getProductFromInventoryByName(item.name); // Or use product.id if stored
      if(!productAfterReversions) throw new Error (`Critical error: Product ${item.name} disappeared during update.`);

      if ((productAfterReversions.inventory.stockLevel - productAfterReversions.inventory.reservedStock) < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name} after reverting old items. Available: ${productAfterReversions.inventory.stockLevel - productAfterReversions.inventory.reservedStock}, Requested: ${item.quantity}`);
      }

      const finalNewReservedStock = productAfterReversions.inventory.reservedStock + item.quantity;
      await updateProductInventory(productAfterReversions.id, { ...productAfterReversions.inventory, reservedStock: finalNewReservedStock });
      itemChanges.push({ type: 'applied', productId: productAfterReversions.id, quantity: item.quantity, newInventoryState: { ...productAfterReversions.inventory, reservedStock: finalNewReservedStock } });
    }

    quotationList[originalQuotationIndex] = { ...originalQuotation, ...updatedQuotationData, quotationID }; // Ensure quotationID is preserved
    res.json(quotationList[originalQuotationIndex]);

  } catch (error) {
    // Attempt to rollback changes based on itemChanges log
    // This is complex and needs careful implementation. For simplicity, we'll just log.
    console.error("Error updating quotation, rollback might be needed:", error.message, itemChanges);
    // A simple rollback: try to restore originalQuotation's item reservations
    for (const item of originalQuotation.items) {
        const product = await getProductFromInventoryByName(item.name);
        if (product) {
            try {
                const originalItemReservation = originalQuotation.items.find(i => i.name === item.name);
                if(originalItemReservation) { // Should always be true
                     // This needs to be the state *before* this whole update began.
                     // For simplicity, this rollback is not perfect without storing initial state of all products.
                     const prodToRestore = await getProductFromInventoryByName(item.name);
                     if(prodToRestore) {
                        await updateProductInventory(prodToRestore.id, { ...prodToRestore.inventory, reservedStock: prodToRestore.inventory.reservedStock - (updatedQuotationData.items.find(ui => ui.name === item.name)?.quantity || 0) + originalItemReservation.quantity });
                     }
                }
            } catch(e){ console.error("Rollback failed for item:", item.name)}
        }
    }
    res.status(400).json({ error: error.message + " Rollback attempted, please verify inventory." });
  }
};

const deleteQuotation = async (req, res) => {
  const quotationID = req.params.id;
  const quotationIndex = quotationList.findIndex(q => q.quotationID === quotationID);
  if (quotationIndex === -1) return res.status(404).json({ error: "Quotation not found" });

  const quotationToRemove = quotationList[quotationIndex];
  try {
    for (const item of quotationToRemove.items) {
      const product = await getProductFromInventoryByName(item.name);
      if (product) {
        const newReservedStock = product.inventory.reservedStock - item.quantity;
        await updateProductInventory(product.id, { ...product.inventory, reservedStock: Math.max(0, newReservedStock) });
      }
    }
    quotationList.splice(quotationIndex, 1);
    res.status(204).send();
  } catch (error) {
    // If un-reserving fails, the quotation is not deleted to avoid inconsistency
    res.status(500).json({ error: `Failed to update inventory while deleting quotation: ${error.message}. Quotation not deleted.` });
  }
};


// ORDER CONTROLLERS
const getAllOrders = (req, res) => res.json(orderList);

const getOrderById = (req, res) => {
  const ord = orderList.find(o => o.orderID === req.params.id);
  if (!ord) return res.status(404).json({ error: "Order not found" });
  res.json(ord);
};

const convertQuotationToOrder = async (req, res) => {
  const quotationID = req.params.id;
  const quotationIndex = quotationList.findIndex(q => q.quotationID === quotationID);
  if (quotationIndex === -1) return res.status(404).json({ error: "Quotation not found" });

  const quotation = quotationList[quotationIndex];
  if (quotation.status.toLowerCase() !== 'approved') {
    return res.status(400).json({ error: "Only approved quotations can be converted" });
  }
  if (orderList.some(o => o.quotationID === quotationID)) {
    return res.status(400).json({ error: "This quotation has already been converted to an order." });
  }

  const itemsToCommit = [];
  try {
    for (const item of quotation.items) {
      const product = await getProductFromInventoryByName(item.name);
      if (!product) throw new Error(`Product ${item.name} not found in inventory.`);
      
      // Ensure stock level is sufficient (it should be if reserved correctly)
      if (product.inventory.stockLevel < item.quantity) {
        throw new Error(`Insufficient actual stock for ${item.name}. Available: ${product.inventory.stockLevel}, Ordered: ${item.quantity}. This might indicate an issue with reservation prior to conversion.`);
      }

      const newStockLevel = product.inventory.stockLevel - item.quantity;
      const newReservedStock = product.inventory.reservedStock - item.quantity; // Commit reservation
      
      await updateProductInventory(product.id, { ...product.inventory, stockLevel: newStockLevel, reservedStock: Math.max(0, newReservedStock) });
      itemsToCommit.push({ productId: product.id, quantityCommitted: item.quantity, originalInventory: product.inventory });
    }

    const newOrder = {
      orderID: `ORDER-${Date.now()}`,
      orderDate: new Date().toISOString(),
      quotationID: quotation.quotationID,
      client: quotation.client,
      items: quotation.items.map(item => ({ ...item })), // Create a deep copy of items
      totalAmount: quotation.totalAmount,
      remainingBalance: quotation.totalAmount, // Or 0 if fully paid initially
      status: "Processing", // Or "Pending Payment" etc.
      deliveryStatus: "Not Sent"
    };

    quotation.status = "Converted"; // Update quotation status
    orderList.push(newOrder);
    res.status(201).json(newOrder);

  } catch (error) {
    // Rollback committed stock changes if conversion fails midway
    for (const committed of itemsToCommit) {
      try {
         // Restore original stock levels for products that were partially processed
        const productToRollback = await getProductFromInventoryByName(committed.originalInventory.genericName); // Fetch by name or ID
        if (productToRollback) {
            await updateProductInventory(committed.productId, { 
                ...productToRollback.inventory, // Current state
                stockLevel: productToRollback.inventory.stockLevel + committed.quantityCommitted, // Add back
                reservedStock: productToRollback.inventory.reservedStock + committed.quantityCommitted // Add back to reservation (or revert to original reservation count)
            });
        }
      } catch (rollbackError) {
        console.error(`Critical: Failed to rollback stock for product ID ${committed.productId} during order conversion failure:`, rollbackError.message);
      }
    }
    res.status(400).json({ error: `Failed to convert quotation: ${error.message}` });
  }
};

const updateOrder = async (req, res) => {
  const orderID = req.params.id;
  const updatedOrderData = req.body;
  const originalOrderIndex = orderList.findIndex(o => o.orderID === orderID);

  if (originalOrderIndex === -1) return res.status(404).json({ error: "Order not found" });

  const originalOrder = { ...orderList[originalOrderIndex] };
  originalOrder.items = JSON.parse(JSON.stringify(originalOrder.items)); // Deep copy

  const inventoryAdjustments = [];

  try {
    // 1. Add back stock for all items in the original order to simplify logic
    // (as if the original order items are being "returned" before new ones are "taken")
    for (const item of originalOrder.items) {
      const product = await getProductFromInventoryByName(item.name);
      if (product) {
        const newStockLevel = product.inventory.stockLevel + item.quantity;
        await updateProductInventory(product.id, { ...product.inventory, stockLevel: newStockLevel });
        inventoryAdjustments.push({ action: 'reverted', productId: product.id, quantity: item.quantity, name: item.name });
      }
    }

    // 2. Deduct stock for items in the updated order, checking availability
    for (const item of updatedOrderData.items) {
      // Fetch product again to get current stock after all reversions
      const product = await getProductFromInventoryByName(item.name);
      if (!product) throw new Error(`Product ${item.name} not found for updated order.`);
      
      if (product.inventory.stockLevel < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.inventory.stockLevel}, Requested: ${item.quantity}`);
      }
      const newStockLevel = product.inventory.stockLevel - item.quantity;
      await updateProductInventory(product.id, { ...product.inventory, stockLevel: newStockLevel });
      inventoryAdjustments.push({ action: 'deducted', productId: product.id, quantity: item.quantity, name: item.name });
    }

    // Update the order in the list
    orderList[originalOrderIndex] = { ...originalOrder, ...updatedOrderData, orderID: originalOrder.orderID };
    res.json(orderList[originalOrderIndex]);

  } catch (error) {
    // Attempt to rollback inventory changes based on `inventoryAdjustments` log
    // This is crucial for consistency. If an error occurs after some items are processed.
    console.error("Error updating order. Attempting rollback of inventory adjustments:", error.message);
    // For simplicity, this example doesn't implement a perfect multi-step transaction rollback.
    // A robust system would need a transaction manager or a saga pattern for microservices.
    // A basic rollback attempt:
    for (const adj of inventoryAdjustments.reverse()) { // Reverse order of adjustments
        try {
            const product = await getProductFromInventoryByName(adj.name);
            if (product) {
                if (adj.action === 'deducted') { // Was deducted, so add it back
                    await updateProductInventory(adj.productId, { ...product.inventory, stockLevel: product.inventory.stockLevel + adj.quantity });
                } else if (adj.action === 'reverted') { // Was added back, so deduct it again
                    await updateProductInventory(adj.productId, { ...product.inventory, stockLevel: product.inventory.stockLevel - adj.quantity });
                }
            }
        } catch (rollbackError) {
            console.error(`CRITICAL: Failed to rollback inventory for product ${adj.name} (ID: ${adj.productId}):`, rollbackError.message);
        }
    }
    res.status(400).json({ error: error.message + " Inventory rollback attempted, but please verify consistency." });
  }
};

const deleteOrder = async (req, res) => {
  const orderID = req.params.id;
  const orderIndex = orderList.findIndex(o => o.orderID === orderID);
  if (orderIndex === -1) return res.status(404).json({ error: "Order not found" });

  const orderToRemove = orderList[orderIndex];
  try {
    for (const item of orderToRemove.items) {
      const product = await getProductFromInventoryByName(item.name);
      if (product) {
        const newStockLevel = product.inventory.stockLevel + item.quantity; // Add back to stock
        await updateProductInventory(product.id, { ...product.inventory, stockLevel: newStockLevel });
      }
    }
    orderList.splice(orderIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Failed to update inventory while deleting order: ${error.message}. Order not deleted.` });
  }
};

// Mark order as delivered (remains unchanged as it doesn't affect stock directly)
const markOrderAsDelivered = (req, res) => {
  const { id } = req.params;
  const order = orderList.find(o => o.orderID === id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (order.deliveryStatus === 'Sent') {
    return res.status(400).json({ error: "Order already marked as delivered" });
  }

  order.deliveryStatus = 'Sent';
  res.json({ message: 'Delivery status updated', order });
};


// If you want a direct "Add Order" function:
const addOrder = async (req, res) => {
  const { client, items, totalAmount /* other fields */ } = req.body;

  if (!client || !items || !items.length) {
    return res.status(400).json({ message: 'Client and items are required.' });
  }

  const processedItemsInfo = []; // To store info for potential rollback

  try {
    const orderItems = [];
    for (const item of items) {
      const product = await getProductFromInventoryByName(item.name);
      if (!product) {
        throw new Error(`Product ${item.name} not found.`);
      }
      if (product.inventory.stockLevel < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.inventory.stockLevel}, Requested: ${item.quantity}`);
      }

      const newStockLevel = product.inventory.stockLevel - item.quantity;
      // Assuming no reservation step for direct orders, or handle it if needed
      await updateProductInventory(product.id, { ...product.inventory, stockLevel: newStockLevel });
      
      processedItemsInfo.push({ productId: product.id, quantityDeducted: item.quantity, name: item.name });
      orderItems.push({
        name: product.genericName, // or item.name
        quantity: item.quantity,
        unitPrice: product.price, // or item.unitPrice if provided and different
        // any other item details
      });
    }

    const newOrder = {
      orderID: `ORDER-${Date.now()}`,
      orderDate: new Date().toISOString(),
      client, // Assuming client is an object with client details
      items: orderItems,
      totalAmount: totalAmount, // Or calculate based on orderItems
      remainingBalance: totalAmount,
      status: "Processing", // Or "Pending"
      deliveryStatus: "Not Sent"
    };

    orderList.push(newOrder);
    res.status(201).json(newOrder);

  } catch (error) {
    // Rollback stock deductions
    for (const processedItem of processedItemsInfo) {
      try {
        const productToRollback = await getProductFromInventoryByName(processedItem.name);
        if (productToRollback) {
          await updateProductInventory(processedItem.productId, { ...productToRollback.inventory, stockLevel: productToRollback.inventory.stockLevel + processedItem.quantityDeducted });
        }
      } catch (rollbackError) {
        console.error(`CRITICAL: Failed to rollback stock for ${processedItem.name} (ID: ${processedItem.productId}):`, rollbackError.message);
      }
    }
    res.status(400).json({ error: `Failed to create order: ${error.message}` });
  }
};


module.exports = {
  getAllClients, addClient, updateClient, deleteClient,
  getAllQuotations, addQuotation, updateQuotation, deleteQuotation,
  getAllOrders, getOrderById, convertQuotationToOrder, updateOrder, deleteOrder, addOrder, // Added addOrder
  markOrderAsDelivered,
  orderList, // Still exporting for other modules if they directly access, though not recommended.
  clientList,
};