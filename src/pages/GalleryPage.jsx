import { useState } from "react";
import { FiTrash2, FiEdit2, FiEye, FiUpload } from "react-icons/fi";
import ImageModal from "../components/Advert/ImageModal";
import DeleteConfirmation from "../components/Advert/DeleteConfirmation";
import EditModal from "../components/Advert/EditModal";
import UploadModal from "../components/Advert/UploadModal";
import DefaultLayout from "../layouts/defaultLayout";
import { toast } from "react-toastify";
import { useDeleteAdvertMutation, useGetAdvertsQuery } from "../services/api";

const GalleryPage = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);

  const { data: adverts = [], refetch, isLoading } = useGetAdvertsQuery();
  const [deleteAdvert] = useDeleteAdvertMutation();

  const handleDelete = async (id) => {
    try {
      await deleteAdvert(id).unwrap();
      setToDelete(null);
      toast.success("Advert deleted.");
    } catch (err) {
      console.error("Could not delete advert:", err);
      toast.error(err?.data?.message || "Could not delete advert.");
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6">
        <div className="mb-8 flex w-full flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-800">Adverts</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Upload and manage advert images shown in the storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-mainGreen px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <FiUpload aria-hidden="true" />
            Upload advert
          </button>
        </div>

        {isLoading && (
          <p className="mt-10 text-sm text-zinc-500">Loading adverts...</p>
        )}

        {!isLoading && adverts.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-zinc-600">No adverts uploaded yet.</p>
            <p className="mt-1 text-sm text-zinc-400">
              Use “Upload advert” to add your first image.
            </p>
          </div>
        )}

        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {adverts.map((advert) => (
            <div
              key={advert._id}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={advert.imageUrl}
                alt={advert.title}
                className="h-36 w-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() =>
                    setSelected({
                      src: advert.imageUrl,
                      title: advert.title,
                      date: new Date(advert.createdAt).toLocaleString(),
                    })
                  }
                  className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
                  title="View advert"
                  aria-label={`View ${advert.title}`}
                >
                  <FiEye size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setToEdit(advert)}
                  className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-amber-400"
                  title="Edit advert"
                  aria-label={`Edit ${advert.title}`}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setToDelete({ id: advert._id, title: advert.title })
                  }
                  className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-red-500"
                  title="Delete advert"
                  aria-label={`Delete ${advert.title}`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-zinc-800">
                  {advert.title}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  {new Date(advert.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {uploadOpen && (
          <UploadModal
            onClose={() => setUploadOpen(false)}
            onUpload={() => {
              setUploadOpen(false);
              refetch();
              toast.success("Advert uploaded.");
            }}
          />
        )}

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
    </DefaultLayout>
  );
};

export default GalleryPage;
