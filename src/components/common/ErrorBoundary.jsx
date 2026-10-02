import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null, info: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#b91c1c", fontSize: 20, fontWeight: 700 }}>
          Something crashed
        </h2>
        <p style={{ marginTop: 8, fontWeight: 600 }}>
          {String(error?.message || error)}
        </p>
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: "#f3f4f6",
            whiteSpace: "pre-wrap",
            fontSize: 12,
            maxHeight: 360,
            overflow: "auto",
          }}
        >
          {info?.componentStack || error?.stack}
        </pre>
        <button
          style={{ marginTop: 12, padding: "8px 16px", background: "#e5e7eb" }}
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}