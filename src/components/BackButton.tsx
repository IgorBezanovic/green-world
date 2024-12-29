import { useNavigate } from 'react-router-dom';

import { CustomButton } from './CustomButton';

interface BackButtonProps {
  route?: string;
}

export const BackButton = ({ route }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (route) {
      navigate(route);
    } else {
      navigate(-1);
    }
  };

  return (
    <CustomButton
      onClick={handleNavigate}
      text={'Nazad'}
      type={'text'}
      customStyle={['max-w-[100px]']}
    />
  );
};
