// components/AdSenseBanner.tsx
'use client';
import { useEffect } from 'react';

interface AdUnitProps {
  slot: string; // Esto elimina el error de tipo 'any'
}

export default function AdSenseBanner({ slot }: AdUnitProps) {  
  useEffect(() => {
    // Definimos una pequeña función para evitar duplicados
    const loadAd = () => {
      try {
        // Comprobamos si hay algún elemento 'ins' que NO tenga el atributo de "finalizado"
        const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
        
        if (ads.length > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    };

    // Pequeño delay para asegurar que el DOM está listo en Next.js
    const timer = setTimeout(loadAd, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ display: 'block' }}
      className="flex justify-center my-8 overflow-hidden min-h-[100px]">
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
