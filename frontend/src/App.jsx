import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardMobile from './pages/DashboardMobile';
import NovoPedidoPage from './pages/NovoPedidoPage';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardMobile />} />
            <Route path="/novo" element={<NovoPedidoPage />} />
            <Route path="/perfil" element={<div className="p-4 text-center text-slate-400">Perfil (Em Breve)</div>} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
