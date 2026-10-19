import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, children, className, ...props }) {
  const to = href ?? '/';
  return (
    <RouterLink to={to} className={className} {...props}>
      {children}
    </RouterLink>
  );
}
