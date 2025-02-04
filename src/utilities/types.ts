import { Token } from './../../node_modules/@sqltools/formatter/lib/core/types.d';
export type JWTPayloadType = {
  userId: number;
  role: string;
};

export type TokenType = {
  token: string;
};
