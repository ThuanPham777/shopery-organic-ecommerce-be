export type PartialObject<T> = {
  [K in keyof T]?: T[K] extends Array<any>
    ? PartialObject<T[K][0]>[]
    : T[K] extends object
      ? PartialObject<T[K]>
      : T[K];
};

export type GetProps<T> = {
  [K in keyof T]?: T[K] extends Array<any>
    ? boolean | GetProps<T[K][0]>
    : T[K] extends object
      ? boolean | GetProps<T[K]>
      : T[K] extends string | number
        ? boolean
        : boolean;
};
