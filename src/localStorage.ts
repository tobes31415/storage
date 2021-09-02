import { StorageAdapter } from "./types";
import { isNullorUndefined, objectForEach, nullishCoalesce } from "./util";

const ALWAYS_READY = Promise.resolve();

export class LocalStorageAdapter implements StorageAdapter {
    has(keys: string[]): boolean[] {
        return keys.map(key => !isNullorUndefined(localStorage.getItem(key)));
    }

    keys(): string[] {
        const result: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                result.push(key);
            }
        }
        return result;
    }

    getString(keys: string[]): (string | undefined)[] {
        return keys.map(key => {
            return nullishCoalesce(localStorage.getItem(key));
        });
    }

    entriesStrings(): [string, string][] {
        return this.keys().map(key => [key, nullishCoalesce(localStorage.getItem(key))]);
    }

    strings(): string[] {
        return this.keys().map(key => nullishCoalesce(localStorage.getItem(key)));
    }

    setString(entries: Record<string, string | undefined>): void {
        objectForEach(entries, ([key, value]) => {
            if (value !== null && value !== undefined) {
                localStorage.setItem(key, value);
            } else {
                localStorage.removeItem(key);
            }
        });
    }

    isReady(): Promise<void> { return ALWAYS_READY; }
}

