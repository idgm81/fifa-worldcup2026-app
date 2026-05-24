'use client';

import { useEffect, useState } from 'react';

interface Props {
  date: string;
  showDate?: boolean;
  showTime?: boolean;
}

export default function FechaLocal({ date, showDate = true, showTime = true }: Props) {
  const [mounted, setMounted] = useState(false);

  // useEffect solo se ejecuta en el cliente tras el primer render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mientras se renderiza en el servidor, mostramos un estado vacío o un esqueleto
  if (!mounted) {
    return <span className="opacity-0">--:--</span>;
  }

  const dateObj = new Date(date);

  return (
    <span>
      {dateObj.toLocaleString(undefined, { // undefined usa el idioma del navegador
        weekday: showDate ? 'long': undefined,
        day: showDate ? 'numeric': undefined,
        month: showDate ? 'long': undefined,
        hour: showTime ? '2-digit' : undefined,
        minute: showTime ? '2-digit' : undefined,
      })}
    </span>
  );
}