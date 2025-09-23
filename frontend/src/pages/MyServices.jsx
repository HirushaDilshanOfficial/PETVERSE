// File: src/pages/MyServices.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";

// Currency formatter in Rs
const currency = (n) => {
  if (typeof n !== "number" || !isFinite(n)) return "-";
  return "Rs " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);
};

const MyServices = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  // Fetch services
  useEffect(() => {
    let mounted = true;

    const fetchServices = async () => {
      try {
        const res = await api.get("/api/services");
        if (!mounted) return;
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Services fetch error:", err);
        toast.error("Failed to load your services");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServices();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/api/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success("Service deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-20 text-base-content/70">
        No services found.
      </div>
    );
  }
//return
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Link
          to="/services/create/select"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-orange-500"
        >
          Add New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="card bg-base-100 border shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-lg">{service.title}</h2>
              <p className="text-sm text-base-content/70">{service.category || "-"}</p>
              <p className="text-sm text-base-content/70">{service.address || "-"}</p>
              <p className={`badge ${service.service_status === 'Active' ? 'bg-green-500' : 'bg-red-500'} mt-2`}>
                {service.service_status || "-"}
              </p>

              {/* Package-wise prices */}
              {Array.isArray(service.packages) && service.packages.length > 0 && (
                <div className="mt-3 space-y-1">
                  {service.packages.map((pkg, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{pkg.name || `Package ${idx + 1}`}</span>
                      <span className="font-semibold">{currency(pkg.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback: single price if no packages */}
              {!Array.isArray(service.packages) && typeof service.price === "number" && (
                <p className="mt-2 font-semibold">{currency(service.price)}</p>
              )}

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/services/${service._id}/edit`}
                  className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyServices;
