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
import { makeAuthenticatedRequest } from '../../utils/authUtils';
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
  // State for chart data
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [productCategoryData, setProductCategoryData] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch users data (all users, not just first page)
        const usersResponse = await makeAuthenticatedRequest('/auth/users?limit=1000');
        const users = usersResponse.users || [];
        const totalUsers = usersResponse.pagination?.totalUsers || users.length;
        
        // Fetch products data
        const productsResponse = await makeAuthenticatedRequest('/products');
        const products = productsResponse.products || [];
        
        // Fetch services data
        const servicesResponse = await makeAuthenticatedRequest('/services');
        const services = servicesResponse || [];
        
        // Process user growth data (group by month)
        const userGrowth = processUserGrowthData(users);
        
        // Process product category data
        const productCategories = processProductCategoryData(products);
        
        // Calculate summary statistics
        const stats = {
          totalUsers: totalUsers, // Use the total from pagination
          totalProducts: products.length,
          totalServices: services.length,
          activeUsers: users.filter(user => user.isActive !== false).length
        };
        
        // Generate recent activity (simulated for now)
        const activity = generateRecentActivity(users, products, services);
        
        setUserGrowthData(userGrowth);
        setProductCategoryData(productCategories);
        setSummaryStats(stats);
        setRecentActivity(activity);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Process user growth data by month
  const processUserGrowthData = (users) => {
    // Group users by month
    const monthlyCounts = {};
    
    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
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
          data,
          backgroundColor: 'rgba(249, 115, 22, 0.6)',
          borderColor: 'rgba(249, 115, 22, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Process product category data
  const processProductCategoryData = (products) => {
    // Count products by category
    const categoryCounts = {};
    
    products.forEach(product => {
      const category = product.pCategory || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Take top 5 categories
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Convert to chart format
    const labels = topCategories.map(([category]) => category);
    const data = topCategories.map(([, count]) => count);
    
    // Define colors for each category
    const backgroundColors = [
      'rgba(249, 115, 22, 0.8)',
      'rgba(30, 58, 138, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(234, 179, 8, 0.8)'
    ];
    
    const borderColors = [
      'rgba(249, 115, 22, 1)',
      'rgba(30, 58, 138, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(234, 179, 8, 1)'
    ];
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate recent activity (in a real app, this would come from backend)
  const generateRecentActivity = (users, products, services) => {
    const activity = [];
    
    // Add recent user registrations
    const recentUsers = users
      .filter(user => user.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentUsers.forEach(user => {
      activity.push({
        id: `user-${user._id}`,
        action: 'New user registered',
        user: user.fullName,
        time: formatTimeAgo(user.createdAt)
      });
    });
    
    // Add recent products
    const recentProducts = products
      .filter(product => product.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentProducts.forEach(product => {
      activity.push({
        id: `product-${product._id}`,
        action: 'Product added',
        product: product.pName,
        time: formatTimeAgo(product.createdAt)
      });
    });
    
    return activity;
  };

  // Format time ago (e.g., "2 hours ago")
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Export data to PDF using jsPDF
  const exportData = () => {
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
      
      // Add date with better formatting
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
      
      // Add user growth data table if available
      if (userGrowthData) {
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175); // Blue color
        doc.setFont(undefined, 'bold');
        doc.text("User Growth Data", 20, currentY);
        
        // Prepare table data
        const userGrowthTable = userGrowthData.labels.map((label, index) => [
          label,
          userGrowthData.datasets[0].data[index]
        ]);
        
        // Add table
        autoTable(doc, {
          head: [['Month', 'New Users']],
          body: userGrowthTable,
          startY: currentY + 10,
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
          pageBreak: 'auto'
        });
        
        currentY = doc.lastAutoTable.finalY + 15;
      }
      
      // Add product category data table if available
      if (productCategoryData) {
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175); // Blue color
        doc.setFont(undefined, 'bold');
        doc.text("Product Categories", 20, currentY);
        
        // Prepare table data
        const productCategoryTable = productCategoryData.labels.map((label, index) => [
          label,
          productCategoryData.datasets[0].data[index]
        ]);
        
        // Add table
        autoTable(doc, {
          head: [['Category', 'Count']],
          body: productCategoryTable,
          startY: currentY + 10,
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
          pageBreak: 'auto'
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

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
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

      {/* Controls Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 3 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportData}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
          </div>
          <div className="h-64">
            {userGrowthData && <Bar data={userGrowthData} options={userGrowthOptions} />}
          </div>
        </div>

        {/* Product Categories Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Product Categories</h3>
          </div>
          <div className="h-64">
            {productCategoryData && <Pie data={productCategoryData} options={productCategoryOptions} />}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <span className="text-gray-700">Total Users</span>
              <span className="font-bold text-orange-600">{summaryStats?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="text-gray-700">Total Products</span>
              <span className="font-bold text-blue-600">{summaryStats?.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-gray-700">Total Services</span>
              <span className="font-bold text-green-600">{summaryStats?.totalServices || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="text-gray-700">Active Users</span>
              <span className="font-bold text-purple-600">{summaryStats?.activeUsers || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="border-l-4 border-orange-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;