import { formatImageUrl } from '@green-world/utils/helpers';
import { BlogBlock as BlogBlockType } from '@green-world/utils/types';

interface BlogBlockProps {
  block: BlogBlockType;
}

export const BlogBlock = ({ block }: BlogBlockProps) => {
  return (
    <div className="mb-6">
      {block.type === 'text' && (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: block.text || '' }}
        />
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
            <img src={block.image} alt="" className="w-full rounded mb-2" />
          )}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: block.text || '' }}
          />
        </>
      )}
    </div>
  );
};
