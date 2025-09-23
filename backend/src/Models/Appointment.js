import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    appointment_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, ref: "User" },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    points_awarded: { type: Number, default: 0 },

    
    pet_name: { type: String, required: true },
    pet_type: { type: String, required: true }, 
    pet_breed: { type: String, required: true },
    note: { type: String }, 
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
