
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  background: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  
  const handlePrevious = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative">
              <div 
                className="relative h-[500px] w-full flex items-center justify-center" 
                style={{ 
                  background: slide.background,
                  backgroundSize: "cover",
                  backgroundPosition: "center" 
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                
                <div className="relative z-10 bg-white/90 max-w-lg p-8 rounded-sm shadow-md mx-4">
                  <h2 className="text-2xl font-bold text-orange-500 mb-3">{slide.title}</h2>
                  <p className="text-gray-700 mb-4">{slide.description}</p>
                  
                  {slide.buttonText && (
                    <div className="flex justify-end">
                      <a href={slide.buttonLink || "#"} className="inline-flex items-center text-blue-800 font-semibold hover:underline">
                        {slide.buttonText} <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 hover:bg-white h-12 w-12"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
        </div>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 hover:bg-white h-12 w-12"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </Carousel>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === current ? "bg-white w-4" : "bg-white/60"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
