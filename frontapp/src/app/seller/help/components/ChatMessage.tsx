'use client';

import { TicketMessage } from '@/lib/types/seller/helpDesk';
import Icon from '@/components/ui/Icon';

interface ChatMessageProps {
    message: TicketMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.isUser;

    const parseMarkdown = (text: string) => {
        // Basic bold/italic parsing from legacy
        return text
            .split('\n').map((line, i) => (
                <span key={i} className="block">
                    {line.split('**').map((part, idx) => (
                        idx % 2 === 1 ? <b key={idx}>{part}</b> :
                            part.split('*').map((p, pIdx) => (
                                pIdx % 2 === 1 ? <i key={pIdx}>{p}</i> : p
                            ))
                    ))}
                </span>
            ));
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border border-transparent transition-all
                ${isUser ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-cyan-500 text-white rounded-tl-none'}`}>

                <div className="text-sm font-medium leading-relaxed">
                    {parseMarkdown(message.texto)}
                </div>

                {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mt-3">
                        {message.attachments.map((file, idx) => (
                            <div key={idx} className="rounded-xl overflow-hidden border border-white/20 shadow-sm bg-white/20">
                                {file.type === 'image' ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="max-w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition"
                                        onClick={() => window.open(file.url, '_blank')}
                                    />
                                ) : (
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 p-3 text-[10px] font-bold text-white hover:bg-white/10 transition"
                                    >
                                        <Icon name="FileText" className="text-lg w-5 h-5" /> {file.name}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <span className={`text-[9px] mt-2 block font-bold ${isUser ? 'opacity-70' : 'text-white/70'}`}>
                    {message.hora} • {isUser ? (message.role || 'Vendedor') : (message.role || 'Lyrium Admin')}
                </span>
            </div>
        </div>
    );
}
