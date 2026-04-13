import { createRoot } from "react-dom/client";
import { handleError, sendPut, hideError } from "./helper";

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
  );
};

const Settings = () => {
  return (
    <PasswordChange />
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
