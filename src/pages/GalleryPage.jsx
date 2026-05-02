import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import ImageModal from "../components/Advert/ImageModal";
import DeleteConfirmation from "../components/Advert/DeleteConfirmation";
import EditModal from "../components/Advert/EditModal";
import { useDeleteAdvertMutation, useGetAdvertsQuery } from "../services/api";

const GalleryPage = () => {
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);
  const navigate = useNavigate();

  const { data: adverts = [], refetch, isLoading } = useGetAdvertsQuery();
  const [deleteAdvert] = useDeleteAdvertMutation();

  const handleDelete = async (id) => {
    try {
      await deleteAdvert(id).unwrap();
      setToDelete(null);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-white">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-zinc-800">Uploaded Adverts</h1>
        <div className="w-20" />
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-zinc-500 text-sm mt-10">Loading adverts...</p>
      )}

      {/* Empty state */}
      {!isLoading && adverts.length === 0 && (
        <p className="text-zinc-400 text-sm mt-10">No adverts uploaded yet.</p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
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
                onClick={() =>
                  setToDelete({ id: advert._id, title: advert.title })
                }
                className="p-2 bg-white/20 hover:bg-red-500 rounded-full text-white transition-colors"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-zinc-800 truncate">
                {advert.title}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {new Date(advert.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ImageModal selected={selected} onClose={() => setSelected(null)} />

      <DeleteConfirmation
        toDelete={toDelete}
        onConfirm={handleDelete}
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
};

export default GalleryPage;