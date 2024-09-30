export const sanitizeInputText = (text: string) => {
    return text
        .replace(/&/g, '&amp;')      // Escape &
        .replace(/</g, '&lt;')       // Escape <
        .replace(/>/g, '&gt;')       // Escape >
        .replace(/"/g, '&quot;')     // Escape "
        .replace(/'/g, '&#039;')     // Escape '
        .replace(/`/g, '&#x60;')     // Escape `
        .replace(/\(/g, '&#40;')     // Escape (
        .replace(/\)/g, '&#41;')     // Escape )
        .replace(/\//g, '&#x2F;');   // Escape /
};