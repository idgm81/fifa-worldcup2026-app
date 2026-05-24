'use client';

import { useState } from 'react';
import { IoShieldOutline } from "react-icons/io5";

interface Props {
  src?: string;
  name: string;
  className?: string;
}

export default function TeamImage({ src, name, className = "w-12 h-12" }: Props) {
  const [error, setError] = useState(false);
  const isPlaceholder = !src;

  if (error || isPlaceholder) {
    return (
      <div className={`${className} bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors`}>
        <IoShieldOutline size={24} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${className} object-contain drop-shadow-sm`}
      onError={() => setError(true)}
    />
  );
}