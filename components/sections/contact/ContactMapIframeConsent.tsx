// components/sections/contact/ContactMapIframeConsent.tsx
import { useState } from 'react';

type Props = {
  src: string;                // URL embed (Google/OSM)
  title?: string;
  buttonLabel?: string;
};

export default function ContactMapIframeConsent({
  src,
  title = 'Hartă interactivă',
  buttonLabel = 'Pornește harta interactivă',
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 360,
        aspectRatio: '16 / 9',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#eaeaea',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {show ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: '100%', height: '100%', border: 0 }}
          aria-label={title}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontWeight: 600,
            border: 0,
            cursor: 'pointer',
          }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
