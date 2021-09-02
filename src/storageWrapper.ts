import { BulkStorage, StorageValuesAdapter, Storage } from "./types";


export class StorageWrapper implements Storage, BulkStorage {
    constructor(private base: StorageValuesAdapter) { }

    has(key: string): boolean;
    has(keys: string[]): boolean[];
    has(...keys: string[]): boolean[];
    has(...keys: any[]): any {
        const result = this.base.has(getKeys(keys));
        return typeof keys[0] === "string" && keys.length === 1 ? result[0] : result;
    }

    keys(): string[] {
        return this.base.keys();
    }

    clear(): void {
        this.delete(this.base.keys());
    }

    delete(key: string): void;
    delete(keys: string[]): void;
    delete(...keys: string[]): void;
    delete(...keys: any[]): void {
        const temp = {} as any;
        getKeys(keys).forEach(key => temp[key] = undefined);
        this.base.setString(temp);
    }

    getString(key: string): string | undefined;
    getString(keys: string[]): (string | undefined)[];
    getString(...keys: string[]): (string | undefined)[];
    getString(...keys: any[]): any {
        const result = this.base.getString(getKeys(keys));
        return typeof keys[0] === "string" && keys.length === 1 ? result[0] : result;
    }

    strings(): string[] {
        return this.base.strings();
    }
    entriesStrings(): [string, string][] {
        return this.base.entriesStrings();
    }

    setString(key: string, value: string): void;
    setString(entries: Record<string, string | undefined>): void;
    setString(either: string | Record<string, string | undefined>, maybeValue?: string): void {
        this.base.setString(getEntries(either, maybeValue));
    }

    getValue<T>(key: string): T | undefined;
    getValue<T>(keys: string[]): (T | undefined)[];
    getValue<T>(...keys: string[]): (T | undefined)[];
    getValue<T>(...keys: any[]): (T | undefined)[] {
        return this.base.getValue(getKeys(keys));
    }

    setValue<T>(key: string, value: T): void;
    setValue(entries: Record<string, any | undefined>): void;
    setValue(either: string | Record<string, any | undefined>, maybeValue?: any): void {
        this.base.setValue(getEntries(either, maybeValue));
    }

    values<T>(): T[] {
        return this.base.values();
    }

    entries<T>(): [string, T][] {
        return this.base.entries();
    }

    isReady(): Promise<void> {
        return this.base.isReady();
    }
}

function getKeys(keys: any[]): string[] {
    return Array.isArray(keys[0]) ? keys[0] : keys;
}

function getEntries<T>(either: string | Record<string, T | undefined>, maybeValue?: T): Record<string, T | undefined> {
    return typeof either === "string" ? { [either]: maybeValue } : either;
}