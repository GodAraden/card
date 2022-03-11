import {numToBackground} from '@/use/funcUse'

export class FuncBar {
  static currentId: number = 0
  public funcId: number
  public funcName: string
  public funcIcon: string
  public hasDrop: boolean
  constructor(name: string, icon: string, hasDrop: boolean) {
    this.funcId = FuncBar.currentId++
    this.funcName = name
    this.funcIcon = icon
    this.hasDrop = hasDrop
  }
}

export class Student{
  private _id: number;
  private _sName: string = '';
  private _sDepartment: string = '';
  private _sBackground: string = '';
  private _sNumber: string = '';
  constructor(id:number,name:string,department:string,number:string) {
    this._id = id;
    this._sName = name;
    this._sDepartment = department;
    this._sNumber = number;
    this._sBackground = numToBackground(number);
  }
  get id(): number {
    return this._id;
  }
  get sName():string {
    return this._sName;
  }
  set sName(name: string) {
    this._sName = name;
  }
  get sDepartment(): string {
     return this._sDepartment;
  }
  set sDepartment(department : string) {
    this._sDepartment = department;
  }
  get sBackground() : string {
    return this._sBackground;
  }
  get sNumber(): string {
    return this._sNumber;
  }
  set sNumber(number: string) {
    this._sNumber = number;
    this._sBackground = numToBackground(number);
  }
}
