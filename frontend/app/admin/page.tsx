"use client";

import { useAuthContext } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Shield, Upload } from "lucide-react";

interface ConnectedUser {
  id: number;
  email: string;
  username: string;
  name?: string;
}

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (user.role?.toLowerCase() !== "admin" && !isAdmin))) {
      router.push("/dashboard");
      return;
    }
  }, [loading, user, isAdmin, router]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await fetch("/api/users", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    if (user && (user.role?.toLowerCase() === "admin" || isAdmin)) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role?.toLowerCase() !== "admin" && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">Access Denied</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
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
              Admin Dashboard
            </h2>
          </div>

          {/* Admin Info & Connected Users */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column: Admin ID Card */}
            <div className="space-y-4">
              {/* Admin ID Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <h3
                    className="text-xs font-medium text-white/80 uppercase tracking-wide"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    Your Admin ID
                  </h3>
                </div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {user?.id || "—"}
                </div>
                {user?.name && (
                  <p
                    className="text-xs text-white/60 mt-2"
                    style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                  >
                    {user.name}
                  </p>
                )}
              </div>

              {/* Users Count Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-400" />
                  <h3
                    className="text-xs font-medium text-white/80 uppercase tracking-wide"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    Total Users
                  </h3>
                </div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {usersLoading ? "..." : users.length}
                </div>
              </div>
            </div>

            {/* Right Column: Connected Users List & Upload Button */}
            <div className="lg:col-span-3 space-y-4">
              {/* Upload Dockerfile Button */}
              <a
                href="/admin/dockerfiles"
                className="block w-full"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3
                        className="text-white font-semibold text-sm"
                        style={{ fontFamily: "Lato, sans-serif" }}
                      >
                        Upload Dockerfile
                      </h3>
                      <p
                        className="text-white/70 text-xs"
                        style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                      >
                        Upload a new Dockerfile for all users
                      </p>
                    </div>
                  </div>
                </div>
              </a>

              {/* Connected Users List */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h3
                  className="text-sm font-semibold text-white mb-3 uppercase tracking-wide"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Connected Users
                </h3>

                {usersLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-white/60 text-xs text-center py-4">
                    No users found
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="bg-black/20 rounded p-3 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p
                              className="text-white text-xs font-semibold truncate"
                              style={{ fontFamily: "Lato, sans-serif" }}
                            >
                              {u.name || u.username || "User"}
                            </p>
                            <p
                              className="text-white/60 text-xs truncate"
                              style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                            >
                              {u.email}
                            </p>
                          </div>
                          <div className="bg-blue-600/20 px-2 py-1 rounded border border-blue-400/30 flex-shrink-0">
                            <p
                              className="text-blue-300 text-xs font-mono"
                              style={{ fontFamily: "monospace" }}
                            >
                              ID: {u.id}
                            </p>
                          </div>
                        </div>
            {/* Placeholder for future components */}
                                  </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
