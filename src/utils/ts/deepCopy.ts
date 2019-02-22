export default function deepCopy(data: any) {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.log(err.message);
  }
}
