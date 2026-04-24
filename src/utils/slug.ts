type SlugEntity =
  | string
  | {
      slug?: string | null;
      _id?: string | null;
      id?: string | null;
    }
  | null
  | undefined;

export const slugOrId = (value: SlugEntity) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return String(value.slug || value._id || value.id || '');
};
