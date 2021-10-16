import { combineReducers } from 'redux'
import { UPDATE_DICTIONARY_DATA, UPDATE_TEXTS_DATA, UPDATE_ALL_DICTIONARY_DATA, MODIFY_LABEL_OF_DICTIONARY_DATA, UPDATE_IS_SAVE, UPDATE_TEXT_TABLE_PAGE, UPDATE_MARK_TEXT_DATA, UPDATE_MARK_RECORD } from '../types/actionTypes'
import { DictionaryWindowStoreType, MainStoreType, MarkViewStoreType, StoreType, TextWindowStoreType } from '../types/propsTypes'

const initStore:StoreType = {
    Main: {
        dictionaryData: {},
        labelByShow: '',
        isSave: true
    },
    DictionaryWindow: {
        tableData: [],
        path: ''
    },
    TextWindow: {
        data: [],
        path: '',
        isSave: true,
        current: 1,
    },
    MarkView: {
        data: [],
        current: 1,
        labelRecord: []
    }
}

const MainReducer = (state: MainStoreType = initStore.Main, action: any) => {
    if (action.type === UPDATE_ALL_DICTIONARY_DATA) {
        const { dictionaryData } = action
        return {
            ...state,
            dictionaryData
        }
    } else if (action.type === MODIFY_LABEL_OF_DICTIONARY_DATA) {
        const { label, tableData } = action
        const { dictionaryData } = state
        dictionaryData[label] = tableData
        return {
            ...state,
            ...dictionaryData
        }   
    } else if (action.type === UPDATE_IS_SAVE) {
        const { isSave } = action
        return {
            ...state,
            isSave
        }
    }
    return state
}

const DictionaryWindowReducer = (state: DictionaryWindowStoreType = initStore.DictionaryWindow, action: any) => {
    if (action.type === UPDATE_DICTIONARY_DATA) {
        const { tableData, path } = action
        // console.log(path);
        return {
            ...state,
            tableData,
            path
        }
    }
    return state
}

const TextWindowReducer = (state: TextWindowStoreType = initStore.TextWindow, action: any) => {
    if (action.type === UPDATE_TEXTS_DATA) {
        const { data, path: newPath } = action
        const path = newPath || state.path
        return {
            ...state,
            data,
            path
        }
    } else if (action.type === UPDATE_IS_SAVE) {
        const { isSave } = action
        // console.log(isSave);
        return {
            ...state,
            isSave
        }
    } else if (action.type === UPDATE_TEXT_TABLE_PAGE) {
        const { current } = action
        return {
            ...state,
            current
        }
    }
    return state
}

const MarkViewReducer = (state: MarkViewStoreType = initStore.MarkView, action: any) => {
    if (action.type === UPDATE_MARK_TEXT_DATA) {
        const { data } = action
        const { labelRecord } = state
        return {
            ...state,
            data,
            labelRecord: labelRecord.length === 0 ? data.map((value: any) => []) : labelRecord
        }
    }  else if (action.type === UPDATE_TEXT_TABLE_PAGE) {
        const { current } = action
        return {
            ...state,
            current
        }
    } else if (action.type === UPDATE_MARK_RECORD) {
        const { labelRecord } = action
        return {
            ...state,
            labelRecord
        }
    }
    return state
}


const combineReducer = combineReducers({
    Main: MainReducer,
    DictionaryWindow: DictionaryWindowReducer,
    TextWindow: TextWindowReducer,
    MarkView: MarkViewReducer,
})
const reducer = (state:StoreType = initStore, action:any) => {
    const store1:StoreType = combineReducer(state, action)
    return store1
}
export default reducer

