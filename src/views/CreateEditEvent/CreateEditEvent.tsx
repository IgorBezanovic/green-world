import { LoadingOutlined } from '@ant-design/icons';
import { BackButton, CustomButton, CustomInput } from '@green-world/components';
import { useCreateEvent } from '@green-world/hooks/useCreateEvent';
import { useEditEvent } from '@green-world/hooks/useEditEvent';
import { useEvent } from '@green-world/hooks/useEvent';
import { useImage } from '@green-world/hooks/useImage';
import { Event } from '@green-world/utils/types';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PhoneInput from 'react-phone-input-2';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css';

const initEvent: Event = {
  title: '',
  description: '',
  place: '',
  address: '',
  coverImage: '',
  dateAction: dayjs(),
  startTime: '',
  endTime: '',
  typeAction: 'cleaning',
  contactPerson: '',
  contactPhone: '',
  contactMail: '',
  status: 'active'
};

export const CreateEditEvent = () => {
  const { eventID = '' } = useParams();
  const { data = initEvent, isLoading } = useEvent(eventID);
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      { header: [false, '1', '2', '3', '4', '5', '6'] },
      { font: [] },
      { color: [] },
      { background: [] },
      { list: 'ordered' },
      { list: 'bullet' },
      { align: [] },
      'bold',
      'italic',
      'underline',
      'strike',
      'link',
      'image',
      'video',
      'blockquote',
      { script: 'sub' },
      { script: 'super' }
    ]
  };

  const {
    mutate: imageMutate,
    isLoading: isImageLoading,
    data: eventImage
  } = useImage();

  const { mutate: createMutation, isLoading: isLoadingCreateEvent } =
    useCreateEvent();

  const { mutate: editMutation, isLoading: isLoadingEditEvent } =
    useEditEvent(eventID);

  const [event, setEvent] = useState<Event>(initEvent);

  useEffect(() => {
    if (!isLoading) {
      setEvent(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (eventImage) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        coverImage: eventImage
      }));
    }
  }, [eventImage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = Array.from(e.target.files!)[0];

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    eventID ? editMutation(event) : createMutation(event);
  };

  const handleRichTextDescription = (richText: string) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      description: richText
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined className="text-forestGreen text-4xl" />
      </div>
    );
  }

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>
          Zeleni svet | {eventID ? 'Azuziraj aktivnost' : 'Kreiraj aktivnost'}
        </title>
        <link rel="canonical" href="https://www.zelenisvet.rs/create-event" />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-10',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <section
          className={clsx(
            'flex',
            'items-center',
            'w-full',
            'justify-center',
            'relative',
            'mb-4'
          )}
        >
          <Box
            component="div"
            className={clsx('hidden', 'md:flex', 'absolute', 'left-0')}
          >
            <BackButton />
          </Box>
          <h1
            className={clsx(
              'text-forestGreen',
              'text-5xl',
              'md:text-6xl',
              'font-ephesis'
            )}
          >
            {eventID ? 'Azuziraj aktivnost' : 'Kreiraj aktivnost'}
          </h1>
        </section>
        <form
          className={clsx('flex', 'flex-col', 'md:flex-row', 'md:gap-10')}
          onSubmit={handleSubmit}
        >
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Naziv aktivnosti:
            </label>
            <CustomInput
              required
              type="text"
              name="title"
              id="title"
              placeholder="Unesite naziv daktivnosti"
              value={event?.title || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="typeAction"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Tip aktivnosti:
            </label>
            <select
              name="typeAction"
              id="typeAction"
              value={event?.typeAction || ''}
              onChange={handleChange}
              className={clsx(
                'border',
                'border-forestGreen',
                'flex-1',
                'flex-grow-0',
                'rounded-md',
                'shadow-md',
                'h-full',
                'min-h-[42px]',
                'md:hover:shadow-lg',
                'mb-4',
                'pl-2'
              )}
            >
              <option value="" disabled>
                Izaberite tip aktivnosti
              </option>
              <option value="cleaning">Čišćenje</option>
              <option value="selling">Prodaja</option>
              <option value="planting">Sadnja</option>
            </select>
            <label
              htmlFor="contactPerson"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Kontakt osoba:
            </label>
            <CustomInput
              type="text"
              name="contactPerson"
              id="contactPerson"
              placeholder="Kontakt osoba"
              value={event?.contactPerson || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="place"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Mesto aktivnosti:
            </label>
            <CustomInput
              required
              type="text"
              name="place"
              id="place"
              placeholder="Unesite mesto proizvoda"
              value={event?.place || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="address"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Adresa aktivnosti:
            </label>
            <CustomInput
              type="text"
              name="address"
              id="address"
              placeholder="Unesite adresu aktivnosti"
              value={event?.address || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="coverImage"
              className={clsx(
                'text-forestGreen',
                'cursor-pointer',
                'text-lg',
                'mb-2'
              )}
            >
              Dodajte fotografiju aktivnosti:
            </label>
            <div
              className={clsx(
                'h-[150px]',
                'w-[150px]',
                'flex',
                'items-center',
                'justify-center',
                'mb-4',
                'shadow-md',
                'rounded-md',
                'overflow-hidden'
              )}
            >
              {isImageLoading ? (
                <LoadingOutlined className="text-forestGreen text-4xl" />
              ) : event?.coverImage ? (
                <img
                  src={event?.coverImage}
                  alt="event-image"
                  className={clsx('aspect-square', 'shadow-md')}
                  height="100%"
                  width="100%"
                />
              ) : (
                <label htmlFor="coverImage" className="cursor-pointer">
                  <AddPhotoAlternateIcon
                    sx={{ width: '100px', height: '100px', color: 'gray' }}
                  />
                </label>
              )}
            </div>
            <label
              htmlFor="coverImage"
              className={clsx(
                'border',
                'border-forestGreen',
                'text-forestGreen',
                'rounded',
                'py-2',
                'px-4',
                'shadow-md',
                'bg-whiteLinen',
                'text-center',
                'cursor-pointer',
                'mx-auto',
                'md:mx-0',
                'uppercase',
                'font-light',
                'mb-4',
                'md:mb-0',
                'transition-all',
                'duration-300',
                'md:hover:text-black',
                'md:hover:shadow-lg',
                'md:hover:translate-y-[-1px]',
                'md:active:translate-y-0',
                'md:active:shadow-md'
              )}
            >
              Dodaj sliku proizvoda
            </label>
            <input
              type="file"
              name="coverImage"
              id="coverImage"
              accept="image/*"
              onChange={handleImage}
              className={clsx('hidden')}
            ></input>
          </div>
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="description"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Opis aktivnosti:
            </label>
            <div className={clsx('mb-4')}>
              <ReactQuill
                ref={quillRef}
                modules={modules}
                value={event?.description || ''}
                onChange={handleRichTextDescription}
                id="description"
                theme="snow"
              />
            </div>
            <label
              htmlFor="dateAction"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Datum aktivnosti:
            </label>
            <MobileDatePicker
              name="dateAction"
              value={dayjs(event?.dateAction, 'DD/MM/YYYY')}
              format="DD/MM/YYYY"
              minDate={dayjs()}
              onChange={(newDate) =>
                setEvent({
                  ...event,
                  dateAction: dayjs(newDate).format('DD/MM/YYYY')
                })
              }
              sx={(theme) => ({
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)'
                },
                marginBottom: '16px',
                '& .MuiPickersSectionList-root': {
                  padding: '10px 0',
                  borderColor: theme.palette.custom.forestGreen
                }
              })}
            />
            <label
              htmlFor="startTime"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vreme pocetka aktivnosti:
            </label>
            <CustomInput
              required
              type="text"
              name="startTime"
              id="startTime"
              placeholder="Unesite vreme pocetka aktivnosti"
              value={event?.startTime || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="endTime"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vreme zavrsetka aktivnosti:
            </label>
            <CustomInput
              type="text"
              name="endTime"
              id="endTime"
              placeholder="Unesite vreme zatvaranja aktivnosti"
              value={event?.endTime || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="contactPhone"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Kontakt telefon:
            </label>
            <PhoneInput
              country="rs"
              value={event?.contactPhone || ''}
              onChange={(value) =>
                setEvent((prevEvent) => ({
                  ...prevEvent,
                  contactPhone: value
                }))
              }
              inputStyle={{
                width: '100%',
                height: '42px',
                background: 'white',
                borderRadius: '6px',
                border: '1px solid #266041',
                boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
                paddingLeft: '55px'
              }}
              buttonStyle={{
                background: 'white',
                width: '50px',
                border: '1px solid #266041',
                borderRadius: '6px 0 0 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              containerStyle={{
                marginBottom: '16px'
              }}
              placeholder="+381 60 123 456 7"
            />
            <label
              htmlFor="contactMail"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Kontakt mail:
            </label>
            <CustomInput
              type="text"
              name="contactMail"
              id="contactMail"
              placeholder="Kontakt mail"
              value={event?.contactMail || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="status"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Status akcije:
            </label>
            <select
              required
              name="status"
              id="status"
              value={event?.typeAction || ''}
              onChange={handleChange}
              className={clsx(
                'border',
                'border-forestGreen',
                'rounded-md',
                'min-h-[42px]',
                'shadow-md',
                'md:hover:shadow-lg',
                'flex-1',
                'flex-grow-0',
                'h-full',
                'mb-4',
                'pl-2'
              )}
            >
              <option value="" disabled>
                Izaberite status akcije
              </option>
              <option value="active">Aktivno</option>
              <option value="cancelled">Otkazano</option>
              <option value="finished">Zavrseno</option>
            </select>
            <CustomButton
              htmlType="submit"
              type="text"
              text={
                isLoadingCreateEvent || isLoadingEditEvent ? (
                  <LoadingOutlined
                    className={clsx('text-groupTransparent', 'my-2')}
                  />
                ) : eventID ? (
                  'Azuriraj aktivnosti'
                ) : (
                  'Kreiraj aktivnost'
                )
              }
              customStyle={[
                'mt-6',
                {
                  'border-groupTransparent':
                    isLoadingCreateEvent || isLoadingEditEvent
                }
              ]}
              disabled={isLoadingCreateEvent || isLoadingEditEvent}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
