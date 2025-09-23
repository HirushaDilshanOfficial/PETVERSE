import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

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

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [packages, setPackages] = useState([]);

  // Fetch service data
  useEffect(() => {
    let mounted = true;

    const fetchService = async () => {
      try {
        const res = await api.get(`/api/services/${id}`);
        const s = res?.data;
        if (!mounted || !s) return;

        setTitle(s.title || "");
        setDescription(s.description || "");
        setAddress(s.address || "");

        if (Array.isArray(s.packages) && s.packages.length > 0) {
          // Map backend packages directly
          setPackages(
            s.packages.map((p) => ({
              tier: p.name || "Package",
              price: p.price || "",
              duration: p.duration || "",
              included: Array.isArray(p.services) ? p.services : [],
              includeInput: "",
            }))
          );
        } else {
          setPackages([]);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load service");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchService();

    return () => {
      mounted = false;
    };
  }, [id]);

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
    updatePackageField(idx, "price", value);
    
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
    updatePackageField(idx, "duration", value);
    
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
    updatePackageField(idx, "includeInput", value);
    
    // Clear error when user starts typing
    const errorKey = `includeInput-${idx}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const updatePackageField = (idx, field, value) => {
    setPackages((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addIncludedService = (idx) => {
    setPackages((prev) => {
      const next = [...prev];
      const input = (next[idx].includeInput || "").trim();
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
        includeInput: "",
      };
      return next;
    });
  };

  const removeIncludedService = (idx, itemIndex) => {
    setPackages((prev) => {
      const next = [...prev];
      const filtered = next[idx].included.filter((_, i) => i !== itemIndex);
      next[idx] = { ...next[idx], included: filtered };
      return next;
    });
  };

  const onSave = async (e) => {
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
    
    if (!title.trim()) return toast.error("Title required");

    const payloadPackages = packages
      .filter(
        (p) =>
          String(p.price).trim() !== "" && String(p.duration).trim() !== ""
      )
      .map((p) => ({
        name: p.tier,
        price: Number(p.price),
        duration: String(p.duration),
        services: Array.isArray(p.included) ? p.included : [],
      }));

    setSaving(true);
    try {
      await api.put(`/api/services/${id}`, {
        title,
        description,
        address,
        packages: payloadPackages,
      });
      toast.success("Service updated");
      navigate("/dashboard/service-provider/my-services");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <Link to="/dashboard/service-provider/my-services" className="btn">
          Back
        </Link>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="form-control">
          <label className="label">Title</label>
          <input
            className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title}</span>}
        </div>

        <div className="form-control">
          <label className="label">Description</label>
          <textarea
            className="textarea textarea-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">Address</label>
          <input
            className="input input-bordered"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
{/* Packages Section */}
        {/* Packages Section */}
        <div className="divider">Packages</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div key={`${pkg.tier}-${idx}`} className="rounded-xl bg-gray-100 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">{pkg.tier}</h3>

              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="text"
                  placeholder="0.00"
                  className={`input input-bordered ${errors[`price-${idx}`] ? 'input-error' : ''}`}
                  value={pkg.price}
                  onChange={(e) =>
                    handlePriceChange(idx, e.target.value)
                  }
                />
                {errors[`price-${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`price-${idx}`]}</span>}
              </div>

              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text">Duration</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30 minutes, 1 day"
                  className={`input input-bordered ${errors[`duration-${idx}`] ? 'input-error' : ''}`}
                  value={pkg.duration}
                  onChange={(e) =>
                    handleDurationChange(idx, e.target.value)
                  }
                />
                {errors[`duration-${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`duration-${idx}`]}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Services Included</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a service..."
                    className={`input input-bordered flex-1 ${errors[`includeInput-${idx}`] ? 'input-error' : ''}`}
                    value={pkg.includeInput}
                    onChange={(e) =>
                      handleIncludeInputChange(idx, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIncludedService(idx);
                      }
                    }}
                  />
                </div>
                {errors[`includeInput-${idx}`] && <span className="text-red-500 text-sm mt-1">{errors[`includeInput-${idx}`]}</span>}

                {pkg.included.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {pkg.included.map((item, i) => (
                      <li
                        key={`${pkg.tier}-${i}`}
                        className="flex items-center justify-between bg-white px-3 py-2 rounded-md shadow-sm"
                      >
                        <span className="text-sm">{item}</span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-red-500"
                          onClick={() => removeIncludedService(idx, i)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-outline mt-2"
                  onClick={() => addIncludedService(idx)}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className={`btn btn-sm btn-outline border-blue-600 text-white bg-blue-600 hover:bg-orange-500 hover:border-orange-500 ${
              saving ? "btn-disabled" : ""
            }`}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditService;