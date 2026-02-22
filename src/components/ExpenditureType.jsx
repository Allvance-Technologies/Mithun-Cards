import React from 'react';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import { Bell, UserCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const names = {
  expense: 'Expense',
  income: 'Income'
};

const ExpenditureType = () => {
  const { type } = useParams();
  const title = names[type] || 'Expenditure';
  const { orders, expenses, settings } = useData();
  const totalIncome = orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
  const totalExpense = (expenses || []).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-bar">
          <div className="spacer"></div>
          <div className="top-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><UserCircle size={24} /></button>
          </div>
        </header>
        <div className="dashboard-content">
          <h1 className="page-title">{title}</h1>
          <div className="card">
            {type === 'income' ? (
              <>
                <div style={{ marginBottom: '16px', fontWeight: 600 }}>Total Income: {settings.currency === 'USD' ? '$' : settings.currency} {totalIncome.toFixed(2)}</div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="font-medium">{o.id}</td>
                        <td>{o.date}</td>
                        <td>{o.customer}</td>
                        <td>{settings.currency === 'INR' ? '₹' : settings.currency === 'USD' ? '$' : settings.currency} {parseFloat(o.amount || 0).toFixed(2)}</td>
                        <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '16px', fontWeight: 600 }}>Total Expense: {settings.currency === 'INR' ? '₹' : settings.currency === 'USD' ? '$' : settings.currency} {totalExpense.toFixed(2)}</div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(expenses || []).map((e, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{e.type}</td>
                        <td>{e.date}</td>
                        <td>{e.description}</td>
                        <td>{settings.currency === 'INR' ? '₹' : settings.currency === 'USD' ? '$' : settings.currency} {parseFloat(e.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpenditureType;
