export function dateFormatter(value: string | Date | undefined | null) {
  if (!value) {
    return new Date().toLocaleDateString;
  }
  const data = new Date(value);
  return data.toLocaleDateString();
}

