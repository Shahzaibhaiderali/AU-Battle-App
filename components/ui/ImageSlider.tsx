
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../constants';

interface ImageSliderProps {
  images: string[];
  autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images]);
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (autoPlayInterval) {
      const timer = setTimeout(goToNext, autoPlayInterval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, goToNext, autoPlayInterval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="h-48 md:h-64 lg:h-80 w-full relative group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="w-full h-full bg-center bg-cover duration-500"
      ></div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block lg:block absolute top-1/2 -translate-y-1/2 left-2 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer" onClick={goToPrevious}>
        <ChevronLeftIcon className="w-6 h-6" />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block lg:block absolute top-1/2 -translate-y-1/2 right-2 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer" onClick={goToNext}>
        <ChevronRightIcon className="w-6 h-6" />
      </div>
      <div className="flex top-4 justify-center py-2 absolute bottom-2 left-1/2 -translate-x-1/2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`transition-all w-2 h-2 mx-1 rounded-full cursor-pointer ${currentIndex === slideIndex ? 'bg-white p-1' : 'bg-white/50'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
