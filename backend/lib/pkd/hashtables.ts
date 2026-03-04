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

/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param size the maximum number of elements to accomodate
 * @param hash_function the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
export function ph_empty<K, V>(size: number, hash_function: HashFunction<K>): ProbingHashtable<K,V> {
    return {
        keys: new Array(size),
        values: new Array(size),
        hash: hash_function,
        entries: 0
    };
}

// helper function implementing probing from a given probe index
function probe<K>(keys: Array<K | undefined | null>,
    key: K, hash: number, skip_null: boolean): number | undefined {
    for (let i = 0; i < keys.length; i = i + 1) {
        const idx = (hash + i) % keys.length;
        if (keys[idx] === key) return idx;
        if (keys[idx] === undefined) return idx;
        if (!skip_null && keys[idx] === null) return idx;
    }

    return undefined;
}

/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
export function ph_lookup<K, V>(ht: ProbingHashtable<K,V>, key: K): V | undefined {
    const start_idx = ht.hash(key);
    const idx = probe(ht.keys, key, start_idx, true /* skip null*/);

    return idx === undefined ? undefined : ht.values[idx]!;
}


/**
 * Insert a key-value pair into a probing hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true iff the insertion succeeded (the hash table was not full)
 */
export function ph_insert<K, V>(ht: ProbingHashtable<K,V>, key: K, value: V): boolean {
    if (ht.entries >= ht.keys.length * 0.5)
        resize(ht, ht.keys.length * 2);

    const start_idx = ht.hash(key);
    let idx = probe(ht.keys, key, start_idx, false /* don't skip null*/);

    if (idx === undefined) {
        return false; // Hash table full
    } else {
        if (ht.keys[idx] === null) { // Probing stopped at a null slot
        // Probe again from null slot to ensure key is not in ht
        const key_idx = probe(ht.keys, key, idx, true /* skip null */);
        if (key_idx !== undefined) {
            idx = key_idx;
        }
        }

        if (ht.keys[idx] !== key) {
        // Inserting a new entry but entries equal capacity
        if (ht.entries === ht.keys.length) {
            return false;
        } else {
            ht.entries += 1;
        }
        }

        ht.keys[idx] = key;
        ht.values[idx] = value;
        return true;
    }
}

function resize<K, V>(ht: ProbingHashtable<K, V>, size: number): void {
    const new_table = ph_empty<K, V>(size, ht.hash);

    for (let i = 0; i < ht.keys.length; i++) {
        const key = ht.keys[i];
        if (key != undefined) {
            const value = ht.values[i];
            ph_insert(new_table, key, value);
        }
    }

    ht.keys = new_table.keys;
    ht.values = new_table.values;
}