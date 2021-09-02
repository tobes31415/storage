
import { NamespacedStorageAdapter, NamespacedStorageConfig } from './namespacedStorage';
import { SerialiaizingStorageAdapter, SerializingStorageConfig } from './serializingStorageAdapter';
import { Storage, StorageAdapter, StorageValuesAdapter } from './types';
import { LocalStorageAdapter } from './localStorage';
import { EncryptedStorageAdapter } from './encryptedStorage';
import { StorageWrapper } from './storageWrapper';

export enum StorageType {
    local = "local",
    session = "session",
    inMemory = "inMemory",
    cookie = "cookie"
}

export interface StorageConfig {
    type: StorageType;
    namespace: string;
    delimiter: string;
    isPrefix: boolean;
    encryptKeys: boolean;
    encrypt: (text: string) => Promise<string>;
    decrypt: (text: string) => Promise<string>;
    serialize: (obj: any) => string;
    deserialize: (text: string) => any;
}

const DEFAULT_STORAGE_CONFIG: Partial<StorageConfig> = {
    type: StorageType.local,
    serialize: (value: any) => JSON.stringify(value),
    deserialize: (text: string) => JSON.parse(text),
}

export interface IStorageFactory {
    storageFor(namespace: string, config: Partial<StorageConfig>): Storage;
    localStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage;
    sessionStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage;
    cookieStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage;
    inMemoryStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage;
    setDefaultSerializer(config: SerializingStorageConfig): void;
}

export class StorageFactory implements IStorageFactory {
    storageFor(namespace: string, config?: Partial<StorageConfig>): Storage {
        if (config) {
            if ((config.encrypt || config.decrypt) && !(config.encrypt && config.decrypt)) {
                throw new Error("Encrypt/Decrypt must both be defined if either is defined");
            }
            if (config.encryptKeys && !config.encrypt) {
                throw new Error("Cannot encrypt keys without an encrypt function");
            }
            if ((config.serialize || config.deserialize) && !(config.serialize && config.deserialize)) {
                throw new Error("Serialize/Deserialize must both be defined if either is defined");
            }
        }
        const fullConfig = Object.assign({}, DEFAULT_STORAGE_CONFIG, config, { namespace });
        const useEncryption = !!fullConfig.encrypt;

        let base: StorageAdapter = new LocalStorageAdapter();
        let encrypt: StorageAdapter | undefined = useEncryption ? new EncryptedStorageAdapter(base, { encryptKeys: fullConfig.encryptKeys || false, encrypt: fullConfig.encrypt!, decrypt: fullConfig.decrypt! }) : undefined;
        let ns: StorageAdapter = new NamespacedStorageAdapter(encrypt || base, fullConfig);
        let serializer: StorageValuesAdapter = new SerialiaizingStorageAdapter(ns, { serialize: fullConfig.serialize!, deserialize: fullConfig.deserialize! });
        let finalResult = new StorageWrapper(serializer);
        return finalResult;
    }
    localStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage {
        return this.storageFor(namespace, Object.assign({}, config, { type: StorageType.local }));
    }
    sessionStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage {
        return this.storageFor(namespace, Object.assign({}, config, { type: StorageType.session }));
    }
    cookieStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage {
        return this.storageFor(namespace, Object.assign({}, config, { type: StorageType.cookie }));
    }
    inMemoryStorageFor(namespace: string, config?: Partial<StorageConfig>): Storage {
        return this.storageFor(namespace, Object.assign({}, config, { type: StorageType.inMemory }));
    }
    setDefaultSerializer(config: SerializingStorageConfig): void { }
}
