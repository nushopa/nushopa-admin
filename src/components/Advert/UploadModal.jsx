import { useState, useRef } from "react";
import { useUploadAdvertMutation } from "../../services/api";
import { toast } from "react-toastify";

export default function UploadModal({ onClose, onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const inputRef = useRef();

  const [uploadAdvert, { isLoading }] = useUploadAdvertMutation();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Choose an image file to upload.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleConfirm = async () => {
    if (!file) return;
    if (!title.trim()) {
      toast.error("Enter a title for this advert.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());

    try {
      const result = await uploadAdvert(formData).unwrap();
      onUpload(result.advert);
    } catch (error) {
      console.error("Advert upload failed:", error);
      toast.error(error?.data?.message || "Advert upload failed.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors text-lg leading-none"
        >
          ✕
        </button>

        <p className="text-[10px] tracking-[4px] text-amber-400 font-mono mb-2 uppercase">
          Upload
        </p>
        <h2
          className="text-2xl font-light text-zinc-100 mb-6"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Add an Image
        </h2>

        {/* Title Input */}
        <input
          type="text"
          aria-label="Advert title"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm"
        />

        {/* Dropzone */}
        <div
          className={`border-2 border-dashed rounded-xl flex items-center justify-center min-h-[180px] cursor-pointer transition-all duration-200 overflow-hidden
            ${
              dragging
                ? "border-amber-400 bg-amber-400/5"
                : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/40"
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="max-w-full max-h-52 object-contain rounded-lg"
            />
          ) : (
            <div className="text-center px-6 py-10">
              <div className="text-4xl text-amber-400 mb-3 leading-none">↑</div>
              <p className="text-zinc-400 text-sm mb-1">
                Drag & drop or{" "}
                <span className="text-amber-400 underline">browse</span>
              </p>
              <p className="text-zinc-600 text-[11px] tracking-[2px] font-mono mt-2">
                PNG · JPG · GIF · WEBP
              </p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-end">
          {preview && (
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
                setTitle("");
              }}
              className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs font-mono tracking-wider hover:border-zinc-500 hover:text-zinc-200 transition-all"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={!preview || !title.trim() || isLoading}
            className={`px-6 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium
              ${
                preview
                  ? "bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:-translate-y-0.5 shadow-lg shadow-amber-400/20 cursor-pointer"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
          >
            {isLoading ? "Uploading..." : "Upload Image →"}
          </button>
        </div>
      </div>
    </div>
  );
}
