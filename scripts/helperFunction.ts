export function validateInput(inputText: string, input: HTMLInputElement): boolean {
  if (!inputText) {
    input.classList.add('field__control--error');
    return true;
  } else {
    input.classList.remove('field__control--error');
    return false;
  }
}
