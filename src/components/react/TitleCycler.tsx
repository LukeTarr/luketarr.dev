import { useState, useEffect } from 'react';

const TitleCycler = () => {
  const titles = [
    "Software Engineer",
    "Open Source Contributor",
    "Web Developer",
    "Tech Blogger",
    "Full Stack Developer",
    "AI Enthusiast",
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start fade out
      setIsVisible(false);
      
      // Wait for fade out, then change text and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === titles.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 900); // Half of the transition duration
      
    }, 1500); // Total time for each title
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="min-h-[40px] flex items-center justify-center">
      <h1 
        className={`text-2xl font-bold transition-opacity duration-1000 
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {titles[currentIndex]}
      </h1>
    </div>
  );
};

export default TitleCycler;