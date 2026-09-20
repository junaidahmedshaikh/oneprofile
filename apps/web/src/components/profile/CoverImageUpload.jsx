import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../../lib/profileApi";
import { Spinner } from "../ui/Spinner";
import { UploadCloud, X } from "lucide-react";

export function CoverImageUpload({ value, onChange }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const uploadMutation = useMutation({
    mutationFn: async (dataUri) => {
      const response = await profileApi.uploadCover({ dataUri });
      return response.data.data;
    },
    onSuccess: (data) => {
      onChange(data.coverImageUrl || "");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      setError("");
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to upload banner image");
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
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700 block select-none">
        Profile Cover Banner
      </label>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative h-44 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer select-none transition-all duration-200 overflow-hidden group ${
          isDragActive
            ? "border-[#163300] bg-[#9FE870]/15"
            : "border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50"
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
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={value}
              alt="Cover Banner Preview"
              className="absolute inset-0 h-full w-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="h-8.5 px-3.5 bg-[#163300] text-white rounded-xl text-xs font-bold flex items-center justify-center hover:bg-[#1f4700] active:scale-95 transition-all shadow-xs"
              >
                Replace Banner
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="h-8.5 px-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#163300] shadow-xs group-hover:scale-105 transition-all duration-200">
              <UploadCloud className="w-5 h-5 text-[#163300]" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              Drag & drop banner or <span className="text-[#163300] underline">browse</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              JPG, PNG, or WebP (Max 5MB)
            </span>
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
            <Spinner />
            <span className="text-xs font-bold uppercase tracking-widest text-[#163300] animate-pulse">
              Uploading Banner...
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>
      )}
    </div>
  );
}

