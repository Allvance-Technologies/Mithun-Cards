import React from 'react';
import Sidebar from './Sidebar';
import { Bell, UserCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Expenditure = () => {
  const navigate = useNavigate();

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
          <h1 className="page-title">Expenditure</h1>
          <div className="card">
            <div className="order-selection-row">
              <button className="action-btn" onClick={() => navigate('/expenditure/expense')}>
                <div className="action-icon pink"><ArrowDownCircle size={20} /></div>
                <span>Expense</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/expenditure/income')}>
                <div className="action-icon green"><ArrowUpCircle size={20} /></div>
                <span>Income</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Expenditure;
