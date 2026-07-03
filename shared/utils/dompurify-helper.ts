import DOMPurify from "dompurify";

// Parse descriptions with HTML tags & clean up link tags.
export function sanitizeAndTransformHtml(htmlString: string): string {
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if ("tagName" in node && node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
        }
    });

    const cleanHtml = DOMPurify.sanitize(htmlString, { ADD_DATA_URI_TAGS: ['a'] });
    DOMPurify.removeHook("afterSanitizeAttributes");
    return cleanHtml;
}