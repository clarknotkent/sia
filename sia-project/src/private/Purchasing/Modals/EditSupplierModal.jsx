import React, { useState } from 'react';

const EditSupplierModal = ({ supplier, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...supplier });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AddSupplierModal
            onAdd={onSave}
            onClose={onClose}
            initialData={formData}
        />
    );
};

export default EditSupplierModal;
