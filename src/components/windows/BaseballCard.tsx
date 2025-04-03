import { useState } from 'react';

type CardContent = {
  id: string;
  title: string;
  image?: string;
  content: {
    name?: string;
    position?: string;
    age?: string;
    interests?: string[];
    fav_player?: string;
    stats?: {
      label: string;
      value: string;
    }[];
    description?: string;
    links?: {
      label: string;
      url: string;
    }[];
  };
};

// Update image paths to use import statements for proper bundling
import playerCardImg from '/images/player_card.jpeg';
import aboutMeImg from '/images/about_me.jpg';
import expImg from '/images/exp.jpg';
import blogImg from '/images/blogpixel.png';
import myCV from '/files/Kana_Sadahiro_CV4.pdf'

const cards: CardContent[] = [
  {
    id: 'player',
    title: 'Player Card',
    image: playerCardImg,
    content: {
      name: 'Kana Sadahiro',
      position: 'Bats/Throws: R/R',
      age: 'Age: 21',
      fav_player: 'Ichiro Suzuki',
      interests: ['Baseball', 'Real Estate', 'Writing', 'Films', 'Photography'],
      stats: [
        { label: 'Movies watched/month', value: '5' },
        { label: 'Coffees/week', value: '6' },
        { label: 'Digits of pi memorized', value: '100' },
        { label: 'Ballparks visited', value: '10/30' }
      ]
    }
  },
  {
    id: 'about',
    title: 'About Me',
    image: aboutMeImg,
    content: {
      description: "Hi! I'm Kana, a third year at UC Berkeley. My experience covers real estate, machine learning, and optimization, and I'm proficient in econometrics and data analysis. I want to blend my interests to improve accessibility to housing and help as many people as possible along the way. \ \ I like baseball, watching films, warm evening walks, new york times games, and philosophy."
    }
  },
  {
    id: 'experience',
    title: 'Experience',
    image: expImg,
    content: {
      description: "I have over 4 years of experience in the real estate industry, but have had plenty of contributions to technical projects ranging from LLM evaluation research to how humans and AI algorithms interact and coexist. \ I also am comfortable with anything data, having created a prediction model on par with Vegas's MLB gambling lines.",
      links: [
        { label: 'View my CV', url: myCV }
      ]
    }
  },
  {
    id: 'blog',
    title: 'Blog',
    image: blogImg,
    content: {
      description: 'When I am not going to baseball games and watching classic films, I am contemplating life and purpose. Although far from revolutionary, I think this is a good way to track how my mentality and life outlook matures.',
      links: [
        { label: 'Read my blog', url: 'https://innovative-loganberry-939.notion.site/Thoughts-by-Kana-130222e64b9b804a8f89d547491fad03' }
      ]
    }
  }
];

const BaseballCard = () => {
  const [selectedCard, setSelectedCard] = useState<CardContent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (card: CardContent) => {
    setSelectedCard(card);
    setIsExpanded(true);
  };

  const handleBackClick = () => {
    setIsExpanded(false);
    setSelectedCard(null);
  };

  return (
    <div className="h-full flex flex-col font-pixel overflow-hidden">
      <div className="p-4 h-full overflow-auto">
        {!isExpanded ? (
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card) => (
              <div 
                key={card.id}
                className="border-2 border-blue-800 rounded-lg bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-48"
                onClick={() => handleCardClick(card)}
              >
                <div className="h-full w-full relative">
                  {card.image ? (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-2 py-1">
                        <div className="text-white text-sm font-pixel truncate">{card.title}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <div className="text-blue-800 font-pixel">{card.title}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <button 
              onClick={handleBackClick}
              className="self-start mb-4 px-3 py-1 bg-blue-800 text-white rounded hover:bg-opacity-90"
            >
              Back to cards
            </button>
            
            <div className="border-4 border-blue-800 rounded-lg bg-white overflow-hidden flex-1">
              <div className="bg-blue-800 text-white font-pixel py-1 px-2">
                {selectedCard?.title || 'Baseball Card'}
              </div>
              <div className="p-4">
                {selectedCard?.id === 'player' ? (
                  <div>
                    <div className="text-xl font-pixel mb-1">{selectedCard.content.name}</div>
                    <div className="text-sm mb-1">{selectedCard.content.position}</div>
                    <div className="text-sm mb-3">{selectedCard.content.age}</div>
                    
                    <div className="mb-3">
                      <div className="font-pixel mb-1">Interests:</div>
                      <div className="text-sm">{selectedCard.content.interests?.join(', ')}</div>
                    </div>
                    
                    <div>
                      <div className="font-pixel mb-2">Fun Stats:</div>
                      <ul className="list-disc pl-5 text-sm">
                        {selectedCard.content.stats?.map((stat, index) => (
                          <li key={index}>{stat.label}: {stat.value}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg mb-4">{selectedCard?.content.description}</div>
                    
                    {selectedCard?.content.links && selectedCard.content.links.length > 0 && (
                      <div className="mt-4">
                        {selectedCard.content.links.map((link, index) => (
                          <a 
                            key={index}
                            href={link.url}
                            className="text-blue-800 underline hover:text-opacity-80"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseballCard;
