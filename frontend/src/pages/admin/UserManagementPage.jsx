import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getIdToken } from '../../utils/authUtils';
import { 
  MagnifyingGlassIcon, 
  EyeIcon,
  TrashIcon,
  PencilIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Simple User Management Page for beginners
function UserManagementPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  
  // State for users list and UI
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // Form data for editing
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    nicNumber: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Fetch users with pagination
  const fetchUsers = async (page = 1, role = 'all', verified = 'all') => {
    try {
      if (authLoading) return; // Wait for auth to load
      // Check if user is authenticated and is an admin
      if (!currentUser || currentUser.role !== 'admin') return;
      
      setLoading(true);
      setError(null);
      
      // Get Firebase ID token for authentication
      const token = await getIdToken();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', usersPerPage);
      
      if (role !== 'all') {
        queryParams.append('role', role);
      }
      
      if (verified !== 'all') {
        queryParams.append('verified', verified);
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/users?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.totalUsers || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    // Check if user is authenticated and is an admin
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers(currentPage, filterRole, filterVerified);
    }
  }, [currentUser, filterRole, filterVerified, currentPage, authLoading, searchTerm]);

  // Filter users based on search term (client-side search)
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm));
    return matchesSearch;
  });

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle role filter change
  const handleRoleFilterChange = (role) => {
    setFilterRole(role);
    // Set default verification filter based on role
    if (role === 'serviceProvider') {
      setFilterVerified('all'); // Show all service providers
    } else {
      setFilterVerified('all'); // Reset verification filter for other roles
    }
    setCurrentPage(1);
  };

  // Handle verification filter change
  const handleVerificationFilterChange = (verified) => {
    setFilterVerified(verified);
    setCurrentPage(1);
  };

  // Handle search term change with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Allow only letters and numbers
    if (/^[a-zA-Z0-9]*$/.test(value) || value === '') {
      setSearchTerm(value);
    }
  };

  // View user details
  const viewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowUserModal(true);
  };

  // Edit user details
  const editUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      nicNumber: user.nicNumber || ''
    });
    setModalMode('edit');
    setShowUserModal(true);
  };

  // Update user details
  const updateUser = async (userId, updatedData) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/details`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      // Refresh users list
      fetchUsers(currentPage, filterRole, filterVerified);
      
      // Close modal
      setShowUserModal(false);
      
      showNotification('User updated successfully!', 'success');
      
    } catch (err) {
      console.error('Error updating user:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Toggle user active/inactive status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      // Refresh users list
      fetchUsers(currentPage, filterRole, filterVerified);
      
      showNotification(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
      
    } catch (err) {
      console.error('Error updating user status:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Delete user
  const deleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const token = await getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Refresh users list
      fetchUsers(currentPage, filterRole, filterVerified);
      
      showNotification('User deleted successfully!', 'success');
      
    } catch (err) {
      console.error('Error deleting user:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Verify service provider
  const verifyServiceProvider = async (userId) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify service provider');
      }
      
      // Refresh users list
      fetchUsers(currentPage, filterRole, filterVerified);
      
      showNotification('Service provider verified successfully!', 'success');
      
    } catch (err) {
      console.error('Error verifying service provider:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' },
      serviceProvider: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Service Provider' },
      petOwner: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pet Owner' },
    };
    
    const config = roleConfig[role] || { bg: 'bg-gray-100', text: 'text-gray-800', label: role };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Inactive
        </span>
      );
    }
  };

  // Get verification badge for service providers
  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Not Verified
        </span>
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Export user data to PDF
  const exportToPDF = async () => {
    try {
      // Import jsPDF and autoTable dynamically to avoid loading issues
      const jsPDF = (await import('jspdf')).jsPDF;
      const autoTable = (await import('jspdf-autotable')).default;
      
      // Create new PDF document in landscape mode for better data display
      const doc = new jsPDF('landscape');
      
      // Add PETVERSE header with enhanced business information
      doc.setFontSize(24);
      doc.setTextColor(30, 64, 175); // Blue color from PETVERSE theme
      doc.setFont(undefined, 'bold');
      doc.text('PETVERSE', 148.5, 15, null, null, 'center');
      
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.text('User Management Report', 148.5, 25, null, null, 'center');
      
      // Add business information with better styling
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('New Kandy Road, Malabe • Tel: 0912345673', 148.5, 33, null, null, 'center');
      doc.text('www.petverse.com • hello@petverse.com', 148.5, 39, null, null, 'center');
      
      // Add date and filter information with better formatting
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on: ${date} at ${time}`, 148.5, 47, null, null, 'center');
      
      // Add filter information
      let filterText = 'Filters: All Users';
      if (filterRole !== 'all') {
        filterText = `Role: ${filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}`;
        if (filterRole === 'serviceProvider' && filterVerified !== 'all') {
          filterText += `, Verification: ${filterVerified.charAt(0).toUpperCase() + filterVerified.slice(1)}`;
        }
      }
      doc.text(filterText, 148.5, 53, null, null, 'center');
      
      // Add summary statistics with better visual presentation
      const totalUsersCount = totalUsers;
      const activeUsers = users.filter(u => u.isActive).length;
      const inactiveUsers = users.filter(u => !u.isActive).length;
      const verifiedProviders = users.filter(u => u.role === 'serviceProvider' && u.verification?.isVerified).length;
      
      // Add a line separator
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.5);
      doc.line(20, 59, 277, 59);
      
      // Add summary boxes
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      
      // Background boxes for statistics
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(20, 64, 65, 25, 2, 2, 'F');
      doc.text(`Total: ${totalUsersCount}`, 52.5, 79, null, null, 'center');
      
      doc.setFillColor(40, 167, 69);
      doc.roundedRect(87, 64, 65, 25, 2, 2, 'F');
      doc.text(`Active: ${activeUsers}`, 119.5, 79, null, null, 'center');
      
      doc.setFillColor(220, 53, 69);
      doc.roundedRect(154, 64, 65, 25, 2, 2, 'F');
      doc.text(`Inactive: ${inactiveUsers}`, 186.5, 79, null, null, 'center');
      
      doc.setFillColor(255, 193, 7);
      doc.roundedRect(221, 64, 65, 25, 2, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(`Verified: ${verifiedProviders}`, 253.5, 79, null, null, 'center');
      
      // Prepare table data with better formatting
      const tableData = filteredUsers.map(user => [
        user.fullName || 'N/A',
        user.email || 'N/A',
        user.phoneNumber || 'N/A',
        user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A',
        user.isActive ? 'Active' : 'Inactive',
        filterRole === 'serviceProvider' ? (user.verification?.isVerified ? 'Verified' : 'Not Verified') : 'N/A',
        formatDate(user.createdAt) || 'N/A'
      ]);
      
      // Add table with enhanced styling
      const headers = filterRole === 'serviceProvider' 
        ? ['Name', 'Email', 'Phone', 'Role', 'Status', 'Verification', 'Joined Date']
        : ['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date'];
      
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 96,
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [30, 64, 175], // Blue color from PETVERSE theme
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        pageBreak: 'auto',
        margin: { top: 96, bottom: 30 }
      });
      
      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 148.5, 200, null, null, 'center');
        doc.text('© 2025 PETVERSE. All rights reserved.', 148.5, 205, null, null, 'center');
      }
      
      // Save the PDF with metadata
      const fileName = `petverse-users-${date.replace(/\//g, '-')}.pdf`;
      doc.setProperties({
        title: 'PETVERSE User Management Report',
        subject: 'User Management Report',
        author: 'PETVERSE Admin System',
        keywords: 'users, management, pet, petverse, accounts'
      });
      
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showNotification('Failed to export PDF. Please try again.', 'error');
    }
  };

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading user management...</p>
        </div>
      </div>
    );
  }

  // Show a message if user is not authenticated or not an admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-orange-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-orange-500 text-lg font-medium">Access denied</p>
          <p className="text-gray-600 mt-2">You must be an administrator to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users in the system</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users (letters and numbers only)..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export PDF
            </button>
            
            {/* Role Filter */}
            <div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filterRole}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="petOwner">Pet Owner</option>
                <option value="serviceProvider">Service Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Verification Filter - Show only for Service Providers */}
            {filterRole === 'serviceProvider' && (
              <div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={filterVerified}
                  onChange={(e) => handleVerificationFilterChange(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="notVerified">Not Verified</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={() => fetchUsers(currentPage, filterRole, filterVerified)}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}
      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {filterRole === 'serviceProvider' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={filterRole === 'serviceProvider' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                        {user.address && (
                          <div className="text-sm text-gray-500">{user.address}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className="cursor-pointer"
                        >
                          {getStatusBadge(user.isActive)}
                        </button>
                      </td>
                      {filterRole === 'serviceProvider' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getVerificationBadge(user.verification?.isVerified)}
                          {!user.verification?.isVerified && (
                            <button
                              onClick={() => verifyServiceProvider(user._id)}
                              className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Verify
                            </button>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View User"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => editUser(user)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit User"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id, user.fullName)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalMode === 'view' ? 'User Details' : 'Edit User'}
            </h3>
            
            {modalMode === 'view' ? (
              // View Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.phoneNumber}</p>
                </div>
                {selectedUser.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.address}</p>
                  </div>
                )}
                {selectedUser.nicNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NIC Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.nicNumber}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                {selectedUser.role === 'serviceProvider' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Verification</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.verification?.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                    {selectedUser.verification?.verifiedAt && (
                      <p className="mt-1 text-sm text-gray-900">
                        Verified on: {formatDate(selectedUser.verification.verifiedAt)}
                      </p>
                    )}
                    {selectedUser.verification?.verifiedBy && (
                      <p className="mt-1 text-sm text-gray-900">
                        Verified by: {selectedUser.verification.verifiedBy.fullName}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={(e) => {
                e.preventDefault();
                updateUser(selectedUser._id, editFormData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NIC Number</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={editFormData.nicNumber}
                      onChange={(e) => setEditFormData({...editFormData, nicNumber: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                  >
                    Update User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            
            {modalMode === 'view' && (
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setModalMode('edit');
                    setEditFormData({
                      fullName: selectedUser.fullName || '',
                      email: selectedUser.email || '',
                      phoneNumber: selectedUser.phoneNumber || '',
                      address: selectedUser.address || '',
                      nicNumber: selectedUser.nicNumber || ''
                    });
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Edit User
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementPage;