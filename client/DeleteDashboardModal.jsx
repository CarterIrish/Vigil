import { useState } from "react";

const DeleteDashboardModal = ({ dashboardId, onClose, onSuccess, name }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    const response = await fetch(`/api/dashboard/${dashboardId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setIsDeleting(false);
    if (response.status === 200) {
      console.log("Dashboard deleted successfully");
      onSuccess();
      return;
    }
    const data = await response.json().catch(() => ({}));
    setError(data.error ?? "Failed to delete dashboard");
  };
  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>Delete Dashboard</h2>
        <p>
          Are you sure you want to delete your <span className="dashboardNameHighlight"> {name} </span> dashboard? All widgets on this dashboard will also be deleted. <em>This action cannot be undone.</em> 
        </p>
        <div className="modalButtons">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            id="deleteButton"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        {error && <p className="modalError">{error}</p>}
      </div>
    </div>
  );
};

export default DeleteDashboardModal;
