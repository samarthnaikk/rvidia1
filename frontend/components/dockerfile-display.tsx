"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface Dockerfile {
  id: number;
  name: string;
  content: string;
  createdAt: string;
}

interface DockerfileDisplayProps {
  adminId?: string;
  userId?: string;
}

export default function DockerfileDisplay({
  adminId,
  userId,
}: DockerfileDisplayProps) {
  const [dockerfiles, setDockerfiles] = useState<Dockerfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDockerfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if adminId or userId is provided
        if (!adminId && !userId) {
          setError("Admin ID or User ID is required to view Dockerfiles");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams();
        if (adminId) params.append("adminId", adminId);
        if (userId) params.append("userId", userId);

        const response = await fetch(
          `/api/docker/get-dockerfiles?${params.toString()}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch Dockerfiles");
        }

        setDockerfiles(data.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setDockerfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDockerfiles();
  }, [adminId, userId]);

  const handleCopy = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!adminId && !userId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 font-semibold">
          ⚠️ No Admin ID or User ID provided
        </p>
        <p className="text-yellow-700 text-sm mt-1">
          Dockerfiles are only visible to authenticated users
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-700 font-semibold">Loading Dockerfiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Error</p>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (dockerfiles.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-700 font-semibold">No Dockerfiles Found</p>
        <p className="text-gray-600 text-sm mt-1">
          You don't have any Dockerfiles yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dockerfiles.map((dockerfile) => (
        <div
          key={dockerfile.id}
          className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          {/* Header */}
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">{dockerfile.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Created: {new Date(dockerfile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleCopy(dockerfile.content, dockerfile.id)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {copiedId === dockerfile.id ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Content - Rectangle with scrollable text */}
          <div className="p-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg border border-gray-700 overflow-auto max-h-96 font-mono text-sm whitespace-pre-wrap break-words">
              {dockerfile.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
