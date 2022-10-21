export default function filterObject(obj: any) {
  const newObj = Object.fromEntries(
    Object.entries(obj).filter(
      (value) => value[1] != null && value[1] !== undefined && value[1] !== '',
    ),
  );

  return newObj;
}
