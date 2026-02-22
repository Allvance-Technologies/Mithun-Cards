import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useData } from '../context/DataContext';
import {
    Building,
    Receipt,
    Database,
    Shield,
    Palette,
    Info,
    Save,
    Upload,
    Download,
    RefreshCw,
    Lock,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings, resetData, inventory, customers, orders } = useData();
    const [activeTab, setActiveTab] = useState('company');
    const [logoPreview, setLogoPreview] = useState(null);
    const [theme, setTheme] = useState('system');
    const [fontSize, setFontSize] = useState('medium');

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Export all data as JSON
    const handleExportData = () => {
        const data = {
            inventory,
            customers,
            orders,
            settings,
            exportDate: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pos-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Import data from JSON
    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        // Here you would restore the data
                        // For now, just show an alert
                        if (window.confirm('This will replace all current data. Continue?')) {
                            localStorage.setItem('inventory', JSON.stringify(data.inventory || []));
                            localStorage.setItem('customers', JSON.stringify(data.customers || []));
                            localStorage.setItem('orders', JSON.stringify(data.orders || []));
                            localStorage.setItem('settings', JSON.stringify(data.settings || {}));
                            alert('Data imported successfully! Please refresh the page.');
                            window.location.reload();
                        }
                    } catch {
                        alert('Invalid JSON file. Please select a valid backup file.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    // Reset all data
    const handleResetData = () => {
        if (window.confirm('This will reset all data to defaults. This action cannot be undone. Continue?')) {
            resetData();
            alert('Data has been reset successfully!');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>Company / Business Settings</h2>
                            <p>Manage your business details and branding.</p>
                        </div>
                        <div className="card settings-card">
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Company Name</label>
                                    <input type="text" className="form-input" placeholder="e.g. Mithun Cards" defaultValue={settings.companyName} />
                                </div>
                                <div className="form-group half">
                                    <label>GST Number</label>
                                    <input type="text" className="form-input" placeholder="e.g. 22AAAAA0000A1Z5" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Business Address</label>
                                <textarea className="form-input" rows="3" placeholder="Enter full business address"></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Phone Number</label>
                                    <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="form-group half">
                                    <label>Email Address</label>
                                    <input type="email" className="form-input" placeholder="contact@business.com" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Currency</label>
                                    <select className="form-input">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>Invoice Prefix</label>
                                    <input type="text" className="form-input" placeholder="e.g. INV-" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Company Logo</label>
                                <div className="logo-upload-container">
                                    {logoPreview ? (
                                        <div className="logo-preview">
                                            <img src={logoPreview} alt="Logo Preview" />
                                            <button className="btn-secondary small" onClick={() => setLogoPreview(null)}>Remove</button>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <div className="upload-icon">
                                                <Upload size={24} />
                                            </div>
                                            <span>Click to upload logo</span>
                                            <input type="file" accept="image/*" onChange={handleLogoChange} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="section-actions">
                            <button className="btn-primary" onClick={() => updateSettings({ companyName: 'Mithun Cards' })}>
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                );
            case 'tax':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>Tax & Billing Settings</h2>
                            <p>Configure tax rates and invoice details.</p>
                        </div>
                        <div className="card settings-card">
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Default Tax (%)</label>
                                    <input type="number" className="form-input" placeholder="0.00" />
                                </div>
                                <div className="form-group half">
                                    <label>Tax Mode</label>
                                    <select className="form-input">
                                        <option value="exclusive">Exclusive (Added to price)</option>
                                        <option value="inclusive">Inclusive (Included in price)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Discount Mode</label>
                                <select className="form-input">
                                    <option value="item">Item-level Discount</option>
                                    <option value="invoice">Invoice-level Discount</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Terms & Conditions</label>
                                <textarea className="form-input" rows="4" placeholder="Enter terms and conditions..."></textarea>
                            </div>
                            <div className="form-group">
                                <label>Footer Note</label>
                                <input type="text" className="form-input" placeholder="e.g. Thank you for your business!" />
                            </div>
                            <div className="toggle-group">
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                                <span className="toggle-label">Show signature on invoice</span>
                            </div>
                        </div>
                        <div className="section-actions">
                            <button className="btn-primary">
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                );
            case 'backup':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>Backup & Data Management</h2>
                            <p>Export, import, and manage your application data.</p>
                        </div>
                        <div className="card settings-card">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Export Data</h4>
                                    <p>Download a JSON file containing all your data.</p>
                                </div>
                                <button className="btn-secondary" onClick={handleExportData}>
                                    <Download size={18} />
                                    <span>Export JSON</span>
                                </button>
                            </div>
                            <div className="divider"></div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Import Data</h4>
                                    <p>Restore data from a previously exported JSON file.</p>
                                </div>
                                <button className="btn-secondary" onClick={handleImportData}>
                                    <Upload size={18} />
                                    <span>Import JSON</span>
                                </button>
                            </div>
                            <div className="divider"></div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Export CSV</h4>
                                    <p>Download data as CSV files for external use.</p>
                                </div>
                                <div className="btn-group">
                                    <button className="btn-outline small">Products</button>
                                    <button className="btn-outline small">Customers</button>
                                    <button className="btn-outline small">Invoices</button>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Local Backup</h4>
                                    <p>Save current state to browser local storage.</p>
                                </div>
                                <div className="btn-group">
                                    <button className="btn-secondary small">Backup Now</button>
                                    <button className="btn-outline small">Restore</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>Security & Privacy</h2>
                            <p>Protect your application and data.</p>
                        </div>
                        <div className="card settings-card">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>App Lock</h4>
                                    <p>Require a PIN to access the application.</p>
                                </div>
                                <div className="toggle-group">
                                    <label className="toggle-switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Change PIN</h4>
                                    <p>Update your security PIN.</p>
                                </div>
                                <button className="btn-outline small">Change PIN</button>
                            </div>
                            <div className="divider"></div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Encrypt Backups</h4>
                                    <p>Encrypt exported data files with a password.</p>
                                </div>
                                <div className="toggle-group">
                                    <label className="toggle-switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'ui':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>UI & Appearance</h2>
                            <p>Customize the look and feel of the application.</p>
                        </div>
                        <div className="card settings-card">
                            <div className="form-group">
                                <label>Theme Mode</label>
                                <div className="theme-selector">
                                    <div
                                        className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun size={24} />
                                        <span>Light</span>
                                    </div>
                                    <div
                                        className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon size={24} />
                                        <span>Dark</span>
                                    </div>
                                    <div
                                        className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                                        onClick={() => setTheme('system')}
                                    >
                                        <Monitor size={24} />
                                        <span>System</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Font Size</label>
                                <div className="range-slider-container">
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="1"
                                        className="range-slider"
                                        value={fontSize === 'small' ? 1 : fontSize === 'medium' ? 2 : 3}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setFontSize(val === 1 ? 'small' : val === 2 ? 'medium' : 'large');
                                        }}
                                    />
                                    <div className="range-labels">
                                        <span>Small</span>
                                        <span>Medium</span>
                                        <span>Large</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Language</label>
                                <select className="form-input">
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'about':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>About & Support</h2>
                            <p>Information about the application and support.</p>
                        </div>
                        <div className="card settings-card">
                            <div className="about-info">
                                <div className="app-logo-large">
                                    <Monitor size={48} />
                                </div>
                                <h3>Mithun Cards</h3>
                                <p className="version">Version 1.0.0</p>
                                <p className="developer">Developed by AntiGravity</p>
                            </div>
                            <div className="divider"></div>
                            <div className="links-group">
                                <a href="#" className="link-item">Privacy Policy</a>
                                <a href="#" className="link-item">Terms & Conditions</a>
                                <a href="#" className="link-item">Contact Support</a>
                            </div>
                            <div className="divider"></div>
                            <div className="danger-zone">
                                <h4>Danger Zone</h4>
                                <button className="btn-danger" onClick={handleResetData}>
                                    <RefreshCw size={18} />
                                    <span>Reset App Data</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <main className="main-content">

                <div className="dashboard-content">
                    <h1 className="page-title">Settings</h1>

                    <div className="settings-container">
                        {/* Settings Sidebar */}
                        <div className="settings-sidebar">
                            <button
                                className={`settings-nav-item ${activeTab === 'company' ? 'active' : ''}`}
                                onClick={() => setActiveTab('company')}
                            >
                                <Building size={18} />
                                <span>Company</span>
                            </button>
                            <button
                                className={`settings-nav-item ${activeTab === 'tax' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tax')}
                            >
                                <Receipt size={18} />
                                <span>Tax & Billing</span>
                            </button>
                            <button
                                className={`settings-nav-item ${activeTab === 'backup' ? 'active' : ''}`}
                                onClick={() => setActiveTab('backup')}
                            >
                                <Database size={18} />
                                <span>Backup</span>
                            </button>
                            <button
                                className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <Shield size={18} />
                                <span>Security</span>
                            </button>
                            <button
                                className={`settings-nav-item ${activeTab === 'ui' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ui')}
                            >
                                <Palette size={18} />
                                <span>Appearance</span>
                            </button>
                            <button
                                className={`settings-nav-item ${activeTab === 'about' ? 'active' : ''}`}
                                onClick={() => setActiveTab('about')}
                            >
                                <Info size={18} />
                                <span>About</span>
                            </button>
                        </div>

                        {/* Settings Content */}
                        <div className="settings-content-area">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
