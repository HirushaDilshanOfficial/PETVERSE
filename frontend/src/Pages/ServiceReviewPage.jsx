import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import FeedbackSection from "../components/FeedbackSection";

const ServiceReviewPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to={`/service/${id}`} className="btn btn-ghost">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Service
          </Link>
        </div>

        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body">
            <h1 className="card-title text-2xl">Service Reviews</h1>
            <p className="text-base-content/70">Share your experience with this service</p>
            
            <div className="mt-6">
              <FeedbackSection serviceID={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReviewPage;