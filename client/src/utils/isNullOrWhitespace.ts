export default function isNullOrWhitespace(input: string | null) {
    return !input || !input.trim();
}
