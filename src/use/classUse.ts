// 类定义
import { numToBackground } from '@/use/funcUse'

export class FuncBar {
  public funcId: number
  public funcName: string
  public funcIcon: string
  public hasDrop: boolean
  constructor(id: number,name: string, icon: string, hasDrop: boolean) {
    this.funcId = id;
    this.funcName = name
    this.funcIcon = icon
    this.hasDrop = hasDrop
  }
}

// 本来打算用getter/setter模式+private变量，结果搞完localStorage之后
// 出了大问题。没办法我还是舍弃不掉localStorage😂
export class Student{
  public id: number;
  public sName: string = '';
  public sDepartment: string = '';
  public sBackground: string = '';
  public sNumber: string = '';
  constructor(id:number,name:string='请输入姓名',department:string= '请输入部门',number:string= '请输入学号') {
    this.id = id;
    this.sName = name;
    this.sDepartment = department;
    this.sNumber = number;
    this.sBackground = numToBackground(number);
  }
}
