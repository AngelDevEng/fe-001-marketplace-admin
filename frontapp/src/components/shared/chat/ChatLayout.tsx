'use client';

import React from 'react';

interface ChatLayoutProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  listWidth?: 'col-span-3' | 'col-span-4' | 'col-span-5';
}

const defaultListWidth = 'col-span-4';

const detailWidthMap: Record<string, string> = {
  'col-span-3': 'col-span-9',
  'col-span-4': 'col-span-8',
  'col-span-5': 'col-span-7',
};

export default function ChatLayout({ 
  list, 
  detail, 
  listWidth = defaultListWidth 
}: ChatLayoutProps) {
  const detailWidth = detailWidthMap[listWidth];

  return (
    <div className="grid grid-cols-12 gap-6 h-full min-h-[600px]">
      {/* Lista de conversaciones */}
      <div className={`${listWidth} bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col`}>
        {list}
      </div>
      
      {/* Área de chat */}
      <div className={`${detailWidth} bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0`}>
        {detail}
      </div>
    </div>
  );
}
