import {
  formatDate,
  isDateString,
  isNumber,
  isString,
  mergeDeep,
  sanitizeString,
} from "../src/utils";

describe("Utils", () => {
  describe("formatDate", () => {
    it("should format date without time", () => {
      const date = new Date("2023-06-15T10:30:00Z");
      expect(formatDate(date)).toBe("Jun 15, 2023");
    });

    it("should format date with time", () => {
      const date = new Date("2023-06-15T10:30:00Z");
      const result = formatDate(date, true);
      expect(result).toContain("Jun 15, 2023");
      expect(result).toContain("10:30");
    });
  });

  describe("isDateString", () => {
    it("should return true for valid date strings", () => {
      expect(isDateString("2023-06-15")).toBe(true);
      expect(isDateString("2023-06-15T10:30:00Z")).toBe(true);
      expect(isDateString("June 15, 2023")).toBe(true);
    });

    it("should return false for invalid date strings", () => {
      expect(isDateString("invalid")).toBe(false);
      expect(isDateString("")).toBe(false);
      expect(isDateString("123")).toBe(false);
    });

    it("should return false for non-string inputs", () => {
      expect(isDateString(123 as unknown as string)).toBe(false);
      expect(isDateString(null as unknown as string)).toBe(false);
      expect(isDateString(undefined as unknown as string)).toBe(false);
    });
  });

  describe("sanitizeString", () => {
    it("should sanitize HTML characters", () => {
      expect(sanitizeString("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;"
      );
      expect(sanitizeString("Hello & welcome")).toBe("Hello &amp; welcome");
      expect(sanitizeString('<img src="x" onerror="alert(1)">')).toBe(
        "&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;"
      );
    });

    it("should handle empty strings", () => {
      expect(sanitizeString("")).toBe("");
    });

    it("should handle strings without HTML characters", () => {
      expect(sanitizeString("Hello World")).toBe("Hello World");
    });
  });

  describe("isString", () => {
    it("should return true for strings", () => {
      expect(isString("hello")).toBe(true);
      expect(isString("")).toBe(true);
    });

    it("should return false for non-strings", () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("should return true for valid numbers", () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });

    it("should return false for NaN", () => {
      expect(isNumber(Number.NaN)).toBe(false);
    });

    it("should return false for non-numbers", () => {
      expect(isNumber("123")).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe("mergeDeep", () => {
    it("should merge objects deeply", () => {
      const target = {
        a: 1,
        b: {
          c: 2,
          d: 3,
        },
      };

      const source = {
        b: {
          d: 4,
          e: 5,
        },
        f: 6,
      };

      const result = mergeDeep(target, source);

      expect(result).toEqual({
        a: 1,
        b: {
          c: 2,
          d: 4,
          e: 5,
        },
        f: 6,
      });
    });

    it("should handle undefined source", () => {
      const target = { a: 1, b: 2 };
      const result = mergeDeep(target, undefined);
      expect(result).toEqual(target);
    });

    it("should handle empty objects", () => {
      expect(mergeDeep({}, {})).toEqual({});
    });

    it("should handle nested objects with different types", () => {
      const target = { a: { b: "string" } };
      const source = { a: { c: 123 } };
      const result = mergeDeep(target, source);

      expect(result).toEqual({
        a: {
          b: "string",
          c: 123,
        },
      });
    });
  });
});
