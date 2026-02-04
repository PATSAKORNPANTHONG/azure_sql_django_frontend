import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, Loader2, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { customerService } from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await customerService.getAll();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCustomer) {
                await customerService.update(editingCustomer.id, formData);
            } else {
                await customerService.create(formData);
            }
            setIsModalOpen(false);
            fetchCustomers();
            resetForm();
        } catch (error) {
            console.error('Failed to save customer', error);
            alert('Failed to save customer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerService.delete(id);
                fetchCustomers();
            } catch (error) {
                console.error('Failed to delete customer', error);
            }
        }
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingCustomer(null);
        setFormData({ name: '', email: '', phone: '' });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Customers</h1>
                    <p className="text-slate-400 mt-1">Manage your customer base</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Customer
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <Card key={customer.id} className="group hover:-translate-y-1 transition-transform duration-300">
                        <CardContent className="p-0">
                            <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden group-hover:from-slate-800 group-hover:to-slate-700 transition-colors">
                                <div className="absolute top-0 right-0 p-3 flex gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                                    <button onClick={() => openEditModal(customer)} className="p-2 bg-white/10 hover:bg-primary/80 text-white rounded-full backdrop-blur-sm transition-colors" title="Edit">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(customer.id)} className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <h3 className="font-semibold text-white text-lg text-center">{customer.name}</h3>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-primary/70" />
                                        <span className="truncate">{customer.email || 'No email'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-primary/70" />
                                        <span>{customer.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar size={16} className="text-primary/70" />
                                        <span>Joined: {new Date(customer.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {customers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                        No customers found. Add your first customer!
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        required
                        autoFocus
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 234 567 890"
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={submitting}>
                            {editingCustomer ? 'Update Customer' : 'Create Customer'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
