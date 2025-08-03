
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { AIContextType, AIMessage } from '../types';

const AIContext = createContext<AIContextType | undefined>(undefined);

const systemInstruction = `You are a friendly and helpful AI assistant for "AU Battle", a gaming platform.
Your goal is to assist users with their questions about the platform.
You can answer questions about games, account issues, rules, and provide gameplay tips.
Keep your answers concise, friendly, and easy to understand.
If you don't know an answer, politely say that you can't help with that and suggest they contact support.`;

const initialMessages: AIMessage[] = [
    {
        role: 'model',
        parts: [{ text: "Hello! I'm your AI Assistant for AU Battle. How can I help you today? You can ask me about game rules, your account, or for gameplay tips." }]
    }
];

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
    const [isResponding, setIsResponding] = useState(false);
    const chatRef = useRef<Chat | null>(null);

    useEffect(() => {
        try {
            // This relies on the build environment to provide the API key.
            // As per instructions, we assume process.env.API_KEY is available.
            if (!process.env.API_KEY) {
                console.error("Gemini API key not found. AI Assistant will be disabled.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction,
                },
                history: initialMessages,
            });
        } catch(e) {
            console.error("Failed to initialize AI Chat. Make sure API_KEY is set.", e);
        }
    }, []);

    const sendMessage = useCallback(async (prompt: string) => {
        if (!prompt.trim()) return;

        const userMessage: AIMessage = { role: 'user', parts: [{ text: prompt }] };
        setMessages(prev => [...prev, userMessage]);

        if (!chatRef.current) {
            const errorMessage: AIMessage = {
                role: 'model',
                parts: [{ text: "I'm sorry, but the AI assistant is currently unavailable. Please check the console for errors or contact support." }],
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        setIsResponding(true);

        try {
            const result = await chatRef.current.sendMessageStream({ message: prompt });
            
            let currentResponse = "";
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: "" }] }]);
            
            for await (const chunk of result) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: currentResponse }] };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessage: AIMessage = {
                role: 'model',
                parts: [{ text: "Sorry, I encountered an error. Please try again later." }],
            };
             setMessages(prev => {
                const newMessages = [...prev];
                // Replace the empty model message with the error message
                if (newMessages[newMessages.length -1].role === 'model' && newMessages[newMessages.length -1].parts[0].text === '') {
                     newMessages[newMessages.length - 1] = errorMessage;
                } else {
                     newMessages.push(errorMessage);
                }
                return newMessages;
            });
        } finally {
            setIsResponding(false);
        }
    }, []);


    return (
        <AIContext.Provider value={{ messages, isResponding, sendMessage }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};
