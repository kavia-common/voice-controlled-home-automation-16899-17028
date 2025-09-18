/**
 * Minimal UI components to keep the app lightweight and consistent.
 */
import React from "react";

export function Container({ children }) {
  return <div className="container">{children}</div>;
}

export function Section({ title, subtitle, children, actions }) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2 className="title">{title}</h2>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="section-actions">{actions}</div>}
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

export function Navbar({ current, onNavigate }) {
  const items = [
    { key: "config", label: "Device Configuration" },
    { key: "control", label: "Manual Control" },
    { key: "status", label: "Device Status" },
  ];
  return (
    <nav className="navbar">
      <div className="brand">Home Automation UI</div>
      <ul className="nav-links">
        {items.map((it) => (
          <li key={it.key}>
            <button
              className={`nav-link ${current === it.key ? "active" : ""}`}
              onClick={() => onNavigate(it.key)}
              aria-current={current === it.key ? "page" : undefined}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Field({ label, children, error, hint }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      {children}
      {hint && <div className="hint">{hint}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export function Input(props) {
  return <input className="input" {...props} />;
}

export function TextArea(props) {
  return <textarea className="textarea" {...props} />;
}

export function Button({ variant = "primary", ...props }) {
  return <button className={`btn ${variant}`} {...props} />;
}

export function Alert({ type = "info", message }) {
  if (!message) return null;
  return <div className={`alert ${type}`}>{message}</div>;
}
