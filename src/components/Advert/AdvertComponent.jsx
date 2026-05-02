import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadModal from "./UploadModal";
import DeleteConfirmation from "./DeleteConfirmation";
import ImageModal from "./ImageModal";
import EditModal from "./EditModal";
import { FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import { useDeleteAdvertMutation, useGetAdvertsQuery } from "../../services/api";

export default function AdvertComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);
  const navigate = useNavigate();

  const { data: adverts = [], refetch, isLoading } = useGetAdvertsQuery();
  const [deleteAdvert] = useDeleteAdvertMutation();

  const handleUpload = () => {
    setModalOpen(false);
    refetch();
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteAdvert(id).unwrap();
      setToDelete(null);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-4">
      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-3.5 bg-mainGreen text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:opacity-90"
        >
          Upload Adverts
        </button>
        <button
          onClick={() => navigate("/gallery")}
          className="px-8 py-3.5 border border-zinc-300 text-zinc-700 font-semibold rounded-xl text-sm hover:border-zinc-400 transition-all duration-200"
        >
          View All
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-zinc-400 text-sm">Loading adverts...</p>
      )}

      {/* Empty state */}
      {!isLoading && adverts.length === 0 && (
        <p className="text-zinc-400 text-sm">No adverts uploaded yet.</p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {adverts.map((advert) => (
          <div
            key={advert._id}
            className="group relative border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={advert.imageUrl}
              alt={advert.title}
              className="w-full h-36 object-cover"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setSelected({
                    src: advert.imageUrl,
                    title: advert.title,
                    date: new Date(advert.createdAt).toLocaleString(),
                  })
                }
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                title="View"
              >
                <FiEye size={18} />
              </button>
              <button
                onClick={() => setToEdit(advert)}
                className="p-2 bg-white/20 hover:bg-amber-400 rounded-full text-white transition-colors"
                title="Edit"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => setToDelete({ id: advert._id, title: advert.title })}
                className="p-2 bg-white/20 hover:bg-red-500 rounded-full text-white transition-colors"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-zinc-800 truncate">{advert.title}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {new Date(advert.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {modalOpen && (
        <UploadModal
          onClose={() => setModalOpen(false)}
          onUpload={handleUpload}
        />
      )}

      <ImageModal selected={selected} onClose={() => setSelected(null)} />

      <DeleteConfirmation
        toDelete={toDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />

      {toEdit && (
        <EditModal
          advert={toEdit}
          onClose={() => setToEdit(null)}
          onSave={refetch}
        />
      )}
    </div>
  );
}