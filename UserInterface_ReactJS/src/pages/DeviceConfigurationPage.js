import React, { useEffect, useState } from "react";
import { api, validateDeviceConfiguration } from "../api/client";
import { Container, Section, Field, Input, TextArea, Button, Alert } from "../components/UI";

// PUBLIC_INTERFACE
export default function DeviceConfigurationPage() {
  /**
   * UI for GET/PUT /devices/configuration
   * - Loads current configuration on mount
   * - Allows editing deviceId and settings (JSON)
   * - Validates payload before PUT
   */
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [settingsText, setSettingsText] = useState("{\n  \"mode\": \"auto\"\n}");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const parseSettings = () => {
    try {
      const parsed = JSON.parse(settingsText);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Settings must be a JSON object");
      }
      return parsed;
    } catch (e) {
      throw new Error(`Invalid JSON for settings: ${e.message}`);
    }
  };

  const load = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.getConfiguration();
      setDeviceId(data.deviceId || "");
      setSettingsText(JSON.stringify(data.settings || {}, null, 2));
    } catch (e) {
      setError(e.message || "Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    // client-side validation
    const fe = {};
    if (!deviceId.trim()) fe.deviceId = "Device ID is required";
    let settingsObj = null;
    try {
      settingsObj = parseSettings();
    } catch (err) {
      fe.settings = err.message;
    }
    if (Object.keys(fe).length) {
      setFieldErrors(fe);
      return;
    }
    const payload = { deviceId: deviceId.trim(), settings: settingsObj };
    try {
      validateDeviceConfiguration(payload);
    } catch (vErr) {
      setError(vErr.message);
      return;
    }

    setLoading(true);
    try {
      await api.updateConfiguration(payload);
      setSuccess("Configuration updated successfully.");
    } catch (e) {
      setError(e.message || "Failed to update configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Section
        title="Device Configuration"
        subtitle="View and update the current device configuration."
        actions={<Button onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</Button>}
      >
        <Alert type={error ? "error" : "success"} message={error || success} />
        <form onSubmit={onSubmit} noValidate>
          <Field label="Device ID" error={fieldErrors.deviceId}>
            <Input
              type="text"
              placeholder="e.g., light-1"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              required
            />
          </Field>
          <Field
            label="Settings (JSON)"
            hint='Provide a valid JSON object. Example: { "mode": "auto", "brightness": 80 }'
            error={fieldErrors.settings}
          >
            <TextArea
              rows={10}
              value={settingsText}
              onChange={(e) => setSettingsText(e.target.value)}
            />
          </Field>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Configuration"}</Button>
          </div>
        </form>
      </Section>
    </Container>
  );
}
