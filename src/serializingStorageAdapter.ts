
import { StorageAdapter, StorageValuesAdapter } from './types';
import { isNullorUndefined, objectMap } from './util';
export interface SerializingStorageConfig {
    serialize(value: any): string;
    deserialize(text: string): any;
}

export class SerialiaizingStorageAdapter implements StorageValuesAdapter {


    constructor(private base: StorageAdapter, private options: SerializingStorageConfig) {
        this.serialize = this.serialize.bind(this);
        this.deserialize = this.deserialize.bind(this);
    }

    has(keys: string[]): boolean[] {
        return this.base.has(keys);
    }

    keys(): string[] {
        return this.base.keys();
    }

    getString(keys: string[]): (string | undefined)[] {
        return this.base.getString(keys);
    }

    strings(): string[] {
        return this.base.strings();
    }
    entriesStrings(): [string, string][] {
        return this.base.entriesStrings();
    }

    setString(entries: Record<string, string | undefined>): void {
        this.base.setString(entries);
    }

    getValue<T>(keys: string[]): (T | undefined)[] {
        return this.base.getString(keys).map(value => this.deserialize<T>(value));
    }
    setValue<T>(entries: Record<string, T>): void {
        this.base.setString(objectMap(entries, ([key, value]) => [key, this.serialize(value)]));
    }
    entries<T>(): [string, T][] {
        return this.base.entriesStrings().map(([key, value]) => [key, this.deserialize<T>(value)!]);
    }
    values<T>(): T[] {
        return this.base.strings().map(value => this.deserialize<T>(value)!);
    }

    private serialize(value: any | undefined): string | undefined {
        return isNullorUndefined(value) ? undefined : this.options.serialize(value);
    }

    private deserialize<T = any>(json: string | undefined): T | undefined {
        return isNullorUndefined(json) ? undefined : this.options.deserialize(json!) as T;
    }

    isReady(): Promise<void> {
        return this.base.isReady();
    }
}