import { formatImageUrl } from '@green-world/utils/helpers';
import { getHtmlDescriptionProps } from '@green-world/utils/helpers';
import { BlogBlock as BlogBlockType } from '@green-world/utils/types';
import { Box } from '@mui/material';

interface BlogBlockProps {
  block: BlogBlockType;
}

export const BlogBlock = ({ block }: BlogBlockProps) => {
  return (
    <div className="mb-6">
      {block.type === 'text' && block.text && (
        <Box {...getHtmlDescriptionProps(block.text)} />
      )}

      {block.type === 'image' && block.image && (
        <img
          src={formatImageUrl(block.image)}
          alt=""
          className="w-full rounded mb-2"
        />
      )}

      {block.type === 'mixed' && (
        <>
          {block.image && (
            <img
              src={formatImageUrl(block.image)}
              alt=""
              className="w-full rounded mb-2"
            />
          )}
          {block.text && <Box {...getHtmlDescriptionProps(block.text)} />}
        </>
      )}
    </div>
  );
};
