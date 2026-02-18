/**
 * An auxiliary hash function for use in hash tables
 * It should have good dispersion, but does not need to be difficult to invert or predict.
 * @template K the type of keys
 * @param key the key
 * @returns the hash of the key.
 */
type HashFunction<K> = (key: K) => number;

/**
 * A hash table that resolves collisions by probing
 * @template K the type of keys
 * @template V the type of values
 * @param keys the key array. null means that a key has been deleted.
 * @param values the data associated with each key
 * @param hash the hash function
 * @param entries the number of elements currently in the table
 * @invariant the key type K contains neither null nor undefined
 * @invariant If keys[i] is neither null nor undefined,
 *     then data[i] contains a value of type V.
 * @invariant entries is equal to the number of elements in keys
 *     that are neither null nor undefined.
 */
export type ProbingHashtable<K, V> = {
    keys: Array<K | null | undefined>,
    values: Array<V | undefined>,
    readonly hash: HashFunction<K>,
    entries: number // number of elements
};

// Add implementation