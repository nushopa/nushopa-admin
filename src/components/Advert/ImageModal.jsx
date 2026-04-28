
const ImageModal = ({ selected, onClose }) => {
  if (!selected) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "90%",
          maxHeight: "90%",
          textAlign: "center",
        }}
      >
        <img
          src={selected.src}
          alt={selected.title}
          style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "8px" }}
        />
        <h2 style={{ marginTop: "10px" }}>{selected.title}</h2>
        <p style={{ fontSize: "12px", color: "#666" }}>{selected.date}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
