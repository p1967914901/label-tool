import { combineReducers } from 'redux'
import { UPDATE_DICTIONARY_DATA, UPDATE_TEXTS_DATA, UPLOAD_NEW_DICTIONARY_DATA } from '../types/actionTypes'
import { DictionaryWindowStoreType, MainStoreType, StoreType, TextWindowStoreType } from '../types/propsTypes'

const initStore:StoreType = {
    Main: {
        dictionaryList: [
            ['dict1', ''],
            ['dict2', ''],
            ['dict3', ''],
            ['dict4', ''],
            ['dict5', ''],

        ]
    },
    DictionaryWindow: {
        tableData: [],
        path: ''
    },
    TextWindow: {
        data: [],
        path: ''
    }
}

const MainReducer = (state: MainStoreType = initStore.Main, action: any) => {
    if (action.type === UPLOAD_NEW_DICTIONARY_DATA) {
        const { name, path } = action
        const { dictionaryList } = state
        // for (let i = 0; i< dictionaryList.length; i++) {
        //     if (dictionaryList[i][1] === path) {
                
        //     }
        // }
        dictionaryList.push([name, path])
        console.log(dictionaryList);

        return {
            ...state,
            dictionaryList: [...dictionaryList]
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
        const { data, path } = action
        // console.log(path);
        return {
            ...state,
            data,
            path
        }
    }
    return state
}

const combineReducer = combineReducers({
    Main: MainReducer,
    DictionaryWindow: DictionaryWindowReducer,
    TextWindow: TextWindowReducer
})
const reducer = (state:StoreType = initStore, action:any) => {
    const store1:StoreType = combineReducer(state, action)
    return store1
}
export default reducer

