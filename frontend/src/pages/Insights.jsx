import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

/**
 * Legacy /insights → Reports intelligence surface.
 * ?tab=skills preserved; default → patterns.
 */
export default function InsightsRedirect() {
  const [params] = useSearchParams();
  const tab = params.get('tab') === 'skills' ? 'skills' : 'patterns';
  return <Navigate to={`/reports?tab=${tab}`} replace />;
}
