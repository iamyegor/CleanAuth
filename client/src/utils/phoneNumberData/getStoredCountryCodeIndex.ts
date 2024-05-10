export default function getStoredCountryCodeIndex(): number | null {
    const storedCountryCodeIndex: string | null = sessionStorage.getItem("countryCodeIndex");
    return storedCountryCodeIndex ? parseInt(storedCountryCodeIndex) : null;
}
