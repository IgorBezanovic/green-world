import { EventCard } from '@green-world/components';
import { Carousel, Empty, Skeleton } from 'antd';
import clsx from 'clsx';

export const EventCarousel = ({ ...props }) => {
  const events = Array.isArray(props.events) ? props.events : [];

  return events && events.length > 0 ? (
    <Skeleton loading={props.isLoading} active>
      <Carousel
        draggable={true}
        infinite
        slidesToShow={2}
        rows={2}
        responsive={[
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 1
            }
          }
        ]}
        slidesToScroll={1}
        className={clsx('w-full')}
      >
        {events.map((event) => (
          <div key={event.title} className="p-2">
            <EventCard event={event} />
          </div>
        ))}
      </Carousel>
    </Skeleton>
  ) : (
    <Empty />
  );
};
