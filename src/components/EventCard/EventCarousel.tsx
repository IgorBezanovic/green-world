import { Carousel, Empty, Skeleton } from 'antd';
import clsx from 'clsx';
import { EventCard } from './EventCard.tsx';

export const EventCarousel = ({ ...props }) => {
  console.log(props);
  const events = Array.isArray(props.events) ? props.events : [];
  console.log(events);
  return events && events.length > 0 ? (
    <Skeleton loading={props.isLoading} active>
      <Carousel
        arrows
        draggable={true}
        infinite
        slidesToShow={3}
        responsive={[
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }
        ]}
        slidesToScroll={1}
        className={clsx('w-full')}
      >
        {events.map((event) => (
          <div key={event.title}>
            <EventCard event={event} />
          </div>
        ))}
      </Carousel>
    </Skeleton>
  ) : (
    <Empty />
  );
};
