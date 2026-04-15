import { createRoot } from "react-dom/client";
import { useState } from "react";
import { handleError, sendPut, hideError } from "./helper";

//* TODO: Pull the error message element into component and manage its state via react instead of direct DOM manipulation.
//* This would allow for better error handling and display across the settings page, rather than relying on a single global error message element.

const handlePasswordChange = (e) => {
  e.preventDefault();
  hideError();

  const currentPassInput = e.target.querySelector("#currentPass");
  const newPassInput = e.target.querySelector("#newPass");
  const confirmPassInput = e.target.querySelector("#confirmPass");

  const currentPass = currentPassInput.value;
  const newPass = newPassInput.value;
  const confirmPass = confirmPassInput.value;

  if (!currentPass || !newPass || !confirmPass) {
    handleError("All fields are required.");
    return false;
  }
  if (newPass !== confirmPass) {
    handleError("New passwords do not match.");
    return false;
  }
  if (newPass === currentPass) {
    handleError("New password must be different from current password.");
    return false;
  }

  sendPut(
    e.target.action,
    { currentPass, newPass, confirmPass, type: "passwordChange" },
    () => {
      currentPassInput.value = "";
      newPassInput.value = "";
      confirmPassInput.value = "";
    },
  );
};

const PasswordChange = () => {
  return (
    <section className="settingsChangeSection">
      <h2>Change Password</h2>
      <form
        id="passwordChangeForm"
        name="passwordChangeForm"
        action="/api/settings"
        className="mainForm"
        onSubmit={handlePasswordChange}
      >
        <label htmlFor="currentPass">Current Password: </label>
        <input type="password" id="currentPass" name="currentPass" />
        <label htmlFor="newPass">New Password: </label>
        <input type="password" id="newPass" name="newPass" />
        <label htmlFor="confirmPass">Confirm New Password: </label>
        <input type="password" id="confirmPass" name="confirmPass" />
        <button type="submit">Update Password</button>
      </form>
    </section>
  );
};

const SubscriptionChange = () => {
  const initialTier = document.getElementById('app').dataset.subscriptionTier;
  const [currentTier, setCurrentTier] = useState(initialTier);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubscriptionChange = async (tier) => {
    if (tier === currentTier) return;
    setMessage(null);
    setError(null);

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionTier: tier, type: 'subscriptionChange' }),
    });
    const data = await res.json();

    if (res.status === 200) {
      setCurrentTier(tier);
      setMessage(data.message);
    } else {
      setError(data.error ?? 'Failed to update subscription');
    }
  };

  return (
    <section className="settingsChangeSection">
      <h2>Change Your Subscription</h2>
      <p>Current plan: <strong>{currentTier}</strong></p>
      <div className="tierOptions">
        <button
          className={`tierBtn ${currentTier === 'free' ? 'active' : ''}`}
          onClick={() => handleSubscriptionChange('free')}
        >
          Free
        </button>
        <button
          className={`tierBtn ${currentTier === 'pro' ? 'active' : ''}`}
          onClick={() => handleSubscriptionChange('pro')}
        >
          Pro
        </button>
      </div>
      {message && <p className="formSuccess">{message}</p>}
      {error && <p className="formError">{error}</p>}
    </section>
  );
};

const Settings = () => {
  return (
    <div className="settingsContainer">
      <PasswordChange />
      <SubscriptionChange />
    </div>
  );
};

const init = () => {
  const container = document.getElementById("app");
  if (container) {
    const root = createRoot(container);
    root.render(<Settings />);
  }
};

window.onload = init;
