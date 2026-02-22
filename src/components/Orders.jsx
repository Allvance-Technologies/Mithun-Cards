import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FileText, Book, IdCard, Image, Receipt, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Orders = () => {
  const navigate = useNavigate();
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const { orders, settings, deleteOrder } = useData();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrderIds(orders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (id) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedOrderIds.length} orders?`)) {
      try {
        for (const id of selectedOrderIds) {
          await deleteOrder(id);
        }
        setSelectedOrderIds([]);
      } catch (err) {
        alert("Failed to delete some orders.");
      }
    }
  };

  const handleDeleteSingle = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        setSelectedOrderIds(prev => prev.filter(item => item !== id));
      } catch (err) {
        alert("Failed to delete order.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">

        <div className="dashboard-content">
          <div className="page-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-title">Orders</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              {selectedOrderIds.length > 0 && (
                <button className="btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444' }} onClick={handleDeleteSelected}>
                  <Trash2 size={18} />
                  <span style={{ marginLeft: 8 }}>Delete ({selectedOrderIds.length})</span>
                </button>
              )}
              <button className="btn-primary" onClick={() => setShowNewOrderModal(true)}>
                <Plus size={18} />
                <span style={{ marginLeft: 8 }}>New Order</span>
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: '16px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>All Orders</h3>
              <span style={{ color: '#6B7280' }}>Showing Pending, Delivered, Cancelled</span>
            </div>
            <table className="orders-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                    />
                  </th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).length > 0 ? (
                  orders.map(order => (
                    <tr key={order.id} className={selectedOrderIds.includes(order.id) ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                        />
                      </td>
                      <td>#{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.customer}</td>
                      <td>{settings.currency === 'INR' ? '₹' : settings.currency === 'USD' ? '$' : settings.currency} {parseFloat(order.amount || 0).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${String(order.status || '').toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            className="btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => navigate(`/orders/edit/new-bill/${order.id}`)}
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn-outline"
                            style={{ padding: '6px', borderColor: '#EF4444', color: '#EF4444' }}
                            onClick={() => handleDeleteSingle(order.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showNewOrderModal && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Select New Order Type</h3>
                  <button className="icon-btn" onClick={() => setShowNewOrderModal(false)}>×</button>
                </div>
                <div className="actions-grid">
                  <button className="action-btn" onClick={() => navigate('/orders/new/invitation-cards')}>
                    <div className="action-icon blue"><FileText size={20} /></div>
                    <span>Invitation Cards</span>
                  </button>
                  <button className="action-btn" onClick={() => navigate('/orders/new/bill-books')}>
                    <div className="action-icon indigo"><Book size={20} /></div>
                    <span>Bill Books</span>
                  </button>
                  <button className="action-btn" onClick={() => navigate('/orders/new/visiting-cards')}>
                    <div className="action-icon purple"><IdCard size={20} /></div>
                    <span>Visiting Cards</span>
                  </button>
                  <button className="action-btn" onClick={() => navigate('/orders/new/posters')}>
                    <div className="action-icon pink"><Image size={20} /></div>
                    <span>Posters</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
