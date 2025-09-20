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
    navigate("/");
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
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Services
            </Link>
          </div>

          {!category && (
            <div className="alert alert-warning mb-6">
              <span>Please choose a category first.</span>
              <Link to="/create/select" className="btn btn-sm">Choose Category</Link>
            </div>
          )}

          <div className="card bg-base-100 shadow">
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
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Service Title"
                      className="input input-bordered"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City, Area"
                      className="input input-bordered"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Describe your service..."
                    className="textarea textarea-bordered h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Images</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered"
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

                <div className="divider">Packages</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg, idx) => (
                    <div key={pkg.tier} className="card bg-base-200">
                      <div className="card-body gap-3">
                        <h3 className="card-title text-xl">{pkg.tier}</h3>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Price</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            className="input input-bordered"
                            value={pkg.price}
                            onChange={(e) => updatePackageField(idx, 'price', e.target.value)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Duration</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 30 minutes, 1 day"
                            className="input input-bordered"
                            value={pkg.duration}
                            onChange={(e) => updatePackageField(idx, 'duration', e.target.value)}
                          />
                       

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Services Included</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a service..."
                              className="input input-bordered flex-1"
                              value={pkg.includeInput}
                              onChange={(e) => updatePackageField(idx, 'includeInput', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addIncludedService(idx);
                                }
                              }}
                            />
                             </div>
                            <button
                              type="button"
                              className="flex items-center gap-1 text-black font-medium"
                              onClick={() => addIncludedService(idx)}
                            >
                              <PlusIcon className="size-3" />
                              Add
                            </button>
                          </div>

                          {pkg.included.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {pkg.included.map((item, i) => (
                                <li key={`${pkg.tier}-${i}`} className="flex items-center justify-between bg-base-100 px-3 py-2 rounded">
                                  <span className="text-sm">{item}</span>
                                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => removeIncludedService(idx, i)}>
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
                  <button type="submit" className={`px-20 py-2 rounded-lg bg-blue-600 text-white hover:bg-orange-500 hover:scale-105 transform transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
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
