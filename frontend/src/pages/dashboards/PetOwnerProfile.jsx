import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Custom SVG Icons
const User = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Mail = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Phone = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPin = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Plus = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const Edit2 = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Trash2 = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Save = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3-7-7" />
  </svg>
);

const X = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Check = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertCircle = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Loader = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Additional Icons for Sidebar
const Heart = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Calendar = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FileText = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Settings = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Mobile Menu Toggle
const Menu = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Sidebar Component
const Sidebar = ({ currentSection, onSectionChange, user, onLogout }) => {
  const menuItems = [
    { id: 'profile', label: 'Personal Information', icon: User },
    { id: 'pets', label: 'My Pets', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'medical', label: 'Medical Records', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">PetVerse</h2>
            <p className="text-blue-200 text-sm">Pet Owner Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info and Logout at Bottom */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-800 p-2 rounded-full">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.fullName || 'Pet Owner'}</p>
            <p className="text-xs text-blue-200 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const PetOwnerProfile = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  // Current section state for sidebar navigation
  const [currentSection, setCurrentSection] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [originalProfile, setOriginalProfile] = useState({...profile});
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Set profile data from user context when component mounts
  useEffect(() => {
    if (user) {
      const userProfile = {
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: user.address || ''
      };
      setProfile(userProfile);
      setOriginalProfile(userProfile);
    }
  }, [user]);

  // Pets state
  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: '3',
      weight: '65 lbs',
      vaccinated: true,
      notes: 'Very friendly and energetic'
    },
    {
      id: 2,
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian',
      age: '2',
      weight: '8 lbs',
      vaccinated: true,
      notes: 'Loves to nap in sunny spots'
    }
  ]);

  const [newPet, setNewPet] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: '',
    vaccinated: false,
    notes: ''
  });

  const [editingPet, setEditingPet] = useState(null);
  const [petErrors, setPetErrors] = useState({});
  const [isPetLoading, setIsPetLoading] = useState(false);

  const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'Reptile', 'Other'];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Only allow numbers, max 10 digits
    const cleanPhone = phone.replace(/\D/g, '');
    return /^\d*$/.test(cleanPhone) && cleanPhone.length <= 10;
  };

  // Add new validation function for full name
  const validateFullName = (name) => {
    // Only allow letters and spaces
    return /^[a-zA-Z\s]*$/.test(name);
  };

  // Profile handlers
  const handleProfileChange = (field, value) => {
    // Add validation for specific fields
    if (field === 'fullName' && !validateFullName(value)) return;
    if (field === 'phone') {
      // Only allow numbers and limit to 10 digits
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length > 10) return;
      value = cleanPhone;
    }
    
    setProfile(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfileSave = async () => {
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setIsProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOriginalProfile({...profile});
      setIsProfileEditing(false);
      setProfileErrors({});
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleProfileCancel = () => {
    setProfile({...originalProfile});
    setIsProfileEditing(false);
    setProfileErrors({});
    setProfileMessage({ type: '', text: '' });
  };

  // Pet handlers
  const handleNewPetChange = (field, value) => {
    setNewPet(prev => ({ ...prev, [field]: value }));
    if (petErrors[field]) {
      setPetErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddPet = async () => {
    const errors = validatePet(newPet);
    if (Object.keys(errors).length > 0) {
      setPetErrors(errors);
      return;
    }

    setIsPetLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const petToAdd = {
        ...newPet,
        id: Date.now()
      };
      
      setPets(prev => [...prev, petToAdd]);
      setNewPet({
        name: '',
        type: '',
        breed: '',
        age: '',
        weight: '',
        vaccinated: false,
        notes: ''
      });
      setPetErrors({});
    } catch (error) {
      console.error('Failed to add pet');
    } finally {
      setIsPetLoading(false);
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet({...pet});
  };

  const handleUpdatePet = async () => {
    const errors = validatePet(editingPet);
    if (Object.keys(errors).length > 0) {
      setPetErrors(errors);
      return;
    }

    setIsPetLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPets(prev => prev.map(pet => 
        pet.id === editingPet.id ? editingPet : pet
      ));
      setEditingPet(null);
      setPetErrors({});
    } catch (error) {
      console.error('Failed to update pet');
    } finally {
      setIsPetLoading(false);
    }
  };

  const handleRemovePet = async (petId) => {
    if (window.confirm('Are you sure you want to remove this pet?')) {
      setIsPetLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setPets(prev => prev.filter(pet => pet.id !== petId));
      } catch (error) {
        console.error('Failed to remove pet');
      } finally {
        setIsPetLoading(false);
      }
    }
  };

  const InputField = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    icon: Icon, 
    placeholder = '', 
    required = false,
    disabled = false
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        />
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options, 
    error, 
    placeholder = 'Select an option', 
    required = false,
    disabled = false
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  const Button = ({ 
    variant = 'primary', 
    size = 'md', 
    onClick, 
    disabled = false, 
    loading = false, 
    children, 
    icon: Icon,
    className = ''
  }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500',
      danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
    };
    
    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-sm min-h-[48px]',
      lg: 'px-6 py-4 text-base min-h-[52px]'
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
          disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin mr-2" />
        ) : Icon ? (
          <Icon className="w-4 h-4 mr-2" />
        ) : null}
        {children}
      </button>
    );
  };

  const validateProfile = () => {
    const errors = {};
    
    if (!profile.fullName.trim()) errors.fullName = 'Full name is required';
    else if (!validateFullName(profile.fullName)) errors.fullName = 'Full name can only contain letters';
    
    if (!profile.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(profile.email)) errors.email = 'Please enter a valid email address';
    
    if (!profile.phone.trim()) errors.phone = 'Phone number is required';
    else if (!validatePhone(profile.phone)) errors.phone = 'Phone number can only contain numbers and maximum 10 digits';
    
    if (!profile.address.trim()) errors.address = 'Address is required';

    return errors;
  };

  const validatePet = (pet) => {
    const errors = {};
    
    if (!pet.name.trim()) errors.name = 'Pet name is required';
    if (!pet.type) errors.type = 'Pet type is required';
    if (!pet.breed.trim()) errors.breed = 'Breed is required';
    if (!pet.age.trim()) errors.age = 'Age is required';
    else if (isNaN(pet.age)) errors.age = 'Age must be a number';

    return errors;
  };

  // Add logout handler
  const handleLogout = async () => {
    try {
      await signout();
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={(section) => {
            setCurrentSection(section);
            setIsMobileMenuOpen(false);
          }}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-semibold text-gray-800 ml-4 lg:ml-0">
                {currentSection === 'profile' && 'Profile Management'}
                {currentSection === 'pets' && 'Pet Management'}
                {currentSection === 'appointments' && 'Appointments'}
                {currentSection === 'medical' && 'Medical Records'}
                {currentSection === 'settings' && 'Settings'}
              </h1>
            </div>

            {/* Search Bar - Hidden on mobile for space */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <svg className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search pets, appointments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* User Avatar with real data */}
              <div className="flex items-center space-x-2">
                <div className="bg-orange-500 text-white p-2 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Pet Owner'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {currentSection === 'profile' && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    <div className="flex space-x-2">
                      {!isProfileEditing && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsProfileEditing(true)}
                          icon={Edit2}
                        >
                          Edit Profile
                        </Button>
                      )}
                      {/* Add Logout Button */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>

                  {profileMessage.text && (
                    <div className={`flex items-center space-x-2 p-4 rounded-lg mb-6 transition-all duration-300 ${
                      profileMessage.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {profileMessage.type === 'success' ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <span>{profileMessage.text}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <InputField
                      label="Full Name"
                      value={profile.fullName}
                      onChange={(value) => handleProfileChange('fullName', value)}
                      error={profileErrors.fullName}
                      icon={User}
                      disabled={!isProfileEditing}
                      required
                    />

                    <InputField
                      label="Email Address"
                      type="email"
                      value={profile.email}
                      onChange={(value) => handleProfileChange('email', value)}
                      error={profileErrors.email}
                      icon={Mail}
                      disabled={!isProfileEditing}
                      required
                    />

                    <InputField
                      label="Phone Number"
                      type="tel"
                      value={profile.phone}
                      onChange={(value) => handleProfileChange('phone', value)}
                      error={profileErrors.phone}
                      icon={Phone}
                      placeholder="Enter up to 10 digits"
                      disabled={!isProfileEditing}
                      required
                    />

                    <InputField
                      label="Address"
                      value={profile.address}
                      onChange={(value) => handleProfileChange('address', value)}
                      error={profileErrors.address}
                      icon={MapPin}
                      disabled={!isProfileEditing}
                      required
                    />
                  </div>

                  {isProfileEditing && (
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                      <Button
                        onClick={handleProfileSave}
                        loading={isProfileLoading}
                        icon={Save}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleProfileCancel}
                        icon={X}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Empty section to maintain grid layout */}
                <div></div>
              </div>
            </div>
          )}

          {/* Other sections placeholders */}
          {currentSection === 'pets' && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Pet List Section Header with Add Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Pets</h2>
                <Button
                  onClick={() => setIsAddPetModalOpen(true)}
                  icon={Plus}
                >
                  Add New Pet
                </Button>
              </div>

              {/* Pet List Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {pets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No pets added yet. Click "Add New Pet" to add your first pet!</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                      <div key={pet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-800">{pet.name}</h3>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditPet(pet)}
                              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemovePet(pet.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium">{pet.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Breed:</span>
                            <span className="font-medium">{pet.breed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Age:</span>
                            <span className="font-medium">{pet.age} years</span>
                          </div>
                          {pet.weight && (
                            <div className="flex justify-between">
                              <span>Weight:</span>
                              <span className="font-medium">{pet.weight}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Vaccinated:</span>
                            <span className={`font-medium ${pet.vaccinated ? 'text-green-600' : 'text-red-600'}`}>
                              {pet.vaccinated ? 'Yes' : 'No'}
                            </span>
                          </div>
                          {pet.notes && (
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs italic text-gray-500">{pet.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentSection === 'appointments' && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Appointments</h3>
                <p className="text-gray-600">Schedule and manage vet appointments...</p>
              </div>
            </div>
          )}

          {currentSection === 'medical' && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Medical Records</h3>
                <p className="text-gray-600">View and manage pet medical history...</p>
              </div>
            </div>
          )}

          {currentSection === 'settings' && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Settings</h3>
                <p className="text-gray-600">Manage account settings and preferences...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Pet Modal */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Pet</h3>
                <button
                  onClick={() => setIsAddPetModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Pet Name"
                  value={newPet.name}
                  onChange={(value) => handleNewPetChange('name', value)}
                  error={petErrors.name}
                  placeholder="Enter pet name"
                  required
                />

                <SelectField
                  label="Pet Type"
                  value={newPet.type}
                  onChange={(value) => handleNewPetChange('type', value)}
                  options={petTypes}
                  error={petErrors.type}
                  placeholder="Select pet type"
                  required
                />

                <InputField
                  label="Breed"
                  value={newPet.breed}
                  onChange={(value) => handleNewPetChange('breed', value)}
                  error={petErrors.breed}
                  placeholder="Enter breed"
                  required
                />

                <InputField
                  label="Age (years)"
                  type="number"
                  value={newPet.age}
                  onChange={(value) => handleNewPetChange('age', value)}
                  error={petErrors.age}
                  placeholder="Age in years"
                  required
                />

                <InputField
                  label="Weight (optional)"
                  value={newPet.weight}
                  onChange={(value) => handleNewPetChange('weight', value)}
                  placeholder="e.g., 25 lbs, 5 kg"
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="vaccinated"
                    checked={newPet.vaccinated}
                    onChange={(e) => handleNewPetChange('vaccinated', e.target.checked)}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="vaccinated" className="text-sm text-gray-700">
                    Vaccinations up to date
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={newPet.notes}
                    onChange={(e) => handleNewPetChange('notes', e.target.value)}
                    placeholder="Any additional information about your pet..."
                    rows="3"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleAddPet}
                  loading={isPetLoading}
                  icon={Plus}
                  className="flex-1"
                >
                  Add Pet
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddPetModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {editingPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Edit Pet Information</h3>
                <button
                  onClick={() => setEditingPet(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Pet Name"
                  value={editingPet.name}
                  onChange={(value) => setEditingPet({...editingPet, name: value})}
                  error={petErrors.name}
                  required
                />

                <SelectField
                  label="Pet Type"
                  value={editingPet.type}
                  onChange={(value) => setEditingPet({...editingPet, type: value})}
                  options={petTypes}
                  error={petErrors.type}
                  required
                />

                <InputField
                  label="Breed"
                  value={editingPet.breed}
                  onChange={(value) => setEditingPet({...editingPet, breed: value})}
                  error={petErrors.breed}
                  required
                />

                <InputField
                  label="Age (years)"
                  type="number"
                  value={editingPet.age}
                  onChange={(value) => setEditingPet({...editingPet, age: value})}
                  error={petErrors.age}
                  required
                />

                <InputField
                  label="Weight (optional)"
                  value={editingPet.weight}
                  onChange={(value) => setEditingPet({...editingPet, weight: value})}
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="edit-vaccinated"
                    checked={editingPet.vaccinated}
                    onChange={(e) => setEditingPet({...editingPet, vaccinated: e.target.checked})}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="edit-vaccinated" className="text-sm text-gray-700">
                    Vaccinations up to date
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={editingPet.notes}
                    onChange={(e) => setEditingPet({...editingPet, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleUpdatePet}
                  loading={isPetLoading}
                  icon={Save}
                  className="flex-1"
                >
                  Update Pet
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditingPet(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetOwnerProfile;