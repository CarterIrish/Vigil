import { useState } from "react";

const EditWidgetModal = ({
  widget,
  dashboardId,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(widget.name);
  const [endpoint, setEndpoint] = useState(widget.endpoint);
  const [error, setError] = useState(null);

  const renderFields = () => {
    switch (widget.type) {
      case "ServerHealth":
        return (
          <>
            <label htmlFor="endpoint">Endpoint URL:</label>
            <input
              type="text"
              id="endpoint"
              value={endpoint}
              required
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleEditWidget = async (e) => {
    e.preventDefault();
    setError(null);

    const body = { name: name, endpoint: endpoint };

    const response = await fetch(`/api/widget/${widget._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status === 200) {
      onSuccess();
      onClose();
    } else {
      const data = await response.json();
      setError(data.error ?? "Failed to update widget");
    }
  };

  const handleDeleteWidget = async () => {
    setError(null);

    const response = await fetch(
      `/api/widget/${widget._id}?dashboardId=${dashboardId}`,
      {
        method: "DELETE",
      },
    );

    if (response.status === 200) {
      onSuccess();
      onClose();
    } else {
      const data = await response.json();
      setError(data.error ?? "Failed to delete widget");
    }
  };

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>Edit {widget.type} Widget</h2>
        <form className="editWidgetModal" onSubmit={handleEditWidget}>
          <label htmlFor="widgetName">Widget Name</label>
          <input
            type="text"
            id="widgetName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {renderFields()}
          {error && <p className="formError">{error}</p>}
          <div className="modalButtons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" onClick={handleDeleteWidget} className="deleteButton">
              Delete Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWidgetModal;