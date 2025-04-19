import React, { ReactNode } from "react";
import ErrorBoundary from "./error-boundary";

/**
 * Props for the PageLayout component
 */
interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showErrorBoundary?: boolean;
  className?: string;
}

/**
 * PageLayout component - provides consistent layout for pages
 * Optionally wraps content in an ErrorBoundary
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  showErrorBoundary = true,
  className = "",
}) => {
  const content = (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {(title || description) && (
        <div className="mb-8">
          {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {children}
    </div>
  );

  if (showErrorBoundary) {
    return <ErrorBoundary>{content}</ErrorBoundary>;
  }

  return content;
};

export default PageLayout;
