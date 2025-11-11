"use client";

import { useAuthContext } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import DockerfileDisplay from "@/components/dockerfile-display";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Shield } from "lucide-react";

interface AdminInfo {
  id: number;
  name?: string;
  email?: string;
}

export default function UserDashboard() {
  const { isAuthenticated, user, loading } = useAuthContext();
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to signin");
      router.push("/signin");
      return;
    }

    // If user is admin, redirect to admin dashboard
    if (user?.role === "ADMIN" || user?.role === "admin") {
      console.log("Admin user detected, redirecting to admin dashboard");
      router.push("/admin");
      return;
    }
  }, [isAuthenticated, user, loading, router]);

  // Fetch admin info from the Dockerfile endpoint
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        setAdminLoading(true);
        const response = await fetch("/api/dockerfile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.admin) {
            setAdminInfo(data.admin);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      } finally {
        setAdminLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAdminInfo();
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white/60 mb-4">Redirecting to sign in...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />

      <main className="pt-24 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white">
            <h2
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
              style={{ fontFamily: "Lato, sans-serif", fontWeight: "400" }}
            >
              Dashboard
            </h2>
          </div>

          {/* Main Content: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column: ID Cards */}
            <div className="space-y-4">
              {/* User ID Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-400" />
                  <h3
                    className="text-xs font-medium text-white/80 uppercase tracking-wide"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    Your ID
                  </h3>
                </div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {user?.id || "—"}
                </div>
              </div>

              {/* Admin ID Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <h3
                    className="text-xs font-medium text-white/80 uppercase tracking-wide"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    Admin ID
                  </h3>
                </div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {adminLoading ? "..." : adminInfo?.id || "—"}
                </div>
                {adminInfo?.name && (
                  <p
                    className="text-xs text-white/60 mt-2"
                    style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                  >
                    {adminInfo.name}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Dockerfile Display */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 h-full">
                <h3
                  className="text-sm font-semibold text-white mb-3 uppercase tracking-wide"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Dockerfile
                </h3>
                <div className="bg-black/40 rounded-lg p-3 h-96 overflow-auto border border-white/10">
                  <DockerfileDisplay userId={user?.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
