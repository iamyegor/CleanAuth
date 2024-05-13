export default function getQueryParam(urlString: string, queryParam: string): string | null {
    const url = new URL(urlString);
    const queryParams = new URLSearchParams(url.search);

    return queryParams.get(queryParam);
}
