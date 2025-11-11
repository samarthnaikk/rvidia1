"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Download } from "lucide-react";

interface Dockerfile {
  id: number;
  filename: string;
  content: string;
  createdAt: string;
}

interface DockerfileDisplayProps {
  userId?: string;
}

export default function DockerfileDisplay({
  userId,
}: DockerfileDisplayProps) {
  const [dockerfile, setDockerfile] = useState<Dockerfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDockerfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the single Dockerfile from admin
        const response = await fetch("/api/dockerfile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setDockerfile(null);
          } else {
            throw new Error(data.error || "Failed to fetch Dockerfile");
          }
        } else {
          setDockerfile(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setDockerfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDockerfile();
  }, []);

  const handleCopy = () => {
    if (dockerfile) {
      navigator.clipboard.writeText(dockerfile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!dockerfile) return;
    
    try {
      setDownloading(true);
      const response = await fetch(`/api/dockerfile/${dockerfile.id}/download`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download Dockerfile");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = dockerfile.filename || "Dockerfile";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download Dockerfile");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto mb-2"></div>
          <p className="text-white/60 text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-900/20 border border-red-400/30 rounded text-center">
        <p className="text-red-300 text-xs font-semibold">Error</p>
        <p className="text-red-200 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (!dockerfile) {
    return (
      <div className="p-3 bg-yellow-900/20 border border-yellow-400/30 rounded text-center">
        <p className="text-yellow-300 text-xs font-semibold">No Dockerfile Available</p>
        <p className="text-yellow-200 text-xs mt-1">
          Admin hasn't uploaded a Dockerfile yet
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with buttons */}
      <div className="flex justify-between items-start gap-2 mb-3 pb-3 border-b border-white/10">
        <div className="min-w-0">
          <h4 className="text-white text-xs font-semibold truncate">
            {dockerfile.filename || "Dockerfile"}
          </h4>
          <p className="text-white/40 text-xs mt-0.5">
            {new Date(dockerfile.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600/60 hover:bg-blue-600 text-white rounded text-xs transition"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1 px-2 py-1 bg-purple-600/60 hover:bg-purple-600 text-white rounded text-xs transition disabled:opacity-50"
            title="Download Dockerfile"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content - Scrollable text */}
      <div className="flex-1 overflow-auto">
        <div className="bg-gray-950 text-green-300 p-2 rounded font-mono text-xs whitespace-pre-wrap break-words h-full overflow-auto leading-relaxed">
          {dockerfile.content}
        </div>
      </div>
    </div>
  );
}
