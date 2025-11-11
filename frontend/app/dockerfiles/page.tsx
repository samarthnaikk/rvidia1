"use client";

import { useAuth } from "@/hooks/use-auth";
import DockerfileDisplay from "@/components/dockerfile-display";
import { redirect } from "next/navigation";

export default function DockerfilesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dockerfiles</h1>
          <p className="text-gray-600 mt-2">
            View and copy your Docker configurations
          </p>
        </div>

        {/* Pass user/admin ID to the component */}
        <DockerfileDisplay
          adminId={user.role === "ADMIN" ? String(user.id) : undefined}
          userId={user.role === "USER" ? String(user.id) : undefined}
        />
      </div>
    </div>
  );
}
