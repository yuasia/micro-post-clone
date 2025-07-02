export const USER_CONSTRAINTS = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 120,
  },
  HASH: {
    ALGORITHM: 'md5',
  },
} as const;
