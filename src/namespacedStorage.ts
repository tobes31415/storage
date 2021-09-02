import { StorageAdapter } from "./types";
import { objectMap } from './util';

export interface NamespacedStorageConfig {
    namespace: string;
    delimiter: string;
    isPrefix: boolean;
}

const DEFAULT_STORAGE_CONFIG: NamespacedStorageConfig = {
    namespace: "",
    delimiter: ".",
    isPrefix: true
}

export class NamespacedStorageAdapter implements StorageAdapter {
    private _config: NamespacedStorageConfig = DEFAULT_STORAGE_CONFIG;
    private combinedNamespaceDelimiter: string = undefined as any;
    private isPrefix: boolean = undefined as any;

    constructor(private base: StorageAdapter, options?: Partial<NamespacedStorageConfig>) {
        this.formatKey = this.formatKey.bind(this);
        this.parseKey = this.parseKey.bind(this);
        this.isMatchingKey = this.isMatchingKey.bind(this);
        this.config(options);
    }

    config(newConfig?: Partial<NamespacedStorageConfig>) {
        this._config = Object.assign({}, this._config, newConfig);
        this.isPrefix = this._config.isPrefix;
        if (this._config.namespace) {
            if (this._config.isPrefix) {
                this.combinedNamespaceDelimiter = this._config.namespace + this._config.delimiter;
            } else {
                this.combinedNamespaceDelimiter = this._config.delimiter + this._config.namespace;
            }
        } else {
            this.combinedNamespaceDelimiter = "";
        }
    }

    has(keys: string[]): boolean[] {
        return this.base.has(keys.map(this.formatKey));
    }

    keys(): string[] {
        return this.base.keys().filter(this.isMatchingKey).map(this.parseKey);
    }

    getString(keys: string[]): (string | undefined)[] {
        return this.base.getString(keys.map(this.formatKey));
    }

    strings(): string[] {
        return this.base.getString(this.keys()) as any as string[];
    }
    entriesStrings(): [string, string][] {
        return this.base.entriesStrings()
            .filter(([key, value]) => this.isMatchingKey(key))
            .map(([key, value]) => ([this.parseKey(key), value]));
    }

    setString(entries: Record<string, string | undefined>): void {
        this.base.setString(objectMap(entries, ([key, value]) => [this.formatKey(key), value]));
    }

    private formatKey(localKey: string): string {
        if (this.isPrefix) {
            return this.combinedNamespaceDelimiter + localKey;
        } else {
            return localKey + this.combinedNamespaceDelimiter;
        }
    }

    private parseKey(namespacedKey: string): string {
        if (this.isPrefix) {
            return namespacedKey.substring(this.combinedNamespaceDelimiter.length, namespacedKey.length);
        } else {
            return namespacedKey.substring(0, namespacedKey.length - this.combinedNamespaceDelimiter.length);
        }
    }

    private isMatchingKey(possibleKey: string): boolean {
        if (this.isPrefix) {
            return possibleKey.startsWith(this.combinedNamespaceDelimiter);
        } else {
            return possibleKey.endsWith(this.combinedNamespaceDelimiter);
        }
    }

    isReady(): Promise<void> {
        return this.base.isReady();
    }
}