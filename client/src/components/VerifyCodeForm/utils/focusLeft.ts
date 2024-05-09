export default function focusLeft(inputs: HTMLInputElement[], index: number) {
    const nextInput = inputs[index - 1];
    if (nextInput) {
        nextInput.focus();
    }
}
