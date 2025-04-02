import { Carousel, Empty, Skeleton } from 'antd';
import clsx from 'clsx';
import { EventCard } from './/EventCard.tsx';

export const EventCarousel = ({ ...props }) => {
  const events = Array.isArray(props.events) ? props.events : [];
  console.log(events);
  return events && events.length > 0 ? (
    <Skeleton loading={props.isLoading} active>
      <Carousel
        arrows
        draggable={true}
        infinite
        slidesToShow={4}
        responsive={[
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2
            }
          }
        ]}
        slidesToScroll={1}
        className={clsx('w-full')}
      >
        {events.map((event: any) => (
          <div key={event.title} className="px-1">
            <EventCard
              events={events}
            />
          </div>
        ))}
      </Carousel>
    </Skeleton>
  ) : (
    <Empty />
  );
};
