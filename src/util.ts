export function deepAssign<T = any>(target: any, ...others: any[]): T {
    others.forEach(obj => {
        obj && Object.keys(obj).forEach(key => {
            const value = obj[key];
            const origValue = target[key];
            const bothAreObjects = typeof value === "object" && typeof origValue === "object" && value && origValue;
            const eitherIsArray = Array.isArray(value) || Array.isArray(origValue)
            if (bothAreObjects && !eitherIsArray) {
                deepAssign(origValue, value);
            } else {
                target[key] = value;
            }
        });
    });
    return target;
}

export function isNullorUndefined(value: any): boolean {
    return value === null || value === undefined;
}

export function nullishCoalesce<T>(value: T | null | undefined, replacement: T = undefined as any): T {
    return isNullorUndefined(value) ? replacement : value!;
}

export function asyncMap<Tin = any, Tout = any>(list: Tin[], mapFn: (item: Tin) => Promise<Tout>): Promise<Tout[]> {
    return Promise.all(list.map(mapFn));
}

export function objectMap<Tin = any, Tout = any>(object: Record<string, Tin>, mapFn: (entry: [string, Tin]) => [string, Tout]): Record<string, Tout> {
    const entries = Object.entries(object);
    const mappedEntries = entries.map(mapFn);
    const result: Record<string, Tout> = {};
    mappedEntries.forEach(([key, value]) => result[key] = value);
    return result;
}

export async function asyncObjectMap<Tin = any, Tout = any>(object: Record<string, Tin>, mapFn: (entry: [string, Tin]) => Promise<[string, Tout]>): Promise<Record<string, Tout>> {
    const entries = Object.entries(object);
    const mappedEntries = await asyncMap(entries, mapFn);
    const result: Record<string, Tout> = {};
    mappedEntries.forEach(([key, value]) => result[key] = value);
    return result;
}

export function objectForEach<T>(object: Record<string, T>, forEachFn: (entry: [string, T]) => void): void {
    Object.entries(object).forEach(forEachFn);
}
