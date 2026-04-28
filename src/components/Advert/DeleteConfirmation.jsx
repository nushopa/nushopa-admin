
const DeleteConfirmation = ({ toDelete, onConfirm, onCancel }) => {
  if (!toDelete) return null;

  return (
    <div
      onClick={onCancel}
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
          textAlign: "center",
          maxWidth: "300px",
        }}
      >
        <h3>Delete Image?</h3>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
          Are you sure you want to delete <strong>{toDelete.title}</strong>?
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => onConfirm(toDelete.id)}
            style={{
              padding: "8px 16px",
              background: "#d9534f",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              background: "#ccc",
              color: "#333",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
