import React, { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { Container, Section, Button, Alert } from "../components/UI";

// PUBLIC_INTERFACE
export default function DeviceStatusPage() {
  /**
   * UI for GET /devices/status
   * - Displays current deviceId and status string
   * - Manual refresh and optional auto-refresh via env interval
   */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef(null);
  const POLL_MS = Number(process.env.REACT_APP_STATUS_POLL_INTERVAL || 0);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await api.getStatus();
      setData(resp);
    } catch (e) {
      setError(e.message || "Failed to load status");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (POLL_MS > 0 && !pollRef.current) {
      pollRef.current = setInterval(load, POLL_MS);
    }
  };
  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    load();
    if (POLL_MS > 0) startPolling();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Section
        title="Device Status"
        subtitle={POLL_MS > 0 ? `Auto-refreshing every ${POLL_MS / 1000}s` : "Click refresh to update"}
        actions={<Button onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button>}
      >
        <Alert type={error ? "error" : "success"} message={error || ""} />
        {!error && data && (
          <div className="status-card">
            <div className="status-row">
              <div className="status-label">Device ID</div>
              <div className="status-value">{data.deviceId}</div>
            </div>
            <div className="status-row">
              <div className="status-label">Status</div>
              <div className="status-value">{data.status}</div>
            </div>
          </div>
        )}
        {!error && !data && !loading && <div>No status data available.</div>}
      </Section>
    </Container>
  );
}
