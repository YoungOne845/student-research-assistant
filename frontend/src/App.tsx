import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ModulesPage } from './pages/ModulesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App(){ return <AuthProvider><Routes>
  <Route path="/" element={<Navigate to="/dashboard"/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
    <Route path="/dashboard" element={<DashboardPage/>}/>
    <Route path="/modules" element={<ModulesPage/>}/>
    <Route path="/projects" element={<ProjectsPage/>}/>
    <Route path="/profile" element={<ProfilePage/>}/>
  </Route>
</Routes></AuthProvider> }
