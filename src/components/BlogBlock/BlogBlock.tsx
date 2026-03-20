import { formatImageUrl } from '@green-world/utils/helpers';
import { getHtmlDescriptionProps } from '@green-world/utils/helpers';
import { BlogBlock as BlogBlockType } from '@green-world/utils/types';
import { Box } from '@mui/material';

interface BlogBlockProps {
  block: BlogBlockType;
}

export const BlogBlock = ({ block }: BlogBlockProps) => {
  return (
    <Box sx={{ mb: 1.5 }}>
      {block.type === 'text' && block.text && (
        <Box {...getHtmlDescriptionProps(block.text)} />
      )}

      {block.type === 'image' && block.image && (
        <img
          src={formatImageUrl(block.image)}
          alt=""
          style={{ width: '100%', borderRadius: 4, marginBottom: 8 }}
        />
      )}

      {block.type === 'mixed' && (
        <>
          {block.image && (
            <img
              src={formatImageUrl(block.image)}
              alt=""
              style={{ width: '100%', borderRadius: 4, marginBottom: 8 }}
            />
          )}
          {block.text && <Box {...getHtmlDescriptionProps(block.text)} />}
        </>
      )}
    </Box>
  );
};
