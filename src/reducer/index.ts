import { combineReducers } from 'redux'
import { UPLOAD_NEW_DICTIONARY_DATA } from '../types/actionTypes'
import { MainStoreType, StoreType } from '../types/propsTypes'

const initStore:StoreType = {
    Main: {
        dictionaryList: [
            ['dict1', ''],
            ['dict2', ''],
            ['dict3', ''],
            ['dict4', ''],
            ['dict5', ''],

        ]
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

const combineReducer = combineReducers({
    Main: MainReducer
})
const reducer = (state:StoreType = initStore, action:any) => {
    const store1:StoreType = combineReducer(state, action)
    return store1
}
export default reducer

