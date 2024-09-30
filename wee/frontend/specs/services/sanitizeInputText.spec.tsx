import { sanitizeInputText } from "../../src/Utils/sanitizeInputText";

describe('sanitizeInputText', () => {
    it('should escape HTML special characters', () => {
        const input = '<script>alert("XSS");</script>';
        const expectedOutput = '&lt;script&gt;alert&#40;&quot;XSS&quot;&#41;;&lt;&#x2F;script&gt;';
        expect(sanitizeInputText(input)).toBe(expectedOutput);
    });

    it('should escape ampersands', () => {
        const input = 'Fish & Chips';
        const expectedOutput = 'Fish &amp; Chips';
        expect(sanitizeInputText(input)).toBe(expectedOutput);
    });

    it('should escape single quotes', () => {
        const input = "It's a test";
        const expectedOutput = "It&#039;s a test";
        expect(sanitizeInputText(input)).toBe(expectedOutput);
    });

    it('should escape multiple special characters', () => {
        const input = 'Use <tag> or "quote" & other (characters) /';
        const expectedOutput = 'Use &lt;tag&gt; or &quot;quote&quot; &amp; other &#40;characters&#41; &#x2F;';
        expect(sanitizeInputText(input)).toBe(expectedOutput);
    });

    it('should return the same string if there are no special characters', () => {
        const input = 'Hello World!';
        expect(sanitizeInputText(input)).toBe(input);
    });
});