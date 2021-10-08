/**
 * 全局 store 类型
 */
export interface StoreType {
    Main: MainStoreType
}


export interface MainStoreType {
    dictionaryList: Array<[name:string, path:string]>
}
