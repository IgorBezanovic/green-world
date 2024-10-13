import clsx from 'clsx';
import { useParams } from 'react-router-dom';

export const ProductPage = () => {
  const { productId } = useParams();
  console.log(productId);
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <h1>Stranica proizvoda</h1>
    </div>
  );
};
