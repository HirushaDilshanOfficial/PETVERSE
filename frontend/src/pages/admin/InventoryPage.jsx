import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

// Simple Inventory Management Page with Real API Integration
function InventoryPage() {
  const { currentUser } = useAuth();
  
  // State for products and UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Predefined categories
  const [categories, setCategories] = useState([
    'Food',
    'Toys',
    'Grooming',
    'Health',
    'Clothing',
    'Beds',
    'Carriers',
    'Training',
    'Treats'
  ]);
  
  // Form data for new product
  const [newProduct, setNewProduct] = useState({
    productID: '',
    pName: '',
    pDescription: '',
    pCategory: '',
    pPrice: '',
    pQuantity: '',
    pImage: '',
    status: 'Active'
  });
  
  // Form data for new category
  const [newCategory, setNewCategory] = useState('');
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  
  // Image file state
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
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
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    return (
      (product.pName && product.pName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.productID && product.productID.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.pCategory && product.pCategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Check if product has low stock (less than 5)
  const isLowStock = (quantity) => quantity < 5;

  // Handle form input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Apply specific validation based on field name
    switch (name) {
      case 'productID':
      case 'pName':
        // Allow only letters and numbers
        if (/^[a-zA-Z0-9]*$/.test(value) || value === '') {
          setNewProduct({
            ...newProduct,
            [name]: value
          });
        }
        break;
      case 'pQuantity':
        // Allow only numbers
        if (/^\d*$/.test(value) || value === '') {
          setNewProduct({
            ...newProduct,
            [name]: value
          });
        }
        break;
      default:
        setNewProduct({
          ...newProduct,
          [name]: value
        });
    }
  };
  
  // Handle search term change with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Allow only letters and numbers
    if (/^[a-zA-Z0-9]*$/.test(value) || value === '') {
      setSearchTerm(value);
    }
  };
  
  // Handle adding a new category
  const handleAddCategory = (newCategory) => {
    if (newCategory && newCategory.trim() !== '') {
      const trimmedCategory = newCategory.trim();
      if (!categories.includes(trimmedCategory)) {
        setCategories(prev => [...prev, trimmedCategory]);
      }
      return trimmedCategory;
    }
    return null;
  };
  
  // Handle opening the add category modal
  const openAddCategoryModal = () => {
    setNewCategory('');
    setShowAddCategoryModal(true);
  };
  
  // Handle saving a new category
  const saveNewCategory = () => {
    const addedCategory = handleAddCategory(newCategory);
    if (addedCategory) {
      setNewProduct({...newProduct, pCategory: addedCategory});
      setShowAddCategoryModal(false);
      setNewCategory('');
    }
  };
  
  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct({
          ...newProduct,
          pImage: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle edit image file change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct({
          ...newProduct,
          pImage: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new product
  const addProduct = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    
    if (!newProduct.productID) {
      errors.productID = 'Product ID is required';
    } else if (!/^[a-zA-Z0-9]+$/.test(newProduct.productID)) {
      errors.productID = 'Product ID can only contain letters and numbers';
    }
    
    if (!newProduct.pName) {
      errors.pName = 'Product Name is required';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(newProduct.pName)) {
      errors.pName = 'Product Name can only contain letters, numbers, and spaces';
    }
    
    if (!newProduct.pDescription) {
      errors.pDescription = 'Product Description is required';
    }
    
    if (!newProduct.pCategory) {
      errors.pCategory = 'Product Category is required';
    }
    
    if (!newProduct.pPrice) {
      errors.pPrice = 'Product Price is required';
    } else if (isNaN(newProduct.pPrice) || parseFloat(newProduct.pPrice) <= 0) {
      errors.pPrice = 'Price must be a positive number';
    }
    
    if (!newProduct.pQuantity) {
      errors.pQuantity = 'Product Quantity is required';
    } else if (isNaN(newProduct.pQuantity) || parseInt(newProduct.pQuantity) < 0) {
      errors.pQuantity = 'Quantity must be a non-negative number';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const token = await currentUser.getIdToken();
      
      // Prepare form data
      const formData = new FormData();
      formData.append('productID', newProduct.productID);
      formData.append('pName', newProduct.pName);
      formData.append('pDescription', newProduct.pDescription);
      formData.append('pCategory', newProduct.pCategory);
      formData.append('pPrice', parseFloat(newProduct.pPrice));
      formData.append('pQuantity', parseInt(newProduct.pQuantity));
      formData.append('status', newProduct.status);
      
      // Add image file if provided
      if (imageFile) {
        formData.append('file', imageFile);
      } else if (newProduct.pImage) {
        // If no file but URL provided, send the URL
        formData.append('pImage', newProduct.pImage);
      }
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      // Reset form and close modal
      setNewProduct({
        productID: '',
        pName: '',
        pDescription: '',
        pCategory: '',
        pPrice: '',
        pQuantity: '',
        pImage: '',
        status: 'Active'
      });
      setFormErrors({});
      setImageFile(null);
      setShowAddModal(false);
      
      // Refresh products list
      fetchProducts();
      
      // Show success notification
      showNotification('Product added successfully!', 'success');
      
    } catch (err) {
      console.error('Error adding product:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Delete product
  const deleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const token = await currentUser.getIdToken();
        
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete product');
        }
        
        // Refresh products list
        fetchProducts();
        
        // Show success notification
        showNotification('Product deleted successfully!', 'success');
        
      } catch (err) {
        console.error('Error deleting product:', err);
        showNotification(`Error: ${err.message}`, 'error');
      }
    }
  };

  // Edit product
  const editProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      productID: product.productID,
      pName: product.pName,
      pDescription: product.pDescription,
      pCategory: product.pCategory,
      pPrice: product.pPrice.toString(),
      pQuantity: product.pQuantity.toString(),
      pImage: product.pImage || '',
      status: product.status
    });
    setEditImageFile(null);
    setShowEditModal(true);
  };

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    
    // Validate form (similar to addProduct but without productID validation since it's read-only)
    const errors = {};
    
    if (!newProduct.pName) {
      errors.pName = 'Product Name is required';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(newProduct.pName)) {
      errors.pName = 'Product Name can only contain letters, numbers, and spaces';
    }
    
    if (!newProduct.pDescription) {
      errors.pDescription = 'Product Description is required';
    }
    
    if (!newProduct.pCategory) {
      errors.pCategory = 'Product Category is required';
    }
    
    if (!newProduct.pPrice) {
      errors.pPrice = 'Product Price is required';
    } else if (isNaN(newProduct.pPrice) || parseFloat(newProduct.pPrice) <= 0) {
      errors.pPrice = 'Price must be a positive number';
    }
    
    if (!newProduct.pQuantity) {
      errors.pQuantity = 'Product Quantity is required';
    } else if (isNaN(newProduct.pQuantity) || parseInt(newProduct.pQuantity) < 0) {
      errors.pQuantity = 'Quantity must be a non-negative number';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const token = await currentUser.getIdToken();
      
      // Prepare form data
      const formData = new FormData();
      formData.append('productID', newProduct.productID);
      formData.append('pName', newProduct.pName);
      formData.append('pDescription', newProduct.pDescription);
      formData.append('pCategory', newProduct.pCategory);
      formData.append('pPrice', parseFloat(newProduct.pPrice));
      formData.append('pQuantity', parseInt(newProduct.pQuantity));
      formData.append('status', newProduct.status);
      
      // Add image file if provided
      if (editImageFile) {
        formData.append('file', editImageFile);
      } else if (newProduct.pImage && newProduct.pImage.startsWith('http')) {
        // If no file but URL provided, send the URL
        formData.append('pImage', newProduct.pImage);
      }
      
      const response = await fetch(`${API_BASE_URL}/products/${selectedProduct.productID}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      // Reset form and close modal
      setNewProduct({
        productID: '',
        pName: '',
        pDescription: '',
        pCategory: '',
        pPrice: '',
        pQuantity: '',
        pImage: '',
        status: 'Active'
      });
      setFormErrors({});
      setEditImageFile(null);
      setShowEditModal(false);
      
      // Refresh products list
      fetchProducts();
      
      // Show success notification
      showNotification('Product updated successfully!', 'success');
      
    } catch (err) {
      console.error('Error updating product:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Toggle product status (Active/Inactive)
  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const token = await currentUser.getIdToken();
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle product status');
      }
      
      // Refresh products list
      fetchProducts();
      
      showNotification(`Product ${newStatus.toLowerCase()} successfully!`, 'success');
      
    } catch (err) {
      console.error('Error toggling product status:', err);
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Inactive
        </span>
      );
    }
  };

  // Export inventory data to PDF
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
      doc.text('Inventory Management Report', 148.5, 25, null, null, 'center');
      
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
      const totalProducts = filteredProducts.length;
      const activeProducts = filteredProducts.filter(p => p.status === 'Active').length;
      const lowStockProducts = filteredProducts.filter(p => isLowStock(p.pQuantity)).length;
      
      // Add a line separator
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.5);
      doc.line(20, 53, 277, 53);
      
      // Add summary boxes
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      
      // Background boxes for statistics
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(20, 58, 85, 25, 2, 2, 'F');
      doc.text(`Total Products: ${totalProducts}`, 62.5, 73, null, null, 'center');
      
      doc.setFillColor(40, 167, 69);
      doc.roundedRect(107, 58, 85, 25, 2, 2, 'F');
      doc.text(`Active: ${activeProducts}`, 149.5, 73, null, null, 'center');
      
      doc.setFillColor(220, 53, 69);
      doc.roundedRect(194, 58, 85, 25, 2, 2, 'F');
      doc.text(`Low Stock: ${lowStockProducts}`, 236.5, 73, null, null, 'center');
      
      // Prepare table data with better formatting
      const tableData = filteredProducts.map(product => [
        product.productID,
        product.pName,
        product.pCategory,
        product.pQuantity,
        `$${parseFloat(product.pPrice).toFixed(2)}`,
        product.status
      ]);
      
      // Add table with enhanced styling
      autoTable(doc, {
        head: [['Product ID', 'Name', 'Category', 'Quantity', 'Price', 'Status']],
        body: tableData,
        startY: 90,
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
        margin: { top: 90, bottom: 30 },
        didDrawCell: (data) => {
          // Add visual indicator for low stock items
          if (data.column.index === 3 && data.cell.raw < 5) {
            doc.setTextColor(220, 53, 69);
            doc.setFont(undefined, 'bold');
          } else {
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
          }
        }
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
      const fileName = `petverse-inventory-${date.replace(/\//g, '-')}.pdf`;
      doc.setProperties({
        title: 'PETVERSE Inventory Report',
        subject: 'Inventory Management Report',
        author: 'PETVERSE Admin System',
        keywords: 'inventory, products, stock, pet, petverse'
      });
      
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showNotification('Failed to export PDF. Please try again.', 'error');
    }
  };

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

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Manage pet store products and stock levels</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Low Stock Alerts */}
      {!loading && !error && (
        <div className="mb-6">
          {filteredProducts.filter(product => isLowStock(product.pQuantity)).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-red-800 font-medium">Low Stock Alert</h3>
              </div>
              <div className="mt-2 text-red-700">
                {filteredProducts.filter(product => isLowStock(product.pQuantity)).map(product => (
                  <span key={product._id} className="inline-block bg-red-100 px-2 py-1 rounded mr-2 mb-1 text-sm">
                    {product.pName} ({product.pQuantity} left)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter Section */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by product name, ID, or category (letters and numbers only)..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No products found. Add your first product!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.productID}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.pName}</div>
                        <div className="text-sm text-gray-500">{product.pDescription}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {product.pCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          isLowStock(product.pQuantity) ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {product.pQuantity}
                          {isLowStock(product.pQuantity) && (
                            <ExclamationTriangleIcon className="h-4 w-4 inline ml-1 text-red-500" />
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${product.pPrice}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleProductStatus(product.productID, product.status)}
                          className="cursor-pointer"
                        >
                          {getStatusBadge(product.status)}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Product"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.productID, product.pName)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Product"
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
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
            <form onSubmit={addProduct}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="productID"
                    placeholder="Product ID (letters and numbers only)"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.productID ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.productID}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.productID && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.productID}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="pName"
                    placeholder="Product Name (letters and numbers only)"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pName}</p>
                  )}
                </div>
                
                <div>
                  <textarea
                    name="pDescription"
                    placeholder="Product Description"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pDescription}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pDescription && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pDescription}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex">
                    <select
                      name="pCategory"
                      className={`flex-1 px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-orange-500 ${
                        formErrors.pCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={newProduct.pCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={openAddCategoryModal}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 focus:outline-none"
                      title="Add new category"
                    >
                      +
                    </button>
                  </div>
                  {formErrors.pCategory && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pCategory}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="number"
                    name="pPrice"
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pPrice}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pPrice && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pPrice}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="pQuantity"
                    placeholder="Quantity (numbers only)"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pQuantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pQuantity}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pQuantity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pQuantity}</p>
                  )}
                </div>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {newProduct.pImage && (
                    <div className="mt-2">
                      <img 
                        src={newProduct.pImage} 
                        alt="Preview" 
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Or enter image URL below
                  </p>
                </div>
                <input
                  type="text"
                  name="pImage"
                  placeholder="Image URL (optional if uploading file)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={newProduct.pImage && !newProduct.pImage.startsWith('data:') ? newProduct.pImage : ''}
                  onChange={handleInputChange}
                />
                <select 
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={newProduct.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setImageFile(null);
                    setFormErrors({});
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
            <form onSubmit={updateProduct}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="productID"
                    placeholder="Product ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    value={newProduct.productID}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="pName"
                    placeholder="Product Name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pName}</p>
                  )}
                </div>
                
                <div>
                  <textarea
                    name="pDescription"
                    placeholder="Product Description"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pDescription}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pDescription && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pDescription}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex">
                    <select
                      name="pCategory"
                      className={`flex-1 px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-orange-500 ${
                        formErrors.pCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={newProduct.pCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={openAddCategoryModal}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 focus:outline-none"
                      title="Add new category"
                    >
                      +
                    </button>
                  </div>
                  {formErrors.pCategory && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pCategory}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="number"
                    name="pPrice"
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pPrice}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pPrice && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pPrice}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="pQuantity"
                    placeholder="Quantity"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                      formErrors.pQuantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={newProduct.pQuantity}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.pQuantity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.pQuantity}</p>
                  )}
                </div>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {newProduct.pImage && (
                    <div className="mt-2">
                      <img 
                        src={newProduct.pImage} 
                        alt="Preview" 
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Or enter image URL below
                  </p>
                </div>
                <input
                  type="text"
                  name="pImage"
                  placeholder="Image URL (optional if uploading file)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={newProduct.pImage && !newProduct.pImage.startsWith('data:') ? newProduct.pImage : ''}
                  onChange={handleInputChange}
                />
                <select 
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={newProduct.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditImageFile(null);
                    setFormErrors({});
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={saveNewCategory}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategory('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;