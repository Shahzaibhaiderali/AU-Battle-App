
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FAQS } from '../../content/text';
import { BackArrowIcon, ChevronRightIcon, MessageSquareIcon } from '../../constants';
import { FaqItem as FaqType } from '../../content/text';

const FaqItem: React.FC<{ item: FaqType, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-theme last:border-b-0">
            <button
                onClick={onClick}
                className="flex justify-between items-center w-full py-4 text-left"
                aria-expanded={isOpen}
            >
                <h3 className="font-semibold text-theme-primary">{item.q}</h3>
                <ChevronRightIcon className={`w-5 h-5 text-theme-secondary transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 text-theme-secondary pr-6">
                    <p>{item.a}</p>
                </div>
            )}
        </div>
    );
};

const FaqScreen: React.FC = () => {
    const navigate = useNavigate();
    const [openId, setOpenId] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenId(openId === index ? null : index);
    };

    return (
        <div className="fade-in-up pb-8">
            <header className="flex items-center p-4 lg:justify-center relative">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 lg:hidden absolute left-4">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <div className="flex items-center gap-2 mx-auto">
                    <MessageSquareIcon className="w-7 h-7 text-accent-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-theme-primary">FAQs</h1>
                </div>
            </header>

             <div className="p-4 pt-0 lg:p-0">
                <div className="bg-card p-6 rounded-lg border border-theme max-w-4xl mx-auto">
                    {FAQS.map((faq, index) => (
                        <FaqItem
                            key={index}
                            item={faq}
                            isOpen={openId === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqScreen;
