import { useState } from "react";

const hobbies = {
  1: { name: "Baseball", desc: "Growing up, my parents signed me up for every sport you can think of. I played football, basketball, soccer, track, hapkido, the list goes on. Yet, one stood out to me like no other. Baseball is my favorite sport to this day, and it isn't close. Besides the immense fun I had playing America's Pastime, the sport is far more than throwing balls and hitting bombs. Behind each pitch, swing, and play, there are incredible hours of research and training. A pitcher must hone their movement and control to strengthen their arsenal of pitches while studying what each batter can hit or not. A batter must sharpen their mechanics and not be tricked by a ball that moves from their chest to feet in a matter of seconds while also studying what each pitcher can throw and when they will throw it. These athletes make tiny, miniscule adjustments to their craft, pushing towards perfection in a sisyphus-like fashion as their opponents also change and improve. It is for this reason that most players do not have a 'prime' for more than a year; because by the next season, the entire league has disected their form and poked a thousand holes into it. Many say that baseball is boring, and I understand why they say it. But when you think about the effort behind each pitch, there is a surreal sense of awe and appreciation for the men I consider idols." },
  2: { name: "Photography", desc: "For me, photography is all about telling stories. Each picture is a little chapter in my life's storybook. I might take a picture of a place I visited, and when I look at it years later, I remember not just what it looked like, but the whole adventure: the people I was with, the food we ate, the funny things that happened. Or, I might snap a photo of a casual hangout with friends, and it brings back a flood of memories – inside jokes, shared experiences, and the feeling of being in good company. It's amazing how much detail a single photo can hold. It's not just about capturing a pretty picture; it's about capturing a piece of life, a moment that matters. And as I look back through my photos, I can see my own personal journey unfold, the places I've been, the people I've met, and the experiences that have shaped me" },
  3: { name: "Thrifting", desc: "Although I started thrifting out of pure dislike for my old wardrobe and lack of funds to replace it otherwise, I have often thought about why the trend of thrifting has become so popular and engraved in modern culture. Is it because of the prices compared to retail? The support for sustainability and reuse of clothes? Maybe you just didn't want to break in those berkinstocks yourself. Most people do it for its affordability, but I now find it quite relaxing and therapeutic. That may be because it fuels a minute spending addiction, but I think thrifting itself is deeper than that. Someone threw this shirt away because they grew old of it, yet the same shirt evokes excitement and happiness when I find it on a rack. I tend to donate my unused clothes to charities as well. It makes me wonder if any of the clothes I so nonchalantly threw away are loved and cared for by someone out there. Maybe a parent bought those small khaki pants for their child; maybe a girl bought that massive sweater for their boyfriend. Through all the politics of fast fashion to brand wars, there is a small continuous circle of giving, appreciating, and thrifting clothes." },
  4: { name: "Films", desc: "Films are portals. For two hours, I step into another universe, a world that can subtly, yet profoundly, reshape my own. It's the sheer power of that brief immersion that captivates me—how a single film can weave itself into the fabric of my being, becoming a part of who I am. Whether I'm seeking a lesson, a thrilling plot, or simply a moment of escape, cinema offers a transformative experience, a mirror reflecting the vastness of human emotion and possibility." },
  5: { name: "Philosophy", desc: "Philosophy isn't about memorizing doctrines or chasing elusive epiphanies. It's about cultivating a mind that's curious, analytical, and open to diverse perspectives. While the pursuit of ultimate truths might be a lifelong, perhaps even unattainable, quest, the act of grappling with philosophical questions offers immense personal value. It sharpens your reasoning, expands your worldview, and encourages you to examine your own beliefs. More than a body of knowledge, philosophy is a tool for self-discovery and intellectual growth. It's the practice of thoughtful inquiry that makes it a worthwhile and enriching pursuit." }
};

const scores = [
  [1, "X", "X", 2, "X", "X", "X", 4, "X", 7],
  ["X", 3, "X", "X", "X", "X", "X", "X", 5, 8],
];

const Scoreboard = () => {
  const [selectedHobby, setSelectedHobby] = useState(null);

  return (
    <div className="p-4">
      <div className="border-2 border-black rounded-lg p-2 mb-4 bg-gray-200">
        <h2 className="text-center font-bold text-lg mb-2">Click a score 1-5 to read about my hobbies</h2>
        <div className="grid grid-cols-10 gap-1 text-center font-bold">
          {[...Array(10).keys()].map((inning) => (
            <div key={inning} className="border border-black p-2 bg-gray-300">
              {inning + 1 === 10 ? "R" : inning + 1}
            </div>
          ))}
        </div>
        {scores.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-1 text-center">
            {row.map((score, colIndex) => (
              <div
                key={colIndex}
                className={`border border-black p-2 cursor-pointer bg-white ${hobbies[score] ? "hover:bg-blue-200" : ""}`}
                onClick={() => hobbies[score] && setSelectedHobby(hobbies[score])}
              >
                {score}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedHobby && (
        <div className="p-4 border-2 border-black rounded-lg bg-white text-center mt-4">
          <h3 className="text-lg font-bold">{selectedHobby.name}</h3>
          <p className="text-md mt-2">{selectedHobby.desc}</p>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
