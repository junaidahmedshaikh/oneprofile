import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../../lib/profileApi";
import { Spinner } from "../ui/Spinner";
import { UploadCloud, X } from "lucide-react";

export function AvatarImageUpload({ value, onChange }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const uploadMutation = useMutation({
    mutationFn: async (dataUri) => {
      const response = await profileApi.uploadAvatar({ dataUri });
      return response.data.data;
    },
    onSuccess: (data) => {
      const newAvatarUrl = data.avatarUrl || data.logoUrl || "";
      onChange(newAvatarUrl);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setError("");
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to upload avatar image");
    },
  });

  const processFile = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      uploadMutation.mutate(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    setError("");
  };

  return (
    <div className="space-y-2">
      <label className="text-3xs font-bold text-slate-400 block uppercase tracking-wider h-5 flex items-center">
        Profile Avatar Photo
      </label>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative h-40 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer select-none transition-all duration-200 overflow-hidden group ${
          isDragActive
            ? "border-brand-400 bg-brand-500/[0.04]"
            : "border-white/[0.08] hover:border-white/20 bg-white/[0.01]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
        />

        {value ? (
          <div className="relative w-full h-full flex items-center justify-center gap-4">
            <img
              src={value}
              alt="Avatar Preview"
              className="h-28 w-28 object-cover rounded-2xl border-2 border-white/[0.12] shadow-md shrink-0"
            />
            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="h-8.5 px-3.5 bg-white text-slate-950 rounded-xl text-3xs font-bold hover:bg-slate-200 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="h-8.5 px-3.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-3xs font-bold hover:bg-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-10 w-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:scale-105 group-hover:border-white/10 transition-all duration-200">
              <UploadCloud className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-300">
              Drag & Drop Avatar or <span className="text-brand-400">Browse</span>
            </span>
            <span className="text-4xs text-slate-500">
              JPG, PNG, or WebP (Max 5MB)
            </span>
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-[#07080d]/90 flex flex-col items-center justify-center gap-2 z-10">
            <Spinner />
            <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
              Uploading Avatar...
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-3xs font-semibold text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
