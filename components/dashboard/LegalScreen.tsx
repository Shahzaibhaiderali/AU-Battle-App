



import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackArrowIcon } from '../../constants';
import { PRIVACY_POLICY, RETURN_POLICY, ABOUT_US, TERMS_AND_CONDITIONS } from '../../content/text';


const policies: { [key: string]: { title: string, content: string } } = {
    privacy: {
        title: 'Privacy Policy',
        content: PRIVACY_POLICY
    },
    return: {
        title: 'Return & Cancellation Policy',
        content: RETURN_POLICY
    },
    about: {
        title: 'About Us',
        content: ABOUT_US
    },
    terms: {
        title: 'Terms & Conditions',
        content: TERMS_AND_CONDITIONS
    }
}

const LegalScreen: React.FC = () => {
    const { policyType } = useParams<{ policyType: string }>();
    const navigate = useNavigate();
    const policy = policyType ? policies[policyType] : null;

    if (!policy) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-400">Policy document not found.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-accent-primary">Go Back</button>
            </div>
        );
    }
    
    const formattedContent = policy.content.trim().split('\n').map((line, index) => {
        line = line.trim();
        if (line.startsWith('**') && line.endsWith('**')) {
            return <h3 key={index} className="text-xl font-bold text-theme-primary mt-6 mb-3">{line.substring(2, line.length - 2)}</h3>;
        }
        if (line.startsWith('- ')) {
            return <li key={index} className="text-theme-secondary list-disc ml-6">{line.substring(2)}</li>
        }
        if (line === '') return null; // Skip empty lines
        return <p key={index} className="text-theme-secondary mb-4">{line}</p>;
    }).filter(Boolean);


    return (
        <div className="fade-in-up pb-8">
            <header className="flex items-center p-4 border-b border-theme lg:border-none lg:mb-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <BackArrowIcon className="w-6 h-6 text-theme-primary" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-theme-primary mx-auto pr-8">{policy.title}</h1>
            </header>

            <div className="p-4 pt-0 lg:p-0">
                <div className="bg-card p-6 rounded-lg border border-theme max-w-4xl mx-auto">
                    {formattedContent}
                </div>
            </div>
        </div>
    );
};

export default LegalScreen;