import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Dashboard from './pages/admin/Dashboard';
import Trucks from './pages/admin/Trucks';
import Trailers from './pages/admin/Trailers';
import Trips from './pages/admin/Trips';
import Maintenance from './pages/admin/Maintenance';
import Reports from './pages/admin/Reports';

import MyTrips from './pages/driver/MyTrips';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="trucks" element={<Trucks />} />
                  <Route path="trailers" element={<Trailers />} />
                  <Route path="trips" element={<Trips />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="reports" element={<Reports />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/driver/*" element={
            <ProtectedRoute allowedRoles={['chauffeur']}>
              <Layout>
                <Routes>
                  <Route path="trips" element={<MyTrips />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;