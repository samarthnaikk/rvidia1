"use client";

import { useState } from "react";
import { Upload, AlertCircle, CheckCircle, FileUp } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filename, setFilename] = useState("Dockerfile");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      setFilename(file.name);
      const text = await file.text();
      setContent(text);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to read file";
      setError(`Error reading file: ${message}`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!filename || !content) {
      setError("Please fill in all fields");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/dockerfile/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          filename,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess("Dockerfile uploaded successfully! All users can now access it.");
      setFilename("Dockerfile");
      setContent("");

      // Reset form after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Upload Dockerfile</h1>
          <p className="text-gray-400 mt-2">
            Upload a Dockerfile that will be available to all users
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <form onSubmit={handleUpload} className="p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <AlertCircle className="text-red-400" size={20} />
                <div>
                  <p className="font-semibold text-red-300">Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                <CheckCircle className="text-green-400" size={20} />
                <div>
                  <p className="font-semibold text-green-300">Success</p>
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Select Dockerfile from Your System
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".dockerfile,.txt,text/plain"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-8 bg-gray-700 border-2 border-dashed border-gray-600 text-white rounded-lg hover:border-blue-500 hover:bg-gray-650 transition">
                  <FileUp size={20} className="text-gray-400" />
                  <div className="text-center">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">Dockerfile or text files</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Or manually enter the filename and content below
              </p>
            </div>

            {/* Filename Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Filename *
              </label>
              <input
                type="text"
                placeholder="e.g., Dockerfile, docker-compose.yml"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                The name of the file that users will download
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                File Content *
              </label>
              <textarea
                placeholder="Paste your Dockerfile content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Upload size={20} />
              {uploading ? "Uploading..." : "Upload Dockerfile"}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>ℹ️ Note:</strong> Uploading a new Dockerfile will replace the
            previous one. All users can view, copy, and download the current Dockerfile
            from their dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
