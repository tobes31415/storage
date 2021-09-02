
export interface StorageAdapter {
    has(key: string[]): boolean[];
    keys(): string[];
    getString(keys: string[]): (string | undefined)[];
    setString(entries: Record<string, string | undefined>): void;
    strings(): string[];
    entriesStrings(): [string, string][];
    isReady(): Promise<void>;
}

export interface StorageValuesAdapter extends StorageAdapter {
    getValue<T>(keys: string[]): (T | undefined)[];
    setValue<T>(entries: Record<string, T>): void;
    entries<T>(): [string, T][];
    values<T>(): T[];
}

export interface Storage {
    has(key: string): boolean;

    keys(): string[];
    clear(): void;
    delete(key: string): void;

    getString(key: string): string | undefined;

    strings(): string[];
    entriesStrings(): [string, string][];

    setString(key: string, value: string): void;

    getValue<T>(key: string): T | undefined;

    setValue<T>(key: string, value: T): void;

    values<T>(): T[];

    entries<T>(): [string, T][];

    isReady(): Promise<void>;
}

export interface BulkStorage {
    has(key: string): boolean;
    has(keys: string[]): boolean[];
    has(...keys: string[]): boolean[];

    keys(): string[];
    clear(): void;
    delete(key: string): void;
    delete(keys: string[]): void;
    delete(...keys: string[]): void;

    getString(key: string): string | undefined;
    getString(keys: string[]): (string | undefined)[];
    getString(...keys: string[]): (string | undefined)[];

    strings(): string[];
    entriesStrings(): [string, string][];

    setString(key: string, value: string): void;
    setString(entries: Record<string, string | undefined>): void;

    getValue<T>(key: string): T | undefined;
    getValue<T>(keys: string[]): (T | undefined)[]
    getValue<T>(...keys: string[]): (T | undefined)[]

    setValue<T>(key: string, value: T): void;
    setValue(entries: Record<string, any | undefined>): void;

    values<T>(): T[];

    entries<T>(): [string, T][];

    isReady(): Promise<void>;
}
