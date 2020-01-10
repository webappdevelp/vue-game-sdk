interface Rule {
  required?: boolean;
  reg?: RegExp;
  matchField?: string;
  minLength?: number;
  length?: number;
  msg: string;
}
export function validateForm(datas: { [prop: string]: any }, rules: { [prop: string]: any[] }) {
  Object.keys(datas).forEach((d: string) => {
    if (rules[d]) {
      rules[d].forEach((r: Rule) => {
        if (r.required && !datas[d].value) {
          datas[d].msg = r.msg;
        } else if (!datas[d].msg && r.reg && !r.reg.test(datas[d].value)) {
          datas[d].msg = r.msg;
        } else if (!datas[d].msg && r.minLength && datas[d].value.length < r.minLength) {
          datas[d].msg = r.msg;
        } else if (!datas[d].msg && r.length && datas[d].value.length !== r.length) {
          datas[d].msg = r.msg;
        } else if (
          !datas[d].msg &&
          r.matchField &&
          datas[r.matchField] &&
          datas[r.matchField].value !== datas[d].value
        ) {
          datas[d].msg = r.msg;
        }
      });
    }
  });
  return datas;
}
