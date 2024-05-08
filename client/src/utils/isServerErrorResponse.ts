export default function isServerErrorResponse(input: any) {
    return input.errorCode != undefined && input.errorMessage != undefined;
}
