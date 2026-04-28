import { useState } from "react";
import UploadModal from "./UploadModal";
import { useNavigate } from "react-router-dom";

export default function AdvertComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    setModalOpen(false);
    navigate("/gallery");
  };

  return (
    <div>
      <div className="flex justify-between">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-3.5 bg-mainGreen text-white font-semibold rounded-xl text-sm transition-all duration-200"
        >
          Upload
        </button>

        <button
          onClick={() => navigate("/gallery")}
          className="px-8 py-3.5 text-zinc-950 font-semibold rounded-xl text-sm transition-all duration-200"
        >
          View All
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <UploadModal
          onClose={() => setModalOpen(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
