# PETVERSE - Pet Care Platform

A comprehensive role-based authentication system for a pet care platform connecting pet owners with verified service providers.

## 🚀 Features

### Authentication System

- **Role-based signup**: Pet Owner, Service Provider, and Admin roles
- **Firebase Authentication**: Secure email/password authentication with forgot password functionality
- **Document Verification**: Service providers must upload NIC, face photo, and business documents
- **Protected Routes**: Role-based access control throughout the application

### Technology Stack

#### Frontend

- **React 19** with JSX (no TypeScript)
- **Vite** for fast development and bundling
- **Tailwind CSS** via CDN for responsive styling
- **React Router** for navigation
- **Firebase SDK** for authentication
- **Cloudinary** for file uploads

#### Backend

- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **Firebase Admin SDK** for server-side authentication
- **Cloudinary** for image/document storage
- **Mongoose** for database modeling
- **Multer** for file upload handling
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** (v8 or higher)
3. **MongoDB Atlas** account
4. **Firebase** project with Authentication enabled
5. **Cloudinary** account for file storage
6. **Upstash Redis** for rate limiting (optional)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PETVERSE
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Update `.env` with your actual values from Firebase Console and other services.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5001`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📱 User Roles

### Pet Owner

- Simple registration with basic details
- Access to find and book pet services
- Manage pet profiles and appointments

### Service Provider

- Two-step registration process
- Document upload requirement (NIC, face photo, business documents)
- Admin verification required before full access
- Manage services, bookings, and earnings

### Admin

- Full platform access
- User management and verification
- Platform analytics and oversight

## 🛡️ Security Features

- **Firebase Authentication** for secure user management
- **JWT token verification** on backend
- **Role-based access control** with middleware
- **File upload validation** with size and type restrictions
- **Rate limiting** to prevent abuse
- **Environment variables** for sensitive configuration

## 🎨 UI/UX Features

- **Responsive design** with Tailwind CSS
- **Consistent color scheme**: Blue (#1E40AF) and Orange (#F97316)
- **Font Awesome icons** for visual elements
- **Loading states** and error handling
- **Form validation** with helpful error messages

---

**Note**: This is a complete authentication system ready for production use. Make sure to configure all environment variables properly before deployment.
