import CountryCode from "@/pages/AddPhoneNumber/types/CountryCode.ts";
import { NOT_DIGITS } from "@/data/regularExpressions.ts";

export function formatPhoneNumber(country: CountryCode, input: string): string {
    const digits: string = input.replace(NOT_DIGITS, "");

    if (digits.length === 0) {
        return "";
    }

    switch (country.maxDigits) {
        case 10:
            return format10DigitPhoneNumber(digits);
        case 11:
            return format11DigitPhoneNumber(digits);
        case 9:
            return format9DigitPhoneNumber(digits);
        default:
            return formatOtherDigitPhoneNumber(digits);
    }
}

function format10DigitPhoneNumber(digits: string): string {
    if (digits.length <= 3) {
        return `(${digits}`;
    } else if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
}

function format11DigitPhoneNumber(digits: string): string {
    if (digits.length <= 3) {
        return `(${digits}`;
    } else if (digits.length <= 7) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
}

function format9DigitPhoneNumber(digits: string): string {
    if (digits.length <= 2) {
        return `(${digits}`;
    } else if (digits.length <= 5) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
    }
}

function formatOtherDigitPhoneNumber(digits: string): string {
    if (digits.length <= 3) {
        return `(${digits}`;
    } else if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length <= 9) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
    } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9, 12)}`;
    }
}
