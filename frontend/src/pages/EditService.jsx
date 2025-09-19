import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      navigate("/my-services");
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
        <Link to="/my-services" className="btn">
          Back
        </Link>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="form-control">
          <label className="label">Title</label>
          <input
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="input input-bordered"
                  value={pkg.price}
                  onChange={(e) =>
                    updatePackageField(idx, "price", e.target.value)
                  }
                />
              </div>

              <div className="form-control mb-3">
                <label className="label">
                  <span className="label-text">Duration</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30 minutes, 1 day"
                  className="input input-bordered"
                  value={pkg.duration}
                  onChange={(e) =>
                    updatePackageField(idx, "duration", e.target.value)
                  }
                />
              </div>

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
                    onChange={(e) =>
                      updatePackageField(idx, "includeInput", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIncludedService(idx);
                      }
                    }}
                  />
                </div>

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
