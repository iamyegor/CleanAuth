export default async function getCodeFromForm(
    request: any,
    maxCodeLength: number,
): Promise<string> {
    const form = await request.formData();

    let code: string = "";
    for (let i = 0; i < maxCodeLength; i++) {
        code += form.get(`code-${i}`);
    }

    return code;
}
