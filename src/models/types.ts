export type ToSchema<T> = Omit<T, "createdAt" | "updatedAt" | "_id" | "kind">;

export type Nullable<T> = T | null;
