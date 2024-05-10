export default function storePhoneNumber(phoneNumber: string): void {
    sessionStorage.setItem("phoneNumber", phoneNumber);
}
