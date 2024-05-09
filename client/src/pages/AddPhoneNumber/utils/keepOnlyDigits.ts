import {NOT_DIGITS} from "@/data/regularExpressions.ts";

export function keepOnlyDigits(input: string): string {
    return input.replace(NOT_DIGITS, ""); 
}
