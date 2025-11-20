import React from "react";
import { ServerErrorPage } from "../pages/ServerErrorPage";

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<
  {
    onReset?: () => void;
    children?: React.ReactNode;
  },
  State
> {
  constructor(props: { onReset?: () => void; children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Unhandled error in component tree:", error, info);
    this.setState({ error });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return <ServerErrorPage onReset={this.reset} />;
    }

    try {
      return this.props.children ?? null;
    } catch (err) {
      console.error("Unhandled error in component tree (render):", err);
      return <ServerErrorPage onReset={this.reset} />;
    }
  }
}
