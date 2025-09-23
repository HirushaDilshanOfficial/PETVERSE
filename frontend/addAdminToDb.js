import { auth } from "./src/config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const addAdminToDatabase = async () => {
  try {
    console.log("🔧 Adding admin to database...");

    // Sign in to get the Firebase UID
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "admin@gmail.com",
      "123456"
    );

    const firebaseUser = userCredential.user;
    console.log("✅ Firebase UID obtained:", firebaseUser.uid);

    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    console.log("✅ Token obtained");

    // Register with backend as admin (direct database creation)
    const response = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fullName: "System Administrator",
        email: "admin@gmail.com",
        phoneNumber: "0771234567",
        role: "admin",
        firebaseUid: firebaseUser.uid,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Admin registered in database:", data.user.fullName);
      console.log("Role:", data.user.role);
      console.log("Email:", data.user.email);
      console.log("🎉 Admin account setup complete!");
      console.log("📧 You can now login with:");
      console.log("   Email: admin@gmail.com");
      console.log("   Password: 123456");
    } else {
      const errorData = await response.json();
      console.log("❌ Database registration failed:", errorData);
    }

    // Sign out after registration
    await auth.signOut();
    console.log("✅ Signed out");
  } catch (error) {
    console.error("❌ Error adding admin to database:", error.message);
  }
};

addAdminToDatabase();
