import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CalendarDaysIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../../contexts/AuthContext';
import { getIdToken } from '../../utils/authUtils';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Analytics Page using Chart.js with real data
function AnalysisPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  
  // State for chart data
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [productCategoryData, setProductCategoryData] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      // Check if user is authenticated before fetching data
      if (authLoading) return; // Wait for auth to load
      // Check if user is authenticated and is an admin
      if (!currentUser || currentUser.role !== 'admin') {
        console.log('User not authenticated or not admin, skipping data fetch');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching analytics data...');
        
        // Get Firebase ID token for authentication
        const token = await getIdToken();
        
        // Fetch users data (all users, not just first page)
        const usersResponse = await fetch(`${API_BASE_URL}/auth/users?limit=1000`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users data');
        }
        
        const usersData = await usersResponse.json();
        const users = usersData.users || [];
        const totalUsers = usersData.pagination?.totalUsers || users.length;
        console.log('Users data:', users);
        
        // Fetch products data
        const productsResponse = await fetch(`${API_BASE_URL}/products`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products data');
        }
        
        const productsData = await productsResponse.json();
        const products = productsData.products || [];
        console.log('Products data:', products);
        
        // Process user growth data (group by month)
        const userGrowth = processUserGrowthData(users);
        console.log('User growth data:', userGrowth);
        
        // Process product category data
        const productCategories = processProductCategoryData(products);
        console.log('Product categories data:', productCategories);
        
        // Calculate summary statistics
        const stats = {
          totalUsers: totalUsers, // Use the total from pagination
          totalProducts: products.length,
          totalServices: 0, // We don't have services endpoint yet
          activeUsers: users.filter(user => user.isActive !== false).length
        };
        console.log('Summary stats:', stats);
        
        // Generate recent activity (simulated for now)
        const activity = generateRecentActivity(users, products);
        console.log('Recent activity:', activity);
        
        setUserGrowthData(userGrowth);
        setProductCategoryData(productCategories);
        setSummaryStats(stats);
        setRecentActivity(activity);
        
        console.log('All data set successfully');
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        // Provide more specific error messages
        if (err.message.includes('Token') || err.message.includes('auth')) {
          setError('Authentication error. Please log in again.');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to load analytics data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, currentUser, authLoading]);

  // Process user growth data by month
  const processUserGrowthData = (users) => {
    // Handle case where users data might be invalid
    if (!Array.isArray(users) || users.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'New Users',
            data: [],
            backgroundColor: 'rgba(249, 115, 22, 0.6)',
            borderColor: 'rgba(249, 115, 22, 1)',
            borderWidth: 1,
          },
        ],
      };
    }
    
    // Group users by month
    const monthlyCounts = {};
    
    users.forEach(user => {
      if (user.createdAt) {
        try {
          const date = new Date(user.createdAt);
          // Check if date is valid
          if (isNaN(date.getTime())) {
            return;
          }
          const month = date.toLocaleString('default', { month: 'short' });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        } catch (err) {
          console.warn('Error processing user date:', user.createdAt, err);
        }
      }
    });
    
    // Convert to chart format
    const labels = Object.keys(monthlyCounts);
    const data = Object.values(monthlyCounts);
    
    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: data,
          backgroundColor: 'rgba(249, 115, 22, 0.6)',
          borderColor: 'rgba(249, 115, 22, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Process product category data
  const processProductCategoryData = (products) => {
    // Handle case where products data might be invalid
    if (!Array.isArray(products) || products.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              'rgba(249, 115, 22, 0.8)',
              'rgba(30, 58, 138, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
            ],
            borderColor: [
              'rgba(249, 115, 22, 1)',
              'rgba(30, 58, 138, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    }
    
    // Count products by category
    const categoryCounts = {};
    
    products.forEach(product => {
      const category = product.pCategory || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Get top 5 categories
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const labels = sortedCategories.map(item => item[0]);
    const data = sortedCategories.map(item => item[1]);
    
    return {
      labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgba(249, 115, 22, 0.8)',
            'rgba(30, 58, 138, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(249, 115, 22, 1)',
            'rgba(30, 58, 138, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate recent activity (simulated for now)
  const generateRecentActivity = (users, products) => {
    const activity = [];
    
    // Add recent user registrations
    const recentUsers = users
      .filter(user => user.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentUsers.forEach(user => {
      activity.push({
        id: `user-${user._id}`,
        user: user.fullName || user.email,
        action: 'User registered',
        target: 'System',
        time: formatTimeAgo(user.createdAt),
        icon: 'user',
        color: 'bg-blue-500'
      });
    });
    
    // Add recent product additions
    const recentProducts = products
      .filter(product => product.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentProducts.forEach(product => {
      activity.push({
        id: `product-${product._id}`,
        user: 'System',
        action: 'Product added',
        target: product.pName,
        time: formatTimeAgo(product.createdAt),
        icon: 'product',
        color: 'bg-green-500'
      });
    });
    
    // Sort all activity by time
    return activity.sort((a, b) => {
      const timeA = new Date(a.time.replace(' ago', ''));
      const timeB = new Date(b.time.replace(' ago', ''));
      return timeB - timeA;
    }).slice(0, 6);
  };

  // Format time ago (simplified)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    return 'More than 30 days ago';
  };

  // Export data to PDF
  const exportToPDF = async () => {
    try {
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
      doc.text('Analytics Report', 148.5, 25, null, null, 'center');
      
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
      
      // Add summary statistics with better visual presentation
      const totalUsers = summaryStats?.totalUsers || 0;
      const totalProducts = summaryStats?.totalProducts || 0;
      const totalServices = summaryStats?.totalServices || 0;
      const activeUsers = summaryStats?.activeUsers || 0;
      
      // Add a line separator
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.5);
      doc.line(20, 53, 277, 53);
      
      // Add summary boxes
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      
      // Background boxes for statistics
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(20, 58, 65, 25, 2, 2, 'F');
      doc.text(`Users: ${totalUsers}`, 52.5, 73, null, null, 'center');
      
      doc.setFillColor(255, 193, 7);
      doc.roundedRect(87, 58, 65, 25, 2, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(`Products: ${totalProducts}`, 119.5, 73, null, null, 'center');
      
      doc.setFillColor(40, 167, 69);
      doc.roundedRect(154, 58, 65, 25, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(`Services: ${totalServices}`, 186.5, 73, null, null, 'center');
      
      doc.setFillColor(108, 117, 125);
      doc.roundedRect(221, 58, 65, 25, 2, 2, 'F');
      doc.text(`Active: ${activeUsers}`, 253.5, 73, null, null, 'center');
      
      let currentY = 90;
      
      // Add user growth data table
      if (userGrowthData && userGrowthData.labels.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('User Growth Data', 20, currentY);
        currentY += 10;
        
        const userGrowthTableData = userGrowthData.labels.map((label, index) => [
          label,
          userGrowthData.datasets[0].data[index].toString()
        ]);
        
        autoTable(doc, {
          head: [['Month', 'New Users']],
          body: userGrowthTableData,
          startY: currentY,
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [30, 64, 175],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          bodyStyles: {
            textColor: [0, 0, 0]
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250]
          }
        });
        
        currentY = doc.lastAutoTable.finalY + 10;
      }
      
      // Add product category data table
      if (productCategoryData && productCategoryData.labels.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Product Categories', 20, currentY);
        currentY += 10;
        
        const productCategoryTableData = productCategoryData.labels.map((label, index) => [
          label,
          productCategoryData.datasets[0].data[index].toString()
        ]);
        
        autoTable(doc, {
          head: [['Category', 'Products']],
          body: productCategoryTableData,
          startY: currentY,
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [30, 64, 175],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          bodyStyles: {
            textColor: [0, 0, 0]
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250]
          }
        });
        
        currentY = doc.lastAutoTable.finalY + 10;
      }
      
      // Add recent activity
      if (recentActivity && recentActivity.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Recent Activity', 20, currentY);
        currentY += 10;
        
        const activityTableData = recentActivity.map(activity => [
          activity.user,
          activity.action,
          activity.target,
          activity.time
        ]);
        
        autoTable(doc, {
          head: [['User', 'Action', 'Target', 'Time']],
          body: activityTableData,
          startY: currentY,
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [30, 64, 175],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          bodyStyles: {
            textColor: [0, 0, 0]
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250]
          }
        });
      }
      
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
      const fileName = `petverse-analytics-${date.replace(/\//g, '-')}.pdf`;
      doc.setProperties({
        title: 'PETVERSE Analytics Report',
        subject: 'Analytics Report',
        author: 'PETVERSE Admin System',
        keywords: 'analytics, statistics, pet, petverse, business'
      });
      
      doc.save(fileName);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  // Chart options
  const userGrowthOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Growth',
      },
    },
  };

  const productCategoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Categories',
      },
    },
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
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
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">View business insights and performance metrics</p>
      </div>

      {/* Date Range Filter and Export Button */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">Date Range:</span>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          
          <button
            onClick={exportToPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats?.totalUsers ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats?.totalProducts ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats?.totalServices ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats?.activeUsers ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          {userGrowthData && userGrowthData.labels.length > 0 ? (
            <Bar data={userGrowthData} options={userGrowthOptions} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No user growth data available
            </div>
          )}
        </div>
        
        {/* Product Categories Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Categories</h3>
          {productCategoryData && productCategoryData.labels.length > 0 ? (
            <Pie data={productCategoryData} options={productCategoryOptions} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No product category data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`p-2 rounded-full ${activity.color} text-white mr-3`}>
                  {activity.icon === 'user' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {activity.icon === 'product' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {activity.icon === 'service' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action} {activity.target}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activity available
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;