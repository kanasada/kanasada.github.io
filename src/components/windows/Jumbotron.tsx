import { useState, useEffect } from 'react';

const Jumbotron = () => {
  const [announcement, setAnnouncement] = useState("WELCOME TO KANA'S STADIUM!");

  useEffect(() => {
    const announcements = [
      "WELCOME TO KANA'S STADIUM!",
      "CHECK OUT OUR LATEST PROJECTS!",
      "THANKS FOR VISITING!",
      "MAKE SOME NOISE!",
      "LET'S GO DODGERS!",
    ];

    const interval = setInterval(() => {
      const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)];
      setAnnouncement(randomAnnouncement);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col font-ms-sans">
      <h2 className="text-lg font-bold mb-4 text-blue">Dodgers Legendary Moments</h2>

      <div className="mb-4 bg-black text-yellow-300 font-pixel text-xl p-2 text-center animate-blink">
        {announcement}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="win95-inset p-2 flex-1 mb-2">
          <div className="h-full relative">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/videoseries?si=Q1GGufncqXn4H70B&amp;controls=0&amp;list=PL38PovI3ABXaVNj5kYIMswiWr8h1bY82a"
              title="Dodgers Legendary Moments"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;


//
// import { useState, useEffect } from 'react';
//
// interface Project {
//   title: string;
//   description: string;
//   technologies: string[];
//   year: number;
//   image?: string;
// }
//
// const projects: Project[] = [
//   {
//     title: "Team Statistics Dashboard",
//     description: "A comprehensive dashboard for tracking player and team statistics throughout the season.",
//     technologies: ["React", "D3.js", "Node.js"],
//     year: 2022,
//   },
//   {
//     title: "Stadium Ticket Booking System",
//     description: "An online platform for purchasing tickets to baseball games with interactive seat selection.",
//     technologies: ["Vue.js", "Express", "MongoDB"],
//     year: 2021,
//   },
//   {
//     title: "Baseball Training App",
//     description: "Mobile application for baseball players to track their training progress and receive personalized coaching.",
//     technologies: ["React Native", "Firebase", "TensorFlow"],
//     year: 2020,
//   },
//   {
//     title: "Fantasy Baseball Manager",
//     description: "A fantasy baseball league management system with real-time stat updates and draft tools.",
//     technologies: ["Angular", "AWS", "GraphQL"],
//     year: 2019,
//   },
// ];
//
// const Jumbotron = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const [announcement, setAnnouncement] = useState("WELCOME TO KANA'S STADIUM!");
//
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//
//     if (isAutoPlaying) {
//       interval = setInterval(() => {
//         setCurrentSlide(prev => (prev + 1) % projects.length);
//       }, 5000);
//     }
//
//     return () => clearInterval(interval);
//   }, [isAutoPlaying]);
//
//   useEffect(() => {
//     const announcements = [
//       "WELCOME TO KANA'S STADIUM!",
//       "CHECK OUT OUR LATEST PROJECTS!",
//       "THANKS FOR VISITING!",
//       "MAKE SOME NOISE!",
//       "LET'S GO TIGERS!",
//     ];
//
//     const interval = setInterval(() => {
//       const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)];
//       setAnnouncement(randomAnnouncement);
//     }, 4000);
//
//     return () => clearInterval(interval);
//   }, []);
//
//   const handlePrev = () => {
//     setIsAutoPlaying(false);
//     setCurrentSlide(prev => (prev - 1 + projects.length) % projects.length);
//   };
//
//   const handleNext = () => {
//     setIsAutoPlaying(false);
//     setCurrentSlide(prev => (prev + 1) % projects.length);
//   };
//
//   const handleDotClick = (index: number) => {
//     setIsAutoPlaying(false);
//     setCurrentSlide(index);
//   };
//
//   return (
//     <div className="h-full flex flex-col font-ms-sans">
//       <h2 className="text-lg font-bold mb-4 text-baseball-green">Jumbotron - Portfolio Projects</h2>
//
//       <div className="mb-4 bg-black text-yellow-300 font-pixel text-xl p-2 text-center animate-blink">
//         {announcement}
//       </div>
//
//       <div className="flex-1 overflow-hidden flex flex-col">
//         <div className="win95-inset p-2 flex-1 mb-2">
//           <div className="h-full relative">
//             {projects.map((project, index) => (
//               <div
//                 key={index}
//                 className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
//                   index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
//                 }`}
//               >
//                 <div className="bg-gray-200 h-32 flex items-center justify-center mb-3">
//                   <div className="text-center text-gray-500">
//                     [Project Screenshot]
//                   </div>
//                 </div>
//
//                 <div>
//                   <h3 className="font-bold text-lg mb-1">{project.title}</h3>
//                   <div className="text-xs text-gray-500 mb-2">Year: {project.year}</div>
//                   <p className="text-sm mb-3">{project.description}</p>
//
//                   <div className="flex flex-wrap gap-1">
//                     {project.technologies.map((tech, i) => (
//                       <span
//                         key={i}
//                         className="bg-baseball-green text-white text-xs px-2 py-0.5 rounded"
//                       >
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//
//         <div className="flex justify-between items-center">
//           <button onClick={handlePrev} className="win95-button text-sm">
//             Previous
//           </button>
//
//           <div className="flex gap-1">
//             {projects.map((_, index) => (
//               <button
//                 key={index}
//                 className={`w-3 h-3 rounded-full ${
//                   index === currentSlide ? 'bg-baseball-green' : 'bg-gray-300'
//                 }`}
//                 onClick={() => handleDotClick(index)}
//               />
//             ))}
//           </div>
//
//           <button onClick={handleNext} className="win95-button text-sm">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Jumbotron;
