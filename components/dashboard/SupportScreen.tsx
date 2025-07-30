
import React from 'react';
import { HeadsetIcon, MailIcon, PhoneIcon } from '../../constants';

const SupportScreen: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold text-theme-primary mb-4">Customer Support</h1>
            <p className="text-theme-secondary">Contact us for any help or inquiries.</p>
             <div className="mt-8 bg-card p-6 rounded-lg border border-theme shadow-lg text-left space-y-6">
                
                <div className="flex items-center space-x-4">
                    <div className="bg-accent-primary/10 p-3 rounded-full">
                        <MailIcon className="h-6 w-6 text-accent-primary"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-theme-primary">Email Support</h3>
                        <a href="mailto:support@aubattle.com" className="text-theme-secondary hover:text-accent-primary">support@aubattle.com</a>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="bg-accent-primary/10 p-3 rounded-full">
                        <PhoneIcon className="h-6 w-6 text-accent-primary"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-theme-primary">Phone Support</h3>
                        <p className="text-theme-secondary">+1 (234) 567-890</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-4">
                    <div className="bg-accent-primary/10 p-3 rounded-full">
                        <HeadsetIcon className="h-6 w-6 text-accent-primary"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-theme-primary">Live Chat</h3>
                        <p className="text-theme-secondary">Available 24/7 on our website</p>
                    </div>
                </div>
            </div>
             <div className="mt-8">
                 <h2 className="text-xl font-bold text-theme-primary mb-4">Follow Us</h2>
                 <div className="flex justify-center space-x-4">
                    {/* Add social media icons and links here */}
                 </div>
             </div>
        </div>
    );
};

export default SupportScreen;
