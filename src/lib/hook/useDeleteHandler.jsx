import { useState } from "react";

const useDeleteHandler = (deleteMutation, item) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    // Display a confirmation dialog before deleting
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this ${item || 'item'}?`
    );

    if (isConfirmed) {
      try {
        setLoading(true);
        const result = await deleteMutation(id);
        setLoading(false);

        if (result?.data?.message) {
          window.location.reload();
        }
      } catch (err) {
        setLoading(false);
        setError(err);
        console.error(err);
      }
    }
  };

  return { handleDelete, loading, error };
};

export default useDeleteHandler;
