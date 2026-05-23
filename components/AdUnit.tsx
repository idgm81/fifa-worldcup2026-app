// components/AdUnit.tsx
'use client';
import { useEffect } from 'react';

export default function AdUnit({ slot }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="my-8 flex justify-center overflow-hidden min-h-[90px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7499038462295597" // Tu ID de editor
        data-ad-slot={slot} // El ID del bloque de anuncio que crees en AdSense
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
