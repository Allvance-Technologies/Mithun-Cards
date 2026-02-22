import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';
import { useData } from '../context/DataContext';
import {
    Search,
    Bell,
    UserCircle,
    Filter,
    ArrowUpDown,
    Download,
    X,
    Trash2
} from 'lucide-react';

const Customers = () => {
    const { customers, orders, settings, deleteCustomer } = useData();
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomerIds(filteredCustomers.map(c => c.id));
        } else {
            setSelectedCustomerIds([]);
        }
    };

    const handleSelectCustomer = (e, id) => {
        e.stopPropagation(); // Don't open the modal
        setSelectedCustomerIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCustomerIds.length} customers?`)) {
            try {
                for (const id of selectedCustomerIds) {
                    await deleteCustomer(id);
                }
                setSelectedCustomerIds([]);
            } catch (err) {
                alert("Failed to delete some customers.");
            }
        }
    };

    const handleDeleteSingle = async (e, id) => {
        e.stopPropagation(); // Don't open the modal
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(id);
                setSelectedCustomerIds(prev => prev.filter(item => item !== id));
            } catch (err) {
                alert("Failed to delete customer.");
            }
        }
    };

    const handleExportExcel = () => {
        const data = customers.map(c => ({
            'Customer Name': c.name,
            'Email Address': c.email,
            'Phone Number': c.phone,
            'Total Orders': c.orders,
            'Status': c.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

        // Generate buffer and trigger download
        XLSX.writeFile(workbook, "Customer_List.xlsx");
    };

    const filteredCustomers = (customers || [])
        .filter(c => filterStatus === 'all' || (c.status || '').toLowerCase() === filterStatus)
        .filter(c => (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'orders') return b.orders - a.orders;
            return 0;
        });

    return (
        <div className="dashboard-container">
            <Sidebar />

            <main className="main-content">
                {/* Top Bar - Reused structure */}
                <header className="top-bar">
                    <div className="search-container">
                        <div className="search-bar-enhanced">
                            <Search className="search-icon-enhanced" size={20} />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="search-input-enhanced"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
                            )}
                        </div>
                    </div>
                    <div className="top-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                        </button>
                        <button className="icon-btn">
                            <UserCircle size={24} />
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="page-header">
                        <h1 className="page-title">Customers</h1>
                        <div className="header-actions">
                            {selectedCustomerIds.length > 0 && (
                                <button className="btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444' }} onClick={handleDeleteSelected}>
                                    <Trash2 size={18} />
                                    <span style={{ marginLeft: 8 }}>Delete ({selectedCustomerIds.length})</span>
                                </button>
                            )}
                            <div style={{ position: 'relative' }}>
                                <button className="icon-btn-outline" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                                    <Filter size={18} />
                                </button>
                                {showFilterMenu && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => { setFilterStatus('all'); setShowFilterMenu(false); }}>All</button>
                                        <button onClick={() => { setFilterStatus('active'); setShowFilterMenu(false); }}>Active</button>
                                        <button onClick={() => { setFilterStatus('new'); setShowFilterMenu(false); }}>New</button>
                                    </div>
                                )}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <button className="icon-btn-outline" onClick={() => setShowSortMenu(!showSortMenu)}>
                                    <ArrowUpDown size={18} />
                                </button>
                                {showSortMenu && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => { setSortBy('name'); setShowSortMenu(false); }}>Name</button>
                                        <button onClick={() => { setSortBy('orders'); setShowSortMenu(false); }}>Orders</button>
                                    </div>
                                )}
                            </div>
                            <button className="icon-btn-outline" onClick={handleExportExcel} title="Export to Excel">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>



                    {
                        <div className="card table-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={filteredCustomers.length > 0 && selectedCustomerIds.length === filteredCustomers.length}
                                            />
                                        </th>
                                        <th>Customer Name</th>
                                        <th>Contact Info</th>
                                        <th>Total Orders</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} style={{ cursor: 'pointer' }} className={selectedCustomerIds.includes(customer.id) ? 'selected-row' : ''}>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCustomerIds.includes(customer.id)}
                                                    onChange={(e) => handleSelectCustomer(e, customer.id)}
                                                />
                                            </td>
                                            <td className="font-medium">{customer.name}</td>
                                            <td className="text-secondary">
                                                <div>{customer.email}</div>
                                                <div style={{ fontSize: '12px' }}>{customer.phone}</div>
                                            </td>
                                            <td>{customer.orders}</td>
                                            <td>
                                                <span className={`status-badge ${(customer.status || '').toLowerCase()}`}>
                                                    {customer.status || 'Active'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    className="btn-outline"
                                                    style={{ padding: '6px', borderColor: '#EF4444', color: '#EF4444' }}
                                                    onClick={(e) => handleDeleteSingle(e, customer.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }

                    {selectedCustomer && (
                        <div className="modal-overlay" style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}>
                            <div className="modal-content" style={{
                                backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '720px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Customer Details</h3>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button
                                            onClick={(e) => {
                                                handleDeleteSingle(e, selectedCustomer.id);
                                                setSelectedCustomer(null);
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                        <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <div className="font-medium" style={{ marginBottom: '8px' }}>{selectedCustomer.name}</div>
                                        <div style={{ color: '#6B7280' }}>{selectedCustomer.email}</div>
                                        <div style={{ color: '#6B7280' }}>{selectedCustomer.phone}</div>
                                        <div style={{ marginTop: '8px' }}>
                                            <span className={`status-badge ${(selectedCustomer.status || '').toLowerCase()}`}>{selectedCustomer.status || 'Active'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ marginBottom: '8px' }}>Total Orders: {selectedCustomer.orders}</div>
                                    </div>
                                </div>
                                <div className="divider" style={{ marginTop: '16px' }}></div>
                                <div className="card-header">
                                    <h3>Order History</h3>
                                </div>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.filter(o => o.customer === selectedCustomer.name).map(order => (
                                            <tr key={order.id}>
                                                <td className="font-medium">{order.id}</td>
                                                <td>{order.date}</td>
                                                <td>{settings.currency === 'INR' ? '₹' : settings.currency === 'USD' ? '$' : settings.currency} {parseFloat(order.amount).toFixed(2)}</td>
                                                <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>


            </main>
        </div>
    );
};

export default Customers;
