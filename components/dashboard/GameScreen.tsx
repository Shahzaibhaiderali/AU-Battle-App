import React from 'react';
import { ASSETS } from '../../constants';
import { Button } from '../ui/Button';
import ImageSlider from '../ui/ImageSlider';

const gameData = [
    {
        title: 'Chronicles of Valhoryn',
        description: 'Forge your destiny in a war-torn land of myth and magic. Lead legions and conquer kingdoms.',
        image: ASSETS.GAME_1,
    },
    {
        title: 'Neon Drift: Sector 7',
        description: 'Race through rain-slicked cyberpunk streets in high-octane vehicles. The future is fast.',
        image: ASSETS.GAME_2,
    },
    {
        title: 'WyrmSlayer\'s Arena',
        description: 'Face legendary beasts in a gladiatorial arena. Only the bravest warriors will survive.',
        image: ASSETS.GAME_3,
    },
];

const GameCard: React.FC<{ title: string; description: string; image: string; style?: React.CSSProperties }> = ({ title, description, image, style }) => (
    <div 
        className="bg-card rounded-xl border border-theme shadow-lg overflow-hidden group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-primary/20 fade-in-up"
        style={style}
    >
        <div className="w-full h-48 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-5">
            <h3 className="text-xl font-bold text-theme-primary mb-2 truncate">{title}</h3>
            <p className="text-theme-secondary text-sm h-10 mb-4">{description}</p>
            <Button fullWidth>Join Match</Button>
        </div>
    </div>
);


const GameScreen: React.FC = () => {
    const sliderImages = [
        'https://i.imgur.com/GZSLk3K.jpg',
        'https://i.imgur.com/W2u20Rj.jpg',
        'https://i.imgur.com/8z2e4Iq.jpg',
        'https://i.imgur.com/mI4G7S1.jpg',
        'https://i.imgur.com/sTqDWd8.jpg'
    ];

    return (
        <div>
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-theme fade-in-up">
                 <ImageSlider images={sliderImages} />
            </div>

            <div className="text-center mb-8 fade-in-up" style={{animationDelay: '100ms'}}>
                <h1 className="text-3xl md:text-4xl font-bold text-theme-primary">Featured Games</h1>
                <p className="text-theme-secondary">Jump into the action with today's top picks.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 stagger-children">
                {gameData.map((game, index) => (
                    <GameCard 
                        key={game.title} 
                        {...game} 
                        style={{'--stagger-delay': `${200 + index * 100}ms`} as React.CSSProperties}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameScreen;