import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faSignInAlt, 
  faEye, 
  faEyeSlash 
} from '@fortawesome/free-solid-svg-icons';
import Logo from "../assets/MediSys_LOGO.jpg";

const PharmaLogin = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_BASE_URL;
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Changed to POST for secure JWT authentication
      const response = await axios.post(`${api}/auth/login`, {
        username: formData.username,
        password: formData.password
      });

      // 2. Expecting { token: "...", user: { role: "...", username: "..." } }
      const { token, user } = response.data;

      if (token) {
        // 3. Store the JWT token and user info
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.username);

        // 4. Role-based navigation
        if (user.role === 'admin') {
          navigate('/internal-dashboard');
        } else if (user.role === 'vendor') {
          navigate('/external-dashboard');
        } else if (user.role === 'employee') {
          navigate('/emp-dashboard');
        }
      } else {
        setErrorMsg("Authentication failed: No token received.");
      }
    } catch (err) {
      // 5. Handle specific error statuses from the API
      if (err.response) {
        setErrorMsg(err.response.data.message || "Invalid username or password!");
      } else {
        setErrorMsg("Network error: Cannot reach the authentication server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="bg-[#81181C] p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full ">
            <img src={Logo} alt="MediSys Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">MediSYS</h2>
          <p className="text-sm mt-1 opacity-90">Bill Tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#81181C]/20 focus:border-[#81181C] bg-white outline-none transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#81181C]/20 focus:border-[#81181C] bg-white outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#81181C] text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-[#6b1417] transition-all active:scale-[0.97] ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <FontAwesomeIcon icon={faSignInAlt} />
            )}
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PharmaLogin;