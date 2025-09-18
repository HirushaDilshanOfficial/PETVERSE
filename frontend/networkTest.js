// Simple network test to debug the "Failed to fetch" issue

const testNetworkConnections = async () => {
  console.log("🌐 Testing network connections...");

  const endpoints = [
    "http://localhost:4000/health",
    "http://localhost:4000/api/auth/health",
    "http://localhost:4000/api/auth/register",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: endpoint.includes("register") ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...(endpoint.includes("register") && {
          body: JSON.stringify({
            fullName: "Network Test",
            email: "networktest@example.com",
            phoneNumber: "0771234567",
            role: "petOwner",
            firebaseUid: "network-test-uid",
          }),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Success:", response.status);
        console.log("📄 Response:", JSON.stringify(data, null, 2));
      } else {
        console.log("❌ Failed:", response.status, response.statusText);
        const text = await response.text();
        console.log("📄 Error:", text);
      }
    } catch (error) {
      console.log("❌ Network Error:", error.message);

      // Check specific error types
      if (error.message.includes("fetch")) {
        console.log(
          "🔍 This is a fetch error - likely CORS or connection issue"
        );
      }
      if (error.message.includes("NetworkError")) {
        console.log("🔍 This is a network error - backend might be down");
      }
    }
  }
};

// Test from browser environment
if (typeof window !== "undefined") {
  window.testNetwork = testNetworkConnections;
  console.log("💡 Run 'testNetwork()' in browser console to test");
}

export default testNetworkConnections;
