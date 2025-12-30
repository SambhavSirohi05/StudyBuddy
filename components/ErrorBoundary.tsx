'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md my-4 text-sm">
                    <strong>Something went wrong rendering this message.</strong>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="ml-4 underline hover:text-red-900"
                    >
                        Try to recover
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
