// Type representant un succes ou un echec (Monade Result)
export type Result<T, E = Error> =
  | { ok: true; value: T; isOk(): true; isErr(): false }
  | { ok: false; error: E; isOk(): false; isErr(): true };

export function ok<T>(value: T): Result<T, any> {
  return {
    ok: true,
    value,
    isOk: () => true,
    isErr: () => false,
  };
}

export function err<E>(error: E): Result<any, E> {
  return {
    ok: false,
    error,
    isOk: () => false,
    isErr: () => true,
  };
}
