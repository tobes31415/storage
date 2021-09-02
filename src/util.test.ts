import { deepAssign, isNullorUndefined } from './util';

describe("deepAssign", () => {
    test("equivalent for a shallow assign", () => {
        const A = { abc: 123, def: "ghi" };
        const da = deepAssign({}, A);
        const oa = Object.assign({}, A);
        expect(A).toEqual(da);
        expect(A).toEqual(oa);
        expect(A).not.toBe(da);
        expect(A).not.toBe(oa);
    });
    test("Updates an existing object", () => {
        const A = { abc: 123, def: "ghi" };
        const B = { def: "zzz", jkl: 456 };
        deepAssign(B, A);
        expect(A).not.toEqual(B);
        expect(B).toEqual({ abc: 123, def: "ghi", jkl: 456 });
    });
    test("Ignores undefined source objects", () => {
        const A = { abc: 123, def: "ghi" };
        deepAssign(A, undefined);
        expect(A).toEqual({ abc: 123, def: "ghi" });
    });
    test("Can apply multiple objects", () => {
        const A = {};
        const B = { abc: 123 };
        const C = { def: "ghi" };
        const D = { jkl: 456 };
        deepAssign(A, B, C, D);
        expect(A).not.toEqual(B);
        expect(A).not.toEqual(C);
        expect(A).not.toEqual(D);
        expect(B).not.toEqual(C);
        expect(B).not.toEqual(D);
        expect(C).not.toEqual(D);
        expect(A).toEqual({ abc: 123, def: "ghi", jkl: 456 });
    });
    test("Returns the target", () => {
        const A = {};
        const B = deepAssign(A, {});
        expect(A).toBe(B);
    });
    test("Arrays are copied shallowly", () => {
        const A = { abc: [1, 2, 3] };
        const B = { abc: [1, 2] };
        const C = deepAssign({}, A, B);
        expect(C).toEqual({ abc: [1, 2] });
    })
});
describe("isNullOrUndefined", () => {
    test("true for null or undefined", () => {
        expect(isNullorUndefined(null)).toBe(true);
        expect(isNullorUndefined(undefined)).toBe(true);
    });
    test("false for other falsy values", () => {
        expect(isNullorUndefined(false)).toBe(false);
        expect(isNullorUndefined("")).toBe(false);
        expect(isNullorUndefined(0)).toBe(false);
    });
});