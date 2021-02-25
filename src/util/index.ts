let tac = 0;
export function genId() {
  return +`${+new Date()}${++tac}`;
}
