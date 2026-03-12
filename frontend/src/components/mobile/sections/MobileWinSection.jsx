import React from 'react';
import { SectionCard } from './Shared';
import { numInput } from "../MobileUI";

const MobileWinSection = ({ data, onChange }) => (
    <SectionCard icon="🏆" title="TODAY'S WIN">
        <input type="text" value={data.winText || ''} placeholder="One thing I'm proud of today..."
            onChange={e => onChange('winText', e.target.value)}
            style={{ ...numInput, width: '100%', fontSize: '14px' }} />
    </SectionCard>
);

export default MobileWinSection;
