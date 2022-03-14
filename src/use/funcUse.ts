// 一些通用的函数

import { Student } from '@/use/classUse'
import { nextTick } from '@vue/runtime-core';

export function saveToLocal(studentArr: Array<Student>) {
  localStorage.setItem('studentArr', JSON.stringify(studentArr))
}

// 新信息的id是全局唯一的，所以依靠localStorage即用即取
export function getNewStuId(): number{
  return !!localStorage.getItem('newStuId')
      ? JSON.parse(localStorage.getItem('newStuId') as string)
      : 0
}
export function setNewStuId(newId: number) {
  localStorage.setItem('newStuId', newId+'')
}

export function numToBackground(number: string | undefined): string {
  // 学号转学历的函数
  let res: string = '';
  if (!number) return res;
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

export function numToYear(number: string | undefined): number {
  // 学号转入学年份的函数
  let res: number = -1;
  const nowYear = +new Date().getFullYear();
  if (!number) return res;
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

export function checkNumber(number: string | null): string |null{
  // 检查学号合法性的函数
  const checkReg = /[^BbSs\d]/
  if (number === null) return null;
  if (number.length < 9 || number.length > 10 || (!(number.charAt(2)>='0'&&number.charAt(2)<='9')&&number.length === 10) ) {
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

export function chooseCardDetail(id: number, events:{ [propName: string]: any},studentArr:Array<Student>) {
  // 选中某张工位牌函数的实现细节
  events.selectedId = id
  if (
    !studentArr.some((value: Student) => {
      if (value.id === events.selectedId) {
        events.studentRef = value
        return true
      }
    })
  ) {
    events.studentRef = new Student(
      -1,
      '↖点这里新建工位牌',
      '某部门',
      '20S202020'
    )
  }
  events.refresh = false
  nextTick(() => {
    events.refresh = true
  })
}

export function changePropDetail(prop: string, propName: string, selectedId: number, studentArr: Array<Student>) {
  // 改变某个属性的实现细节
  let newProp: string | null = prompt('原' + propName + '为：' + prop + '，请输入修改后的' + propName)
  if (newProp && !newProp.split('').every((value) => value === ' ')) {
    return studentArr.some((value: Student) => {
      if (value.id === selectedId) {
        switch (propName) {
          case '名字':
            value.sName = newProp as string
            break
          case '部门':
            value.sDepartment = newProp as string
            break
          case '学号':
            while (!!checkNumber(newProp)) {
              alert(checkNumber(newProp))
              newProp = prompt(
                '原' +
                  propName +
                  '为：' +
                  prop +
                  '，请输入修改后的' +
                  propName
              )
            }
            if (newProp === null) return
            value.sNumber = newProp as string
            value.sBackground = numToBackground(newProp)
            break
        }
        return true
      }
    })
  }
}