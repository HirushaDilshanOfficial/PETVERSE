import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getIdToken } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';

// Navbar Component
function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Search functionality for: ${searchTerm}`);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signout();
        // Navigate to home page after logout
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  };

  const goToProfile = () => {
    setShowDropdown(false);
    alert('Profile page would be opened here');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <svg className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users, products, orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Right Section - Profile Only */}
        <div className="flex items-center">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@gmail.com</p>
              </div>
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <button
                    onClick={goToProfile}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </nav>
  );
}

// Custom SVG Icons
const Icons = {
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Document: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Services: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  User: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
};

function AdminDashboard() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    totalServices: 0,
    totalRevenue: 0
  });
  
  console.log("AdminDashboard - currentUser:", currentUser);
  console.log("AdminDashboard - authLoading:", authLoading);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  useEffect(() => {
    // Load dashboard stats from API
    const loadDashboardStats = async () => {
      try {
        if (authLoading) return; // Wait for auth to load
        // Check if user is authenticated and is an admin
        if (!currentUser || currentUser.role !== 'admin') return;
        
        setLoading(true);
        setError(null);
        
        const token = await getIdToken();
        
        // Fetch all users to calculate statistics
        const response = await fetch(`${API_BASE_URL}/auth/users?limit=1000`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        const users = data.users || [];
        
        // Calculate statistics
        const totalUsers = data.pagination?.totalUsers || users.length;
        const pendingKYC = users.filter(user => 
          user.role === 'serviceProvider' && 
          !user.verification?.isVerified && 
          !user.verification?.isRejected
        ).length;
        const totalServices = users.filter(user => user.role === 'serviceProvider').length;
        // For revenue, we'll use a placeholder calculation based on service providers
        const totalRevenue = totalServices * 125; // Assuming $125 average per service provider
        
        setStats({
          totalUsers,
          pendingKYC,
          totalServices,
          totalRevenue
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    loadDashboardStats();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser, authLoading]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon, title, value, change, color, loading }) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <div className={`${color.replace('bg-', 'text-')}`}>
              {icon}
            </div>
          </div>
          
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          ) : (
            <div className="flex items-end space-x-2 mb-2">
              <p className="text-3xl font-bold text-gray-900">
                {title === 'Revenue' ? `$${value.toLocaleString()}` : value.toLocaleString()}
              </p>
              {change && (
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <Icons.TrendingUp />
                  <span className="ml-1">{change}%</span>
                </div>
              )}
            </div>
          )}
          
          <div className={`h-1 rounded-full ${color} bg-opacity-20 overflow-hidden`}>
            <div className={`h-full ${color} rounded-full transition-all duration-1000 ${loading ? 'w-0' : 'w-3/4'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show a message if user is not authenticated or not an admin
  if (!currentUser || currentUser.role !== 'admin') {
    console.log("AdminDashboard - Access denied:", { currentUser, role: currentUser?.role });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-orange-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-orange-500 text-lg font-medium">Access denied</p>
          <p className="text-gray-600 mt-2">You must be an administrator to access this page.</p>
          {currentUser && <p className="text-gray-500 mt-2">Current role: {currentUser.role}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Admin! 👋
              </h2>
              <p className="text-gray-600">
                Here's what's happening with PETVERSE today
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Live Time and Date */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(currentTime)}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  Export Data
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg shadow-blue-500/25">
                  Quick Action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Icons.Users />}
            title="Total Users"
            value={stats.totalUsers}
            change={12.5}
            color="bg-blue-500"
            loading={loading}
          />
          <StatCard
            icon={<Icons.Document />}
            title="Pending KYC"
            value={stats.pendingKYC}
            change={-8.2}
            color="bg-orange-500"
            loading={loading}
          />
          <StatCard
            icon={<Icons.Services />}
            title="Active Services"
            value={stats.totalServices}
            change={24.1}
            color="bg-green-500"
            loading={loading}
          />
          <StatCard
            icon={<Icons.Chart />}
            title="Total Revenue"
            value={stats.totalRevenue}
            change={18.7}
            color="bg-purple-500"
            loading={loading}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      action: "Pet Owner - Account created",
                      time: "2 minutes ago",
                      avatar: "SJ",
                      color: "from-pink-500 to-rose-500"
                    },
                    {
                      name: "Mike Chen",
                      action: "Service Provider - KYC submitted",
                      time: "1 hour ago",
                      avatar: "MC",
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      name: "Emma Davis",
                      action: "Pet Grooming - Service completed",
                      time: "3 hours ago",
                      avatar: "ED",
                      color: "from-green-500 to-emerald-500"
                    },
                    {
                      name: "Alex Rodriguez",
                      action: "Veterinarian - Profile verified",
                      time: "5 hours ago",
                      avatar: "AR",
                      color: "from-purple-500 to-violet-500"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 group">
                      <div className={`w-12 h-12 bg-gradient-to-r ${activity.color} rounded-full flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-200`}>
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.name}
                        </p>
                        <p className="text-sm text-gray-500">{activity.action}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="p-6 space-y-4">
                {[
                  {
                    label: "Review KYC Submissions",
                    color: "from-orange-500 to-amber-500",
                    urgent: stats.pendingKYC
                  },
                  {
                    label: "Add New Service Provider",
                    color: "from-blue-500 to-indigo-500"
                  },
                  {
                    label: "Generate Analytics Report",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    label: "Manage User Permissions",
                    color: "from-purple-500 to-violet-500"
                  }
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`w-full p-4 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-left relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                    <div className="relative flex items-center justify-between">
                      <span className="font-semibold">{action.label}</span>
                      {action.urgent && (
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-bold">
                          {action.urgent}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;