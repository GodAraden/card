export function triggerFunc(id: number): void {
  alert(id)
}
export function handleSelect(key: string | number) {
  alert(key)
}

export function numToBackground(number: string): string {
  let res: string = '';
  if (number.charAt(2) >= '0' && number.charAt(2) <= '9') {
    // 本科生学号转换
    res = '本科';
  } else if (number.charAt(2) === 'S' || number.charAt(2) === 's') {
    // 硕士生学号转换
    res += '硕士';
  } else if (number.charAt(2) === 'B' || number.charAt(2) === 'b') {
    // 博士生学号转换
    res += '博士';
  } else {
    res += '学号有误'
  }
  return res;
}

export function numToYear(number: string): number {
  let res: number = -1;
  const nowYear = +new Date().getFullYear();
  if (number.charAt(2) >= '0' && number.charAt(2) <= '9' && number.charAt(0) === '2') {
    // 确定为本科生且不是18级以前的
    if (number.charAt(1) !== '0') {
    res = nowYear - 2000 - parseInt(number.slice(1, 3));
    } else {
      res = nowYear -  parseInt(number.slice(0,4));
    }
  } else if (number.charAt(0) !== '2' || number.charAt(2) === 'S' || number.charAt(2) === 's' || number.charAt(2) === 'B' || number.charAt(2) === 'b') {
      res = nowYear - 2000 - parseInt(number.slice(0, 2));
  }
  return res;
}

export function checkNumber(number: string): string {
  const checkReg = /[^BbDd\d]/
  if (number.length < 9 || number.length > 10) {
    return '您输入的学号长度有误'
  }
  if (checkReg.test(number)) {
    return '您输入的学号含有非法字符'
  }
  if (numToYear(number) <= 0) {
    return '您输入的学号中入学年份有误'
  }
  return '';
}

