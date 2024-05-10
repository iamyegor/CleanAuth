export default function getStoredPhoneNumber(): string | null {
    const storedPhoneNumber = sessionStorage.getItem("phoneNumber");

    if (storedPhoneNumber) {
        return storedPhoneNumber;
    }

    return null;
}
