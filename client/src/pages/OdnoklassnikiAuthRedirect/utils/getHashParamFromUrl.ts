export default function getHashParamFromUrl(paramName: string): string | null {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get(paramName);
}
