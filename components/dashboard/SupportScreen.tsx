


import React from 'react';
import { 
    HeadsetIcon, MailIcon, PhoneIcon, ChevronRightIcon,
    FacebookIcon, InstagramIcon, TwitterIcon, MessageSquareIcon
} from '../../constants';
import { useNavigate } from 'react-router-dom';
import EmbeddedAIAssistant from '../ai/EmbeddedAIAssistant';

const ContactChannelsSection = () => {
     const supportChannels = [
        {
            icon: MailIcon,
            title: 'Email Support',
            contact: 'support@aubattle.com',
            description: 'Best for non-urgent issues.',
            href: 'mailto:support@aubattle.com',
        },
        {
            icon: PhoneIcon,
            title: 'Phone Support',
            contact: '+1 (234) 567-890',
            description: 'For immediate assistance.',
        },
        {
            icon: HeadsetIcon,
            title: 'Live Chat',
            contact: 'Available 24/7',
            description: 'Chat with a live agent now.',
        },
    ];
    return (
        <div>
             <h2 className="text-2xl font-bold text-theme-primary text-center mb-6">Still Need Help?</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportChannels.map((channel) => (
                    <div key={channel.title} className="bg-card p-6 rounded-2xl border border-theme shadow-lg text-center transform transition-transform hover:-translate-y-2">
                         <div className="bg-accent-primary/10 p-3 rounded-full inline-flex mb-4">
                            <channel.icon className="h-7 w-7 text-accent-primary"/>
                        </div>
                        <h3 className="text-lg font-semibold text-theme-primary">{channel.title}</h3>
                         <p className="text-theme-secondary text-sm mt-1 mb-3 h-10">{channel.description}</p>
                        {channel.href ? (
                            <a href={channel.href} className="font-semibold text-accent-primary hover:text-accent-hover transition-colors break-all">{channel.contact}</a>
                        ) : (
                            <p className="font-semibold text-accent-primary break-all">{channel.contact}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const FaqLinkSection: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div 
            className="bg-card p-6 rounded-2xl border border-theme shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer bg-hover"
            onClick={() => navigate('/dashboard/faq')}
        >
            <div className='flex items-center gap-4'>
                <MessageSquareIcon className="w-8 h-8 text-accent-primary"/>
                <div>
                    <h3 className="text-xl font-bold text-theme-primary">Have Questions?</h3>
                    <p className="text-theme-secondary">Find answers to common questions in our FAQ section.</p>
                </div>
            </div>
            <ChevronRightIcon className="w-7 h-7 text-theme-secondary flex-shrink-0" />
        </div>
    );
}

const SocialsSection = () => {
    const socialLinks = [
        { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' },
        { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
        { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
    ];
    return (
        <div>
             <h2 className="text-2xl font-bold text-theme-primary text-center mb-6">Follow Us</h2>
             <div className="flex justify-center items-center gap-6">
                {socialLinks.map((social) => (
                     <a 
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-card p-4 rounded-full border border-theme shadow-lg text-theme-secondary hover:text-accent-primary hover:border-accent-primary/50 transform transition-all hover:scale-110"
                        aria-label={`Follow us on ${social.name}`}
                    >
                        <social.icon className="h-7 w-7"/>
                    </a>
                ))}
            </div>
        </div>
    );
}


const SupportScreen: React.FC = () => {
    return (
        <div className="space-y-12 fade-in-up">
            <EmbeddedAIAssistant />
            <FaqLinkSection />
            <ContactChannelsSection />
            <SocialsSection />
        </div>
    );
};

export default SupportScreen;