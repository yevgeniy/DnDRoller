declare global {
  interface Array<T> {
    mapAsync<Q>(fn: { (v: T, i: number): Q | Promise<Q> }): Promise<Q[]>;
  }
  interface EventTarget {
    id: any;
    value: any;
    querySelector: any;
  }
}

Array.prototype.mapAsync = async function<Q>(fn): Promise<Q[]> {
  let res: Q[] = [];
  for (let x = 0; x < this.length; x++) {
    let r = fn(this[x], x);
    res.push(r);
  }

  return await Promise.all(res);
};

export default true;
