export function getPlaceholderBasedOnMaxDigits(maxDigits: number | undefined): string {
    if (maxDigits == 11) {
        return "(123) 4567-8900";
    } else if (maxDigits == 10) {
        return "(123) 456-7890";
    } else if (maxDigits == 9) {
        return "(12) 345-6789";
    } else {
        return "(123) 456-789-123";
    }
}
