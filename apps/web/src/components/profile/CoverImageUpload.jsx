import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../../lib/profileApi";
import { Spinner } from "../ui/Spinner";

export function CoverImageUpload({ value, onChange }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

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
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, or WebP)");
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadMutation.mutate(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-semibold text-slate-300 block">
        Profile Cover Banner
      </label>
      
      <div className="relative h-28 w-full rounded-2xl bg-white/[0.01] border border-white/[0.08] overflow-hidden group flex items-center justify-center">
        {value ? (
          <>
            <img
              src={value}
              alt="Cover Banner Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <label className="h-8.5 px-3 bg-white text-slate-950 rounded-xl text-3xs font-bold flex items-center justify-center cursor-pointer hover:bg-slate-200 select-none active:scale-95 transition-all">
                Replace Banner
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={uploadMutation.isPending}
                />
              </label>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploadMutation.isPending}
                className="h-8.5 px-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-3xs font-bold hover:bg-red-500/30 select-none active:scale-95 transition-all"
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center p-4 text-center hover:bg-white/[0.02] select-none transition-all">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="sr-only"
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
            />
            <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-md text-slate-400 group-hover:border-white/10 transition-colors">
              🖼️
            </div>
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 mt-2">
              Upload Cover Banner
            </span>
            <span className="text-4xs text-slate-500 mt-1">
              Supports JPG, PNG, WebP (Max 5MB)
            </span>
          </label>
        )}

        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-[#090a0f]/80 flex flex-col items-center justify-center gap-2">
            <Spinner />
            <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
              Uploading Banner...
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-3xs text-red-400 font-semibold">{error}</p>
      )}
    </div>
  );
}
