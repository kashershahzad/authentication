"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for submitting
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false); // Reset loading state

    if (res.ok) {
      router.push("/signin");
    } else {
      const errorData = await res.json(); // Handle error response from the API
      setError(errorData.error || "Signup failed!"); // Show error message from API
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600"
        />
        <button 
          type="submit" 
          className="w-full bg-green-500 p-2 mt-2" 
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Signing Up..." : "Sign Up"} {/* Show loading text */}
        </button>
        {/* Add "Already have an account? Sign in" link */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-green-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}