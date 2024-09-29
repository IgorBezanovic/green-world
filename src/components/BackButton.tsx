import { useNavigate } from 'react-router-dom';

import { CustomButton } from './CustomButton';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <CustomButton onClick={() => navigate(-1)} text={'Nazad'} type={'text'} />
  );
};
