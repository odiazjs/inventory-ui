export const parseUrl = (url: string) => {
    const occurrences = url.replace(/[^/]/g, "").length;
    if (occurrences > 1) {
        return url.substr(0, url.lastIndexOf('/'));
    }
    return url;
};