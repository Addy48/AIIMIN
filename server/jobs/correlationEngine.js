/**
 * jobs/correlationEngine.js — nightly batch (pool-backed).
 */
import { runCorrelationEngine } from '../services/correlationService.js';

/** @deprecated Use runCorrelationEngine from correlationService */
export async function runCorrelationEngineLegacy() {
    return runCorrelationEngine();
}

export { runCorrelationEngine };
