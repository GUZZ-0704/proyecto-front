import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css'
import HomePage from './pages/public/home';
import LoginPage from './pages/protected/login';
import { API_KEY } from '../config.js';
import { LoadScript } from '@react-google-maps/api';
import ListUserPage from './pages/protected/admin/users/listUser.jsx';
import FormUser from './pages/protected/admin/users/formUser.jsx';
import PasswordPage from './pages/protected/admin/users/passwordUser.jsx';
import MunicipalitiesPage from './pages/protected/moderator/municipies/municipiesPage.jsx';
import RoutesPage from './pages/protected/moderator/routes/routesPage.jsx';
import ReportsPage from './pages/protected/moderator/reports/reportsPage.jsx';
import IncidentsPage from './pages/protected/moderator/incidents/incidentsPage.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/admin/users",
    element: <ListUserPage/>,
  },
  {
    path: "/admin/users/create",
    element: <FormUser/>,
  },
  {
    path: "/admin/users/edit/:id",
    element: <FormUser/>,
  },
  {
    path: "/admin/users/:id/password",
    element: <PasswordPage/>,
  },
  {
    path: "/admin/municipies",
    element: <MunicipalitiesPage/>,
  },
  {
    path: "/admin/routes",
    element: <RoutesPage/>,
  },
  {
    path: "/admin/reports",
    element: <ReportsPage/>,
  },
  {
    path: "/admin/incidents",
    element: <IncidentsPage/>,
  }

]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadScript googleMapsApiKey={API_KEY}>
      <RouterProvider router={router} />
    </LoadScript>
  </StrictMode>,
)
