import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// Firebase imports
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import app from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to check if user is a pet owner
export const isPetOwner = (user) => {
  return user && user.role === "petOwner"; // Note: role is "petOwner" with capital O
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  // Initialize Firebase auth
  const auth = getAuth(app);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Sign in user with email and password
  const signin = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Set token in axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      // Fetch user data from backend
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Set user data
      setUser(res.data.user || null);
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signout = async () => {
    try {
      await firebaseSignOut(auth);
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Fetch logged-in user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if user is signed in with Firebase
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Get Firebase ID token
          const idToken = await currentUser.getIdToken();

          // Set token in axios default headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

          // Fetch user data from backend
          const res = await axios.get(`${API_BASE_URL}/auth/me`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          setUser(res.data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        signin,
        signout,
        clearError,
        isPetOwner: (user) => isPetOwner(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
