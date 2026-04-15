import { useState } from "react";

export const AddWidgetModal = ({ widgetType, dashboardId, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const renderFields = () => {
    switch (widgetType) {
      case "ServerHealth":
        return (
          <>
            <label htmlFor="endpoint">Endpoint URL</label>
            <input
              type="text"
              id="endpoint"
              name="endpoint"
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
    const body = {type: widgetType, name, dashboardId};
    if(widgetType === 'ServerHealth') body.endpoint = endpoint;

    const response = await fetch('/api/widget', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if(response.status === 201) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>Add {widgetType} Widget</h2>
        <form
          id="addWidgetForm"
          onSubmit={(e) => handleAddWidget(e)}
          name="addWidgetForm"
          action="/api/widget"
          method="POST"
          className="addWidgetModal"
        >
          <label htmlFor="widgetName">Widget Name</label>
          <input
            type="text"
            id="widgetName"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {renderFields()}
          <div className="modalButtons">
            <button type="submit">Add Widget</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};