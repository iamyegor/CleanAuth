export default function storeCountryCodeIndex(countryCodeIndex: number): void {
    sessionStorage.setItem("countryCodeIndex", countryCodeIndex.toString());
}