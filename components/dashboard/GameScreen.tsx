
import React, { useState } from 'react';
import ImageSlider from '../ui/ImageSlider';
import { SpeakerWaveIcon, FireIcon } from '../../constants';

// Static fallback images
const staticSliderImages = [
    'https://i.imgur.com/GZSLk3K.jpg',
    'https://i.imgur.com/W2u20Rj.jpg',
    'https://i.imgur.com/8z2e4Iq.jpg',
    'https://i.imgur.com/mI4G7S1.jpg',
    'https://i.imgur.com/sTqDWd8.jpg'
];

const contestCategories = [
    { title: 'Solo', image: 'https://i.imgur.com/gS3SoDD.png' },
    { title: 'Duo', image: 'https://i.imgur.com/uN1m5R4.png' },
    { title: 'Squad', image: 'https://i.imgur.com/q3sYf8t.png' },
    { title: 'Clash Squad', image: 'https://i.imgur.com/nJb7wTj.png' },
    { title: 'eSports', image: 'https://i.imgur.com/C3Yd5A3.png' },
    { title: 'Fantasy', image: 'https://i.imgur.com/R8i5tC8.png' },
];

const AnnouncementBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    if (!isVisible) return null;

    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 text-sm border border-theme mb-4 fade-in-up">
            <SpeakerWaveIcon className="w-5 h-5 text-accent-primary flex-shrink-0" />
            <p className="text-theme-secondary flex-grow">Submitting incorrect character ID might get you suspended.</p>
            <button onClick={() => setIsVisible(false)} className="text-theme-secondary hover:text-white text-lg">&times;</button>
        </div>
    );
}

const CategoryCard: React.FC<{ title: string; image: string; style?: React.CSSProperties }> = ({ title, image, style }) => (
    <div
        className="relative bg-card rounded-lg border border-theme shadow-md overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-primary/10 fade-in-up"
        style={style}
    >
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <FireIcon className="absolute top-2 right-2 w-6 h-6 text-red-500/80" />
        <h3 className="absolute bottom-2 left-3 text-base font-bold text-white">{title}</h3>
    </div>
);

const GameScreen: React.FC = () => {
    return (
        <div className="space-y-6">
            <AnnouncementBanner />

            <div className="rounded-xl overflow-hidden shadow-lg border border-theme fade-in-up" style={{ animationDelay: '100ms' }}>
                 <ImageSlider images={staticSliderImages} />
            </div>

            <div className="fade-in-up" style={{animationDelay: '200ms'}}>
                <h2 className="text-xl font-bold text-theme-primary mb-3 uppercase tracking-wider">Contest & Tournaments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 stagger-children">
                    {contestCategories.map((category, index) => (
                        <CategoryCard
                            key={category.title}
                            {...category}
                            style={{'--stagger-delay': `${300 + index * 75}ms`} as React.CSSProperties}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameScreen;
