import { useState } from "react";
import ImageModal from "../components/Advert/ImageModal";
import DeleteConfirmation from "../components/Advert/DeleteConfirmation";
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  const [images, setImages] = useState(JSON.parse(localStorage.getItem("images")) || []);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    localStorage.setItem("images", JSON.stringify(updated));
    setToDelete(null);
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          alignSelf: "flex-start",
          marginBottom: "20px",
          padding: "8px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: "20px" }}>Uploaded Images</h1>

      {/* Image Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              width: "160px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              background: "#f9f9f9",
            }}
          >
            <img
              src={img.src}
              alt={img.title}
              onClick={() => setSelected(img)}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
            <p style={{ fontSize: "12px", fontWeight: "bold", margin: "6px 0 2px" }}>
              {img.title}
            </p>
            <p style={{ fontSize: "10px", color: "#666" }}>{img.date}</p>
            <button
              onClick={() => setToDelete(img)}
              style={{
                marginTop: "8px",
                padding: "6px 12px",
                background: "#d9534f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Reusable Components */}
      <ImageModal selected={selected} onClose={() => setSelected(null)} />
      <DeleteConfirmation
        toDelete={toDelete}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default GalleryPage;
