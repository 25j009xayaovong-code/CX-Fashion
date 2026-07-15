import React from 'react';
import { useAppState } from './hooks/useAppState';
import Header from './components/Header';
import CustomerView from './components/CustomerView';
import SellerView from './components/SellerView';
import SettingsView from './components/SettingsView';

function App() {
  const state = useAppState();
  // The role flag is set only after the administrator credentials are verified.
  // A matching username alone must never grant access to the dashboard.
  const isAdminUser = state.currentUser?.isAdmin === true;

  const renderCurrentView = () => {
    if (isAdminUser) {
      return <SellerView state={state} />;
    }

    switch (state.viewMode) {
      case 'settings':
        return <SettingsView state={state} />;
      case 'seller':
        return <SellerView state={state} />;
      case 'customer':
      default:
        return <CustomerView state={state} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans antialiased flex flex-col justify-between">
      <Header state={state} />

      <div className="flex-grow">
        {renderCurrentView()}
      </div>

      <footer className="bg-gray-900 text-gray-500 text-xs py-8 border-t border-gray-800 text-center">
        <div className="container mx-auto px-6">
          <p className="font-bold text-gray-400">© 2026 FASHION STORE. All Rights Reserved.</p>
          <p className="mt-1 text-[10px]">ระบบจำลองแดชบอร์ดหน้าร้านค้าและจัดการหลังบ้านด้วย React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
