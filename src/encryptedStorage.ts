
import { InMemoryStorageAdapter } from './inMemoryStorage';
import { NamespacedStorageAdapter } from './namespacedStorage';
import { StorageAdapter } from './types';
import { asyncObjectMap } from './util';

export interface EncryptionConfig {
    encryptKeys: boolean;
    encrypt(text: string): Promise<string>;
    decrypt(text: string): Promise<string>;
}

const ENCRYPTED_KEY_PREFIX = "ZW5jcnlwdGVk"; //base64 encoded "encrypted"

export class EncryptedStorageAdapter implements StorageAdapter {
    private cache: InMemoryStorageAdapter = new InMemoryStorageAdapter();
    private internalInit: Promise<void>;

    constructor(private base: StorageAdapter, private config: EncryptionConfig) {
        if (config.encryptKeys) {
            this.base = new NamespacedStorageAdapter(base, { namespace: ENCRYPTED_KEY_PREFIX, delimiter: "" });
        }
        this.internalInit = this.init();
    }

    has(key: string[]): boolean[] {
        return this.cache.has(key);
    }

    keys(): string[] {
        return this.cache.keys();
    }

    getString(key: string[]): (string | undefined)[] {
        return this.cache.getString(key);
    }

    entriesStrings(): [string, string][] {
        return this.cache.entriesStrings();
    }

    strings(): string[] {
        return this.cache.strings();
    }

    setString(entries: Record<string, string | undefined>): void {
        this.cache.setString(entries);
        this.setEncryptedString(entries);
    }

    private async setEncryptedString(entries: Record<string, string | undefined>): Promise<void> {
        try {
            const result = await asyncObjectMap(entries, async ([key, value]) => {
                let encryptedKey = this.config.encryptKeys ? await this.config.encrypt(key) : key;
                let encryptedValue = value ? await this.config.encrypt(value) : undefined;
                return [encryptedKey, encryptedValue];
            });
            this.base.setString(result);
        }
        catch (err) {
            console.error("Encrypted storage failed to update: " + err);
        }
    }

    isReady(): Promise<void> {
        return this.internalInit;
    }

    private async init(): Promise<void> {
        try {
            await this.base.isReady();
            const allEntries = this.base.entriesStrings();
            const result: Record<string, string> = await asyncObjectMap(allEntries, async ([key, value]) => {
                let decryptedKey = this.config.encryptKeys ? await this.config.decrypt(key) : key;
                let decryptedValue = await this.config.decrypt(value);
                return [decryptedKey, decryptedValue];
            });
            this.cache.reset(result);
        }
        catch (err) {
            console.error("Encrypted storage failed to initialize");
            throw new Error("Encrypted storage failed to initialize");
        }
    }
}