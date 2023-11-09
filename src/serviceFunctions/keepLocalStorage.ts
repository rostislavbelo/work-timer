export function storeTasks(title: string, data: { [N: string]: number | boolean | string }[] | number) {
  localStorage.setItem(title, JSON.stringify(data));
}