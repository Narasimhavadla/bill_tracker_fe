// Components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, permission }) => {
  const { user } = useAuth();

  // Check if the user has the specific permission required for this page
  if (!user.permissions[permission]) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;