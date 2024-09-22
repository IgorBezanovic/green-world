import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { ReactNode } from 'react';

interface PopDeleteProps {
  children: ReactNode;
  title?: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  id: string;
  mutate: () => void;
}

export const PopDelete = ({ children, ...props }: PopDeleteProps) => {
  const handleDelete = () => {
    props.mutate();
  };

  return (
    <Popconfirm
      title={props.title}
      description={props.description}
      okText={props.okText}
      cancelText={props.cancelText}
      okButtonProps={{
        style: { backgroundColor: 'red', borderColor: 'red', padding: '0 25px' }
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: 'green',
          borderColor: 'green',
          padding: '0 25px',
          color: 'white'
        }
      }}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={handleDelete}
    >
      {children}
    </Popconfirm>
  );
};
