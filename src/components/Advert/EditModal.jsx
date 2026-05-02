import { useState, useRef } from "react";
import { useEditAdvertMutation } from "../../services/api";

const EditModal = ({ advert, onClose, onSave }) => {
  const [title, setTitle] = useState(advert.title);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(advert.imageUrl);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const [editAdvert, { isLoading }] = useEditAdvertMutation();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
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

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    if (file) formData.append("file", file);

    try {
      await editAdvert({ id: advert._id, data: formData }).unwrap();
      onSave();
      onClose();
    } catch (err) {
      console.error("Edit failed:", err);
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors text-lg leading-none"
        >
          ✕
        </button>

        <p className="text-[10px] tracking-[4px] text-amber-400 font-mono mb-2 uppercase">
          Edit
        </p>
        <h2
          className="text-2xl font-light text-zinc-100 mb-6"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Edit Advert
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title..."
          className="w-full mb-4 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm"
        />

        <div
          className={`border-2 border-dashed rounded-xl flex items-center justify-center min-h-[180px] cursor-pointer transition-all duration-200 overflow-hidden
            ${dragging
              ? "border-amber-400 bg-amber-400/5"
              : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/40"
            }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <img
            src={preview}
            alt="preview"
            className="max-w-full max-h-52 object-contain rounded-lg"
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <p className="text-zinc-600 text-[11px] font-mono mt-2 mb-6">
          Click or drag to replace image
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs font-mono tracking-wider hover:border-zinc-500 hover:text-zinc-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${!isLoading
                ? "bg-amber-400 text-zinc-950 hover:bg-amber-300 hover:-translate-y-0.5 shadow-lg shadow-amber-400/20 cursor-pointer"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
          >
            {isLoading ? "Saving..." : "Save Changes →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;