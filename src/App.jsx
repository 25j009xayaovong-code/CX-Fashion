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
    <div className="min-h-screen bg-stone-50 text-stone-800 antialiased flex flex-col justify-between">
      <Header state={state} />

      <div className="flex-grow">
        {renderCurrentView()}
      </div>

      <footer className="border-t border-stone-800 bg-stone-950 py-8 text-center text-xs text-stone-500">
        <div className="container mx-auto px-6">
          <p className="font-bold tracking-wide text-stone-300">© 2026 FASHION STORE</p>
          <p className="mt-1 text-[10px]">Curated styles for your everyday.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
