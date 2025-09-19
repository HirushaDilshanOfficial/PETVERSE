import React, { createContext, useContext, useState, useEffect } from "react";
// Firebase imports - now enabled with real configuration
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Register new user with Firebase
  const signup = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting signup process for:", email);

      // Create user with Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      console.log("Firebase user created successfully:", firebaseUser.uid);

      // Get fresh Firebase ID token
      const idToken = await firebaseUser.getIdToken(true);
      console.log("Firebase token obtained, length:", idToken.length);

      // Prepare backend registration data
      const registrationData = {
        ...userData,
        email: email,
        firebaseUid: firebaseUser.uid,
      };
      console.log("Sending registration data:", {
        ...registrationData,
        firebaseUid: "HIDDEN",
      });

      // Send user data to backend for profile creation
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Backend registration failed:",
          response.status,
          errorText
        );
        throw new Error(
          `Failed to create user profile: ${response.status} - ${errorText}`
        );
      }

      const backendResponse = await response.json();
      console.log(
        "Backend registration successful:",
        backendResponse.user.fullName
      );
      setUserProfile(backendResponse.user);

      return { firebaseUser, backendUser: backendResponse.user };
    } catch (err) {
      console.error("Signup error:", err);

      // Provide specific error messages
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Network error: Cannot connect to server. Please check if the backend is running."
        );
      } else if (err.message.includes("email-already-in-use")) {
        setError(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else if (err.message.includes("weak-password")) {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(err.message);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in user with Firebase
  const signin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Attempting to sign in:", email);

      // Clear any existing auth state first
      setCurrentUser(null);
      setUserProfile(null);

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      console.log("Firebase signin successful:", firebaseUser.uid);

      // Force refresh the token to ensure it's fresh
      const idToken = await firebaseUser.getIdToken(true);
      console.log("Token obtained, length:", idToken.length);

      // Get user profile from backend
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Backend profile fetch failed:",
          response.status,
          errorText
        );
        throw new Error(`Failed to get user profile: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile fetch successful:", data);
      console.log("User role:", data.user.role);
      setUserProfile(data.user);
      setCurrentUser(firebaseUser);

      return firebaseUser;
    } catch (err) {
      console.error("Signin error:", err);
      setError(err.message);

      // Clear any partial auth state on error
      setCurrentUser(null);
      setUserProfile(null);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user with Firebase
  const signout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password with Firebase
  const forgotPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: "Password reset email sent successfully!",
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Upload documents (MOCK)
  const uploadDocuments = async (files) => {
    try {
      setError(null);
      console.log("Mock document upload:", Object.keys(files));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        message: "Documents uploaded successfully! (Mock)",
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Helper functions
  const isAuthenticated = () => currentUser !== null;
  const hasRole = (role) => userProfile?.role === role;
  const getDisplayName = () =>
    userProfile?.fullName || currentUser?.email || "User";
  const getUserRole = () => userProfile?.role || null;

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);

        // Get user profile from backend
        try {
          // Force refresh token to ensure it's valid
          const idToken = await firebaseUser.getIdToken(true);

          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Profile data received:", data);
            setUserProfile(data.user);
          } else {
            console.error("Failed to fetch profile, status:", response.status);
            const errorText = await response.text();
            console.error("Error details:", errorText);

            // If profile fetch fails, clear the auth state
            setCurrentUser(null);
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Clear auth state on error
          setCurrentUser(null);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signin,
    signup,
    signout,
    forgotPassword,
    uploadDocuments,
    loading,
    error,
    isAuthenticated,
    hasRole,
    getDisplayName,
    getUserRole,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
