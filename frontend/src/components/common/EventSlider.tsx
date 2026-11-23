import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { WeddingEventItem } from '../../types/wedding';
import { EventCard } from './EventCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface EventSliderProps {
  events: WeddingEventItem[];
}

export const EventSlider: React.FC<EventSliderProps> = ({ events }) => {
  return (
    <div className="w-full relative px-2 sm:px-4 py-4">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 28,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="w-full pb-14"
      >
        {events.map((evt, idx) => (
          <SwiperSlide key={evt.id || idx} className="h-auto pb-4">
            <EventCard event={evt} index={idx} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventSlider;
