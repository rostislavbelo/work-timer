import React from 'react';
import './layout.css';

interface ILayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: ILayoutProps) {
  return (
    <div className="layout">{children}</div>
  );
}
