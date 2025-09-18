import { verifyIdToken } from "../Config/firebase.js";
import User from "../Models/User.js";

// Middleware to authenticate user using Firebase ID token
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          'No token provided or invalid format. Please provide token as "Bearer <token>"',
      });
    }

    // Extract token
    const idToken = authHeader.split(" ")[1];

    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);

    // Find user in database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is deactivated",
      });
    }

    // Check if service provider is verified (only service providers need verification)
    if (user.role === "serviceProvider") {
      if (user.verification?.isRejected) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been rejected. Please contact support@petverse.com for assistance.",
        });
      }

      if (!user.verification?.isVerified) {
        return res.status(403).json({
          success: false,
          message:
            "Your account is not verified. Please contact support@petverse.com for verification.",
        });
      }
    }

    // Attach user info to request object
    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      role: user.role,
      userId: user._id,
      isVerified:
        user.role === "serviceProvider" ? user.verification.isVerified : true,
      userData: user,
    };

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    // Handle specific Firebase Auth errors
    if (error.message.includes("expired")) {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (error.message.includes("Invalid")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

// Middleware to authorize specific roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        success: false,
        message: "Authorization check failed",
        error: error.message,
      });
    }
  };
};

// Middleware to ensure service provider is verified
export const requireVerifiedServiceProvider = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "serviceProvider") {
      return res.status(403).json({
        success: false,
        message: "Only service providers can access this resource",
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Service provider verification required",
      });
    }

    next();
  } catch (error) {
    console.error("Service provider verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification check failed",
      error: error.message,
    });
  }
};

// Middleware to ensure user can only access their own resources
export const requireResourceOwnership = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Allow admins to access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // For other users, check if they're accessing their own resource
    const resourceUserId = req.params.userId || req.body.userId;

    if (resourceUserId && resourceUserId !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own resources",
      });
    }

    next();
  } catch (error) {
    console.error("Resource ownership error:", error);
    return res.status(500).json({
      success: false,
      message: "Resource ownership check failed",
      error: error.message,
    });
  }
};

// Middleware for admin-only access
export const requireAdmin = authorizeRoles("admin");

// Middleware for service provider access (verified or unverified)
export const requireServiceProvider = authorizeRoles("serviceProvider");

// Middleware for pet owner access
export const requirePetOwner = authorizeRoles("petOwner");

// Middleware for authenticated users (any role)
export const requireAuth = authenticateUser;

export default {
  authenticateUser,
  authorizeRoles,
  requireVerifiedServiceProvider,
  requireResourceOwnership,
  requireAdmin,
  requireServiceProvider,
  requirePetOwner,
  requireAuth,
};
