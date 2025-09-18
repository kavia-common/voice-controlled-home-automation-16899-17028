import React, { useState } from "react";
import { api, validateControlCommand } from "../api/client";
import { Container, Section, Field, Input, Button, Alert } from "../components/UI";

// PUBLIC_INTERFACE
export default function ManualControlPage() {
  /**
   * UI for POST /devices/control
   * - Form for deviceId and command
   * - Client-side validation, request/response error handling
   */
  const [deviceId, setDeviceId] = useState("");
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const fe = {};
    if (!deviceId.trim()) fe.deviceId = "Device ID is required";
    if (!command.trim()) fe.command = "Command is required";
    setFieldErrors(fe);
    if (Object.keys(fe).length) return;

    const payload = { deviceId: deviceId.trim(), command: command.trim() };
    try {
      validateControlCommand(payload);
    } catch (vErr) {
      setError(vErr.message);
      return;
    }

    setSending(true);
    try {
      await api.sendControl(payload);
      setSuccess("Command sent successfully.");
      setCommand("");
    } catch (e) {
      setError(e.message || "Failed to send command");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container>
      <Section title="Manual Device Control" subtitle="Send direct control commands to devices.">
        <Alert type={error ? "error" : "success"} message={error || success} />
        <form onSubmit={onSubmit} noValidate>
          <Field label="Device ID" error={fieldErrors.deviceId}>
            <Input
              type="text"
              placeholder="e.g., fan-2"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              required
            />
          </Field>
          <Field label="Command" error={fieldErrors.command} hint='Example: "on", "off", "speed:2"'>
            <Input
              type="text"
              placeholder='e.g., "on" or "speed:2"'
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              required
            />
          </Field>
          <div className="form-actions">
            <Button type="submit" disabled={sending}>{sending ? "Sending..." : "Send Command"}</Button>
          </div>
        </form>
      </Section>
    </Container>
  );
}
