import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import api from "../lib/axios";

const TIERS = [
  { key: 'basic', label: 'Basic' },
  { key: 'premium', label: 'Premium' },
  { key: 'luxury', label: 'Luxury' },
];

// Validation functions
const validateTitle = (title) => {
  // Only allow letters and spaces
  return /^[a-zA-Z\s]*$/.test(title);
};

const validatePrice = (price) => {
  // Only allow numbers
  return /^\d*\.?\d*$/.test(price);
};

const validateDuration = (duration) => {
  // Allow letters and numbers only (no special characters)
  return /^[a-zA-Z0-9\s]*$/.test(duration);
};

const validateServiceIncluded = (service) => {
  // Allow letters and digits only
  return /^[a-zA-Z0-9\s]*$/.test(service);
};

//creating a service
const CreateService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]); // File[]
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [packages, setPackages] = useState(
    TIERS.map(t => ({ tier: t.label, price: '', duration: '', included: [], includeInput: '' }))
  );

  const previews = useMemo(() =>
    images.map(file => ({ name: file.name, url: URL.createObjectURL(file) })),
    [images]
  );

  useEffect(() => {
    return () => {
      // Revoke object URLs on unmount
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  // Handle title change with validation
  const handleTitleChange = (value) => {
    // Only allow letters and spaces
    if (!validateTitle(value)) return;
    setTitle(value);
    
    // Clear error when user starts typing
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // Handle price change with validation
  const handlePriceChange = (idx, value) => {
    // Only allow numbers and decimal point
    if (!validatePrice(value)) return;
    updatePackageField(idx, 'price', value);
    
    // Clear error when user starts typing
    const errorKey = `price-${idx}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Handle duration change with validation
  const handleDurationChange = (idx, value) => {
    // Allow letters and numbers only
    if (!validateDuration(value)) return;
    updatePackageField(idx, 'duration', value);
    
    // Clear error when user starts typing
    const errorKey = `duration-${idx}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Handle service included input change with validation
  const handleIncludeInputChange = (idx, value) => {
    // Allow letters and digits only
    if (!validateServiceIncluded(value)) return;
    updatePackageField(idx, 'includeInput', value);
    
    // Clear error when user starts typing
    const errorKey = `includeInput-${idx}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

//update pack
  const updatePackageField = (idx, field, value) => {
    setPackages(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addIncludedService = (idx) => {
    setPackages(prev => {
      const next = [...prev];
      const input = (next[idx].includeInput || '').trim();
      if (!input) return prev;
      
      // Validate service included before adding
      if (!validateServiceIncluded(input)) {
        const errorKey = `includeInput-${idx}`;
        setErrors(prev => ({ ...prev, [errorKey]: 'Service included can only contain letters and digits' }));
        return prev;
      }
      
      next[idx] = {
        ...next[idx],
        included: [...next[idx].included, input],
        includeInput: ''
      };
      return next;
    });
  };

  const removeIncludedService = (idx, itemIndex) => {
    setPackages(prev => {
      const next = [...prev];
      const filtered = next[idx].included.filter((_, i) => i !== itemIndex);
      next[idx] = { ...next[idx], included: filtered };
      return next;
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const newErrors = {};
  
  // Validate title
  if (!title.trim()) {
    newErrors.title = "Title is required";
  } else if (!validateTitle(title)) {
    newErrors.title = "Title can only contain letters and spaces";
  }
  
  // Validate packages
  packages.forEach((pkg, idx) => {
    // Validate price if provided
    if (pkg.price && !validatePrice(pkg.price)) {
      newErrors[`price-${idx}`] = "Price can only contain numbers";
    }
    
    // Validate duration if provided
    if (pkg.duration && !validateDuration(pkg.duration)) {
      newErrors[`duration-${idx}`] = "Duration can only contain letters and numbers";
    }
    
    // Validate includeInput if provided
    if (pkg.includeInput && !validateServiceIncluded(pkg.includeInput)) {
      newErrors[`includeInput-${idx}`] = "Service included can only contain letters and digits";
    }
  });
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    toast.error("Please fix the validation errors");
    return;
  }
  
  if (!title.trim() || !description.trim()) {
    toast.error("All fields are required");
    return;
  }

  setLoading(true);
  try {
    const payloadPackages = packages
      .filter(p => String(p.price).trim() !== '' && String(p.duration).trim() !== '')
      .map(p => {
        // include the typed input even if Add wasn't clicked
        const allServices = [...p.included];
        if (p.includeInput?.trim()) allServices.push(p.includeInput.trim());
        return {
          name: p.tier,
          price: Number(p.price),
          duration: String(p.duration),
          services: allServices
        };
      });

    // Create FormData to send files
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('category', category || '');
    formData.append('packages', JSON.stringify(payloadPackages));
    
    // Append image files
    images.forEach((file) => {
      formData.append('images', file);
    });

    await api.post("/api/services", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success("Service created successfully!");
    navigate("/dashboard/service-provider");
  } catch (error) {
    console.log('=== FRONTEND ERROR ===');
    console.log('Error creating service:', error);
    console.log('Error response:', error.response?.data);
    console.log('Error status:', error.response?.status);
    if (error.response?.data?.details) {
      console.log('Validation details:', error.response.data.details);
    }
    toast.error(error.response?.data?.message || "Failed to create service");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link to={"/dashboard/service-provider"} className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Dashboard
            </Link>
          </div>

          {!category && (
            <div className="alert mb-6 bg-white border border-yellow-500 text-yellow-700">
              <span>Please choose a category first.</span>
              <Link to="/services/create/select" className="btn btn-sm bg-blue-600 text-white hover:bg-orange-500">Choose Category</Link>
            </div>
          )}

          <div className="card bg-white border border-black shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-2xl">Create New Service</h2>
                {category && (
                  <div className="badge capitalize bg-blue-600 text-white px-6 py-3 text-lg">{category}</div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text text-black">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Service Title"
                      className={`input input-bordered bg-white border-black text-black placeholder-gray-500 ${errors.title ? 'input-error border-red-500' : ''}`}
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                    {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title}</span>}
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text text-black">Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City, Area"
                      className="input input-bordered bg-white border-black text-black placeholder-gray-500"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-black">Description</span>
                  </label>
                  <textarea
                    placeholder="Describe your service..."
                    className="textarea textarea-bordered bg-white border-black text-black placeholder-gray-500 h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-black">Images</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered bg-white border-black text-black file:border-0 file:bg-white file:text-black"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                  />
                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {previews.map((p) => (
                        <div key={p.url} className="avatar">
                          <div className="w-24 h-24 rounded">
                            <img src={p.url} alt={p.name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="divider text-black">Packages</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg, idx) => (
                    <div key={pkg.tier} className="card bg-white border border-black">
                      <div className="card-body gap-3">
                        <h3 className="card-title text-xl text-black">{pkg.tier}</h3>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-black">Price</span>
                          </label>
                          <input
                            type="text"
                            placeholder="0.00"
                            className={`input input-bordered bg-white border-black text-black placeholder-gray-500 ${errors[`price-${idx}`] ? 'input-error border-red-500' : ''}`}
                            value={pkg.price}
                            onChange={(e) => handlePriceChange(idx, e.target.value)}
                          />
                          {errors[`price-${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`price-${idx}`]}</span>}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-black">Duration</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 30 minutes, 1 day"
                            className={`input input-bordered bg-white border-black text-black placeholder-gray-500 ${errors[`duration-${idx}`] ? 'input-error border-red-500' : ''}`}
                            value={pkg.duration}
                            onChange={(e) => handleDurationChange(idx, e.target.value)}
                          />
                          {errors[`duration-${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`duration-${idx}`]}</span>}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-black">Services Included</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a service..."
                              className={`input input-bordered flex-1 bg-white border-black text-black placeholder-gray-500 ${errors[`includeInput-${idx}`] ? 'input-error border-red-500' : ''}`}
                              value={pkg.includeInput}
                              onChange={(e) => handleIncludeInputChange(idx, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addIncludedService(idx);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="flex items-center gap-1 text-black font-medium bg-white border border-black px-2 rounded hover:bg-gray-100"
                              onClick={() => addIncludedService(idx)}
                            >
                              <PlusIcon className="size-3" />
                              Add
                            </button>
                          </div>
                          {errors[`includeInput-${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`includeInput-${idx}`]}</span>}

                          {pkg.included.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {pkg.included.map((item, i) => (
                                <li key={`${pkg.tier}-${i}`} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-black">
                                  <span className="text-black">{item}</span>
                                  <button type="button" className="btn btn-ghost btn-xs text-black" onClick={() => removeIncludedService(idx, i)}>
                                    <Trash2Icon className="size-4" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className={`px-20 py-2 rounded-lg bg-white text-black border border-black hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;