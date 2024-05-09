export default function addNewValueToInputs(
    value: string,
    inputValues: string[],
    index: number,
): string[] {
    const newInputsValues = [...inputValues];
    newInputsValues[index] = value.slice(0, 1);
    
    return newInputsValues;
}
