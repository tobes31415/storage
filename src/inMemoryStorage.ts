import { StorageAdapter } from "./types";
import { objectForEach } from "./util";

const ALWAYS_READY = Promise.resolve();

export class InMemoryStorageAdapter implements StorageAdapter {
    private data: Record<string, string> = {};

    reset(replacement: Record<string, string> = {}) {
        this.data = replacement;
    }

    has(keys: string[]): boolean[] {
        return keys.map(key => this.data[key] !== undefined);
    }

    keys(): string[] {
        return Object.keys(this.data);
    }

    getString(keys: string[]): (string | undefined)[] {
        return keys.map(key => this.data[key]);
    }

    entriesStrings(): [string, string][] {
        return Object.entries(this.data);
    }

    strings(): string[] {
        return Object.values(this.data);
    }

    setString(entries: Record<string, string | undefined>) {
        objectForEach(entries, ([key, value]) => {
            if (value !== undefined) {
                this.data[key] = value;
            } else {
                delete this.data[key];
            }
        });
    }

    isReady(): Promise<void> { return ALWAYS_READY; }
}
