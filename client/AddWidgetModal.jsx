import { useState } from "react";
import { US_TIMEZONES } from "./constants/timezones.js";

const AddWidgetModal = ({ widgetType, dashboardId, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [timezone, setTimezone] = useState("");
  const [format, setFormat] = useState("24h");
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

  const handleAddWidget = async (e) => {
    e.preventDefault();
    setError(null);
    const body = { type: widgetType, name, dashboardId };
    if (widgetType === "ServerHealth") body.endpoint = endpoint;
    if (widgetType === "Clock") {
      body.timezone = timezone;
      body.format = format;
    }

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
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWidgetModal;
