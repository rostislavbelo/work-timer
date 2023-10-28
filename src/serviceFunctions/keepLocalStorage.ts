export function storeTasks(title:string, data:{[N:string]:number|boolean|string}[]) {
    localStorage.setItem(title, JSON.stringify(data));
  }