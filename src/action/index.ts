import {
    UPLOAD_NEW_DICTIONARY_DATA
} from '../types/actionTypes'

/**
 * 上传新的字典数据
 */
export const uploadNewDictionaryData = (name: string, path: string) => ({
    type: UPLOAD_NEW_DICTIONARY_DATA,
    name,
    path
})