import { useState } from "react";
import { US_TIMEZONES } from "./constants/timezones.js";

const EditWidgetModal = ({
  widget,
  dashboardId,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(widget.name);
  const [endpoint, setEndpoint] = useState(widget.endpoint);
  const [timezone, setTimezone] = useState(widget.timezone);
  const [format, setFormat] = useState(widget.format);
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
      case "Clock":
        return (
          <>
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="" disabled>
                Select timezone
              </option>
              {US_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <label htmlFor="format">Time Format</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  const handleEditWidget = async (e) => {
    e.preventDefault();
    setError(null);

    const body = { name: name};

    if(widget.type === "ServerHealth") body.endpoint = endpoint;
    if(widget.type === "Clock") {
      body.timezone = timezone;
      body.format = format;
    }

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