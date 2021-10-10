import {
    UPDATE_DICTIONARY_DATA,
    UPDATE_TEXTS_DATA,
    UPLOAD_NEW_DICTIONARY_DATA
} from '../types/actionTypes'
import { TableDataType, TextsDataType } from '../types/propsTypes'

/**
 * 上传新的字典数据
 */
export const uploadNewDictionaryData = (name: string, path: string) => ({
    type: UPLOAD_NEW_DICTIONARY_DATA,
    name,
    path
})

/**
 * 更新字典数据
 */
export const updateDictionaryData = (tableData: TableDataType, path: string) => ({
    type: UPDATE_DICTIONARY_DATA,
    tableData,
    path
})

/**
 * 更新语料数据
 */
export const updateTextsData = (data: TextsDataType, path: string) => ({
    type: UPDATE_TEXTS_DATA,
    data,
    path
})

/**
 * 
 */
// export const updateDictionaryDataPath