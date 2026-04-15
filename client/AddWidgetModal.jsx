import { useState } from "react";

const AddWidgetModal = ({ widgetType, dashboardId, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [error, setError] = useState(null);

  const renderFields = () => {
    switch (widgetType) {
      case "ServerHealth":
        return (
          <>
            <label htmlFor="endpoint">Endpoint URL</label>
            <input
              type="text"
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              required
              placeholder="https://example.com/health"
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleAddWidget = async (e) => {
    e.preventDefault();
    setError(null);
    const body = { type: widgetType, name, dashboardId };
    if (widgetType === "ServerHealth") body.endpoint = endpoint;

    const response = await fetch("/api/widget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 201) {
      onSuccess();
      onClose();
    } else {
      const data = await response.json();
      setError(data.error ?? "Failed to add widget");
    }
  };

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>Add {widgetType} Widget</h2>
        <form className="addWidgetModal" onSubmit={handleAddWidget}>
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
            <button type="submit">Add Widget</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWidgetModal;