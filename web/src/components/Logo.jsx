/**
 * @deprecated Use ThemedMark or BrandLockup — kept for backward compatibility.
 */
import ThemedMark from './brand/ThemedMark';

export default function Logo({ size = 36, withBg = true, density = withBg ? 'nav' : 'default' }) {
  return <ThemedMark size={size} withChip density={density} />;
}
