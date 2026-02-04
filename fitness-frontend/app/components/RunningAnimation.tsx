'use client';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function RunningAnimation() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/animations/running-on-treadmill.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Error loading animation:', err));
  }, []);

  if (!animationData) {
    return <p className="text-gray-400 text-sm">Loading animation...</p>;
  }

  return (
    <div className="w-64 h-64 md:w-80 md:h-80 flex justify-center items-center">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
