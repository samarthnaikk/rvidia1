"use client";

import { useState, useEffect } from "react";
import { Copy, Download, AlertCircle, Loader2 } from "lucide-react";

interface Dockerfile {
  id: number;
  filename: string;
  content: string;
  createdAt: string;
  admin?: {
    id: number;
    name?: string;
    email?: string;
  };
}

export default function DockerfilesList() {
  const [dockerfiles, setDockerfiles] = useState<Dockerfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDockerfiles = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/dockerfile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Dockerfiles");
        }

        const data = await response.json();
        setDockerfiles(data.dockerfiles || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch Dockerfiles";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDockerfiles();
  }, []);

  const handleCopy = (id: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (dockerfile: Dockerfile) => {
    try {
      const response = await fetch(`/api/dockerfile/${dockerfile.id}/download`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = dockerfile.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-white/60" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
        <AlertCircle className="text-red-400" size={18} />
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (dockerfiles.length === 0) {
    return (
      <div className="p-4 text-center bg-white/5 border border-white/10 rounded-lg">
        <p className="text-white/60 text-sm">No Dockerfiles assigned yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dockerfiles.map((dockerfile) => (
        <div
          key={dockerfile.id}
          className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-white font-mono text-sm font-semibold">
                  {dockerfile.filename}
                </h4>
                <p className="text-white/60 text-xs mt-1">
                  {new Date(dockerfile.createdAt).toLocaleDateString()} at{" "}
                  {new Date(dockerfile.createdAt).toLocaleTimeString()}
                </p>
                {dockerfile.admin && (
                  <p className="text-white/50 text-xs mt-1">
                    From: {dockerfile.admin.name || dockerfile.admin.email}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(dockerfile.id, dockerfile.content)}
                  className="p-2 hover:bg-white/10 rounded transition text-white/60 hover:text-white"
                  title="Copy content"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleDownload(dockerfile)}
                  className="p-2 hover:bg-white/10 rounded transition text-white/60 hover:text-white"
                  title="Download file"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            {copiedId === dockerfile.id && (
              <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>
            )}
          </div>

          {/* Content Preview */}
          <div className="bg-black/40 p-4 max-h-64 overflow-auto">
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-words">
              {dockerfile.content}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}
