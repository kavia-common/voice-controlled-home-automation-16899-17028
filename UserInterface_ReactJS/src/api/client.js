/**
 * API client for the UserInterface_ReactJS container.
 * Handles base URL, headers, JSON parsing, response validation, and errors.
 */
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const API_KEY = process.env.REACT_APP_API_KEY;

/**
 * Basic schema validators for the UI OpenAPI models.
 */
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

// PUBLIC_INTERFACE
export function validateDeviceConfiguration(body) {
  /** Validate payload for DeviceConfiguration: { deviceId: string, settings: object } */
  if (!body || typeof body !== "object") throw new Error("Configuration must be an object");
  if (!isNonEmptyString(body.deviceId)) throw new Error("deviceId is required");
  if (typeof body.settings !== "object" || body.settings === null || Array.isArray(body.settings)) {
    throw new Error("settings must be an object");
  }
  return true;
}

// PUBLIC_INTERFACE
export function validateControlCommand(body) {
  /** Validate payload for ControlCommand: { deviceId: string, command: string } */
  if (!body || typeof body !== "object") throw new Error("Command must be an object");
  if (!isNonEmptyString(body.deviceId)) throw new Error("deviceId is required");
  if (!isNonEmptyString(body.command)) throw new Error("command is required");
  return true;
}

// PUBLIC_INTERFACE
export function validateDeviceStatusResponse(resp) {
  /** Validate response for DeviceStatus: { deviceId: string, status: string } */
  if (!resp || typeof resp !== "object") throw new Error("Invalid response");
  if (!isNonEmptyString(resp.deviceId)) throw new Error("Missing deviceId");
  if (!isNonEmptyString(resp.status)) throw new Error("Missing status");
  return true;
}

// PUBLIC_INTERFACE
export function validateDeviceConfigurationResponse(resp) {
  /** Validate response for DeviceConfiguration (GET) */
  if (!resp || typeof resp !== "object") throw new Error("Invalid response");
  if (!isNonEmptyString(resp.deviceId)) throw new Error("Missing deviceId");
  if (typeof resp.settings !== "object" || resp.settings === null || Array.isArray(resp.settings)) {
    throw new Error("settings must be an object");
  }
  return true;
}

/**
 * Core request helper using fetch.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "X-API-KEY": API_KEY } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      (data && data.detail) ||
      (typeof data === "string" ? data : JSON.stringify(data)) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** GET /devices/configuration */
  getConfiguration: async () => {
    const data = await request("/devices/configuration", { method: "GET" });
    validateDeviceConfigurationResponse(data);
    return data;
  },

  /** PUT /devices/configuration */
  updateConfiguration: async (payload) => {
    validateDeviceConfiguration(payload);
    const data = await request("/devices/configuration", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    // API spec returns 200 without schema; accept empty/any
    return data;
  },

  /** POST /devices/control */
  sendControl: async (payload) => {
    validateControlCommand(payload);
    const data = await request("/devices/control", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // API spec returns 200 without schema; accept empty/any
    return data;
  },

  /** GET /devices/status */
  getStatus: async () => {
    const data = await request("/devices/status", { method: "GET" });
    validateDeviceStatusResponse(data);
    return data;
  },
};
