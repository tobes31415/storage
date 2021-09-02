# Storage

A Javascript storage wrapper that supports namespacing, serialization, encryption, and allows for easy customization.

[View API Docs](docs/modules.md)

# Installation

    npm install --save @tobes31415/storage

# Basic Useage

    import { StorageFactory } from "@tobes31415/storage";
    const factoryInstance = new StorageFactory();
    (or use @tobes31415/di or any other dependency injection library to resolve the instance for you)

    const store = factoryInstance.localStorageFor("foo");

    store.setValue("bar", { abc: 123 });
    // "foo.bar" | "{abc:123}"

    const baz = store.getValue<MyCustomType>("bar")
    //baz = { abc: 123 }

# Advanced Useage - Encryption

    const store = factoryInstance.localStorageFor("foo", { encrypt: someEncryptionFunction, decrypt: theCorrespondingDecryptFunction, encryptKeys: true});

    store.setValue("bar", { abc: 123 });
    // "SLS@#)*!" | "AadKJk283102"

## Thank you

Big thank you to Macadamian Technologies for donating time towards this open source project :-)
