export default function focusRight(inputs: HTMLInputElement[], index: number): void {
    const nextInput = inputs[index + 1];
    if (nextInput) {
        nextInput.focus();
    }
}
