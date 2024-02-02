export interface User {
    id?: string,
    name?: string,
    number?: string,
    password?: string,
    role?: number
}
export interface StudentAttach {
  number?: number
  name?: string
  ext?: string
  description?: string
}
export interface ProcessItem {
  number?: number
  name?: string
  point?: number
  description?: string
}
export interface Process {
  id?: string
  processName?: string
  auth?: string
  point?: number
  studentAttach?: StudentAttach[]
  items?: ProcessItem[]
}
export interface Student {
  id?:string,
  name?:string,
  number?:string,
  queueNumber?:number,
  projectTitle?:string,
  groupId?:string
}
export interface Teacher {
  id?:string,
  name:string,
  number:string,
  total:number,
  leftSelect:number,
  groupId:number
}
export interface Detail {
  number:number,
  point:number
}
export interface Comment {
  teacherName?:string,
  score:number,
  detail:[]
}
