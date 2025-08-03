
import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../../hooks/useAI';
import { BotIcon, SendIcon, Spinner } from '../../constants';
import { AIMessage } from '../../types';

const EmbeddedAIAssistant: React.FC = () => {
    const { messages, isResponding, sendMessage } = useAI();
    const [prompt, setPrompt] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isResponding]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            sendMessage(prompt);
            setPrompt('');
        }
    };

    return (
        <div className="bg-card border border-theme rounded-2xl w-full h-[60vh] max-h-[700px] min-h-[400px] flex flex-col relative shadow-lg">
            <header className="flex items-center justify-between p-4 border-b border-theme flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <BotIcon className="w-6 h-6 text-accent-primary" />
                    <h2 className="text-lg font-bold text-theme-primary">AI Assistant</h2>
                </div>
                 <span className="text-xs font-semibold text-green-400 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Online
                </span>
            </header>

            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isResponding && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 border-t border-theme flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask me anything..."
                        disabled={isResponding}
                        className="w-full bg-slate-900/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary transition-shadow disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isResponding || !prompt.trim()}
                        className="bg-accent-primary text-black w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-accent-hover disabled:bg-gray-500 disabled:opacity-50"
                        aria-label="Send message"
                    >
                       {isResponding ? <Spinner className="w-5 h-5"/> : <SendIcon className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ChatMessage: React.FC<{ message: AIMessage }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex items-end gap-2 ${isModel ? 'justify-start' : 'justify-end'}`}>
            {isModel && <BotIcon className="w-6 h-6 text-accent-primary flex-shrink-0 mb-1" />}
            <div
                className={`max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                    isModel ? 'bg-slate-700 text-theme-primary rounded-bl-none' : 'bg-accent-primary text-black rounded-br-none'
                }`}
            >
                <p className="whitespace-pre-wrap text-sm">{message.parts[0].text}</p>
            </div>
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 justify-start">
        <BotIcon className="w-6 h-6 text-accent-primary flex-shrink-0 mb-1" />
        <div className="px-4 py-3 rounded-xl rounded-bl-none bg-slate-700">
            <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-pulse"></span>
            </div>
        </div>
    </div>
);


export default EmbeddedAIAssistant;
