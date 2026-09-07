/** biome-ignore-all lint/correctness/noUnusedVariables: global d.ts file */
/** biome-ignore-all lint/suspicious/noExplicitAny: allows usage of `any` in PlainObject type */

// SINGULAR TYPES  ;

/**
 * Unique identifier for a card.
 */
type CardId = string;

/**
 * Point in time expressed as milliseconds since the Unix epoch.
 */
type DateMilliseconds = number;

/**
 * Any JavaScript primitive value, including `null`.
 */
type Primitive = string | number | boolean | symbol | null;

// COMPOSED TYPES

/**
 * Represents a dictionary object with keys of type string and values of type T.
 */
type Dictionary<T> = Record<string, T>;

/**
 * Represents a plain object with dynamic keys and any values.
 */
type PlainObject = {
  [key: string]: any;
};

/**
 * Dictionary whose values are booleans.
 */
type BooleanDictionary = Dictionary<boolean>;

/**
 * Dictionary whose values are numbers.
 */
type NumberDictionary = Dictionary<number>;

/**
 * Dictionary whose values are strings.
 */
type StringDictionary = Dictionary<string>;

/**
 * Dictionary whose values are of type T, defaulting to {@link PlainObject}.
 */
type ObjectDictionary<T = PlainObject> = Dictionary<T>;

/**
 * Holds a value in both supported languages (English and Portuguese).
 */
type DualLanguageValue<T = string> = {
  en: T;
  pt: T;
};

/**
 * Combines two object types, with B's properties overriding A's on conflict.
 */
type Merge<A, B> = Omit<A, keyof B> & B;

/**
 * Takes an object type TData and transforms all root-level property values to strings
 * while preserving the original keys structure.
 */
type StringifyValues<TData> = {
  [K in keyof TData]: string;
};
