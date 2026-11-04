import React, { useState } from 'react';

interface SplineRobotProps {
  onLoad?: () => void;
}

const SplineRobot: React.FC<SplineRobotProps> = ({ onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-y-0 w-[140%] -left-[20%] pointer-events-none">
      <iframe
        src="https://my.spline.design/genkubgreetingrobot-MW4W3iAFsJj5olFfT1MhN0TH/"
        title="Interactive 3D Greeting Robot"
        loading="lazy"
        frameBorder="0"
        width="100%"
        height="100%"
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        className={`w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

export default SplineRobot;
