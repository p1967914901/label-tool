/**
 * 全局 store 类型
 */
export interface StoreType {
    Main: MainStoreType,
    DictionaryWindow: DictionaryWindowStoreType,
    TextWindow: TextWindowStoreType,
}


export interface MainStoreType {
    dictionaryList: Array<[name:string, path:string]>,
}

export interface DictionaryWindowStoreType {
    tableData: TableDataType,
    path: string
}

export interface TextWindowStoreType {
    data: TextsDataType,
    path: string
}

/**
 * 字典数据类型
 */
export type TableDataType = Array<{
    name: string,
    label: string,
    key?: string,
    abbreviations: Array<string>
}>

/**
 * 语料数据类型
 */
export type TextsDataType = Array<{
    key?: string,
    text: string,
    label: Array<{
        start: number,
        end: number,
        label: string
    }>
}>