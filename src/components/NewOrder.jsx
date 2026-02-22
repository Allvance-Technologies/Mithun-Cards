import Sidebar from './Sidebar';
import { FileText, Book, IdCard, Image, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="dashboard-content">
          <div className="page-header-actions">
            <h1 className="page-title">New Order</h1>
          </div>
          <div className="card">
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
      </main>
    </div>
  );
};

export default NewOrder;
