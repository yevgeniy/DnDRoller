let instance = null;

type dieType = "green" | "yellow" | "blue" | "purple" | "red" | "black";
type resultType =
  | null
  | "success"
  | "advantage"
  | "triumph"
  | "failure"
  | "threat"
  | "despair";
const dictionary: [dieType, number, resultType][] = [
  ["blue", 1, null],
  ["blue", 2, null],
  ["blue", 3, "success"],
  ["blue", 4, "success"],
  ["blue", 4, "advantage"],
  ["blue", 5, "advantage"],
  ["blue", 5, "advantage"],
  ["blue", 6, "advantage"],

  ["black", 1, null],
  ["black", 2, null],
  ["black", 3, "failure"],
  ["black", 4, "failure"],
  ["black", 5, "threat"],
  ["black", 6, "threat"],

  ["green", 1, null],
  ["green", 2, "success"],
  ["green", 3, "success"],
  ["green", 4, "success"],
  ["green", 4, "success"],
  ["green", 5, "advantage"],
  ["green", 6, "advantage"],
  ["green", 7, "success"],
  ["green", 7, "advantage"],
  ["green", 8, "advantage"],
  ["green", 8, "advantage"],

  ["purple", 1, null],
  ["purple", 2, "failure"],
  ["purple", 3, "failure"],
  ["purple", 3, "failure"],
  ["purple", 4, "threat"],
  ["purple", 5, "threat"],
  ["purple", 6, "threat"],
  ["purple", 7, "threat"],
  ["purple", 7, "threat"],
  ["purple", 8, "failure"],
  ["purple", 8, "threat"],

  ["yellow", 1, null],
  ["yellow", 2, "success"],
  ["yellow", 3, "success"],
  ["yellow", 4, "success"],
  ["yellow", 4, "success"],
  ["yellow", 5, "success"],
  ["yellow", 5, "success"],
  ["yellow", 6, "advantage"],
  ["yellow", 7, "success"],
  ["yellow", 7, "advantage"],
  ["yellow", 8, "success"],
  ["yellow", 8, "advantage"],
  ["yellow", 9, "success"],
  ["yellow", 9, "advantage"],
  ["yellow", 10, "advantage"],
  ["yellow", 10, "advantage"],
  ["yellow", 11, "advantage"],
  ["yellow", 11, "advantage"],
  ["yellow", 12, "triumph"],

  ["red", 1, null],
  ["red", 2, "failure"],
  ["red", 3, "failure"],
  ["red", 4, "failure"],
  ["red", 4, "failure"],
  ["red", 5, "failure"],
  ["red", 5, "failure"],
  ["red", 6, "threat"],
  ["red", 7, "threat"],
  ["red", 8, "failure"],
  ["red", 8, "threat"],
  ["red", 9, "failure"],
  ["red", 9, "threat"],
  ["red", 10, "threat"],
  ["red", 10, "threat"],
  ["red", 11, "threat"],
  ["red", 11, "threat"],
  ["red", 12, "despair"]
];

class ServiceRoller {
  static async init(): Promise<ServiceRoller> {
    if (!instance)
      instance = new Promise(async res => {
        const serv = new ServiceRoller();
        res(serv);
      });

    return await instance;
  }

  eval(data: [dieType, number][]): [string, number][] {
    const res = data.reduce((p, [die, rank]) => {
      const out = [];
      Array.from(Array(rank)).forEach(() => {
        let sides: number;
        switch (die) {
          case "black":
          case "blue":
            sides = 6;
            break;
          case "green":
          case "purple":
            sides = 8;
            break;
          case "yellow":
          case "red":
            sides = 12;
            break;
        }
        const r = Math.ceil(Math.random() * sides);
        const matches = dictionary.filter(
          ([dieType, number]) => dieType === die && number === r
        );
        console.log(die, r, matches);
        out.push(...matches.map(([, , resultType]) => resultType));
      });
      return [...p, ...out];
    }, []);

    const reducedresults = res.reduce(
      (p, c) => {
        let r;
        switch (c) {
          case "success":
            r = { trueSuccess: p.trueSuccess + 1 };
            break;
          case "failure":
            r = { trueSuccess: p.trueSuccess - 1 };
            break;
          case "advantage":
            r = { trueAdvantage: p.trueAdvantage + 1 };
            break;
          case "threat":
            r = { trueAdvantage: p.trueAdvantage - 1 };
            break;
          case "triumph":
            r = { trueSuccess: p.trueSuccess + 1, triumph: p.triumph + 1 };
            break;
          case "despair":
            r = { trueSuccess: p.trueSuccess - 1, despair: p.despair + 1 };
            break;
        }
        return {
          ...p,
          ...r
        };
      },
      {
        trueSuccess: 0,
        trueAdvantage: 0,
        triumph: 0,
        despair: 0
      }
    );
    console.log("a", reducedresults);
    return reducedresults;
  }
}

export default ServiceRoller;
