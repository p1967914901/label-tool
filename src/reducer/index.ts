import { combineReducers } from 'redux'
import { 
    UPDATE_DICTIONARY_DATA, 
    UPDATE_TEXTS_DATA, 
    UPDATE_ALL_DICTIONARY_DATA, 
    MODIFY_LABEL_OF_DICTIONARY_DATA, 
    UPDATE_IS_SAVE, 
    UPDATE_TEXT_TABLE_PAGE, 
    UPDATE_MARK_TEXT_DATA,
    SET_LOADING_STATE,
    IDENTIFY_ENTITY,
    UPDATE_TRAIN_DATA
} from '../types/actionTypes'
import { 
    DictionaryWindowStoreType, 
    FontObject, 
    LoadingStoreType, 
    MainStoreType, 
    MarkViewStoreType, 
    StoreType, 
    TextWindowStoreType
} from '../types/propsTypes'


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
    },
    Loading: {
        isLoading: false
    },
    TrainView: {
        data: [],
        current: 1
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
        console.log(data)
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
        return {
            ...state,
            data,
        }
    }  else if (action.type === UPDATE_TEXT_TABLE_PAGE) {
        const { current } = action
        return {
            ...state,
            current
        }
    } else if (action.type === IDENTIFY_ENTITY) {
        return state
        const { ipcRenderer } = (window as any).electron
        const data: Array<{
            text: string,
            labels: Array<{
                start: number,
                end: number,
                label: string
            }>
        }> = state.data.map(
            (value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; textArr: FontObject[]; }) => ({
                text: value['text'],
                labels: value['textArr'].map((value: FontObject) => ({
                    start: value['start'],
                    end: value['end'] + 1,
                    label: value['label']
                })).filter((value: { start: number; end: number; label: string; }) => value['label'] !== 'none' && value['label'] !== 'uncertain')
            })
        )
        const labelToColor: {
            [label: string]: string
        } = {}
        for (let i = state.data.length - 1; i >= 0; i--) {
            for (let j = state.data[i].textArr.length - 1; j >= 0; j--) {
                if (!['none', 'uncertain'].includes(state.data[i].textArr[j]['label'])) {
                    labelToColor[state.data[i].textArr[j]['label']] = state.data[i].textArr[j]['color']
                }
            }
        }
        // console.log('data: ', data)
        ipcRenderer.send(IDENTIFY_ENTITY, data, labelToColor)
        return state
        
    }
    return state
}

const LoadingReducer = (state: LoadingStoreType = initStore.Loading, action: any) => {
    if (action.type === SET_LOADING_STATE) {
        const { isLoading } = action
        return {
            ...state,
            isLoading
        }
    }
    
    return state
}

const TrainViewReducer = (state: MarkViewStoreType = initStore.TrainView, action: any) => {
    if (action.type === UPDATE_TRAIN_DATA) {
        const { data: dataByAdd } = action
        const { data } = state
        data.splice(data.length, 0, ...dataByAdd)
        return {
            ...state,
            data
        }
    }
    
    return state
}

const combineReducer = combineReducers({
    Main: MainReducer,
    DictionaryWindow: DictionaryWindowReducer,
    TextWindow: TextWindowReducer,
    MarkView: MarkViewReducer,
    Loading: LoadingReducer,
    TrainView: TrainViewReducer,
})

const Reducer = (state:StoreType, action:any) => {
    if (action.type === IDENTIFY_ENTITY) {
        const { ipcRenderer } = (window as any).electron
        const data: Array<{
            text: string,
            labels: Array<{
                start: number,
                end: number,
                label: string
            }>
        }> = state.MarkView.data.map(
            (value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; textArr: FontObject[]; }) => ({
                text: value['text'],
                labels: []
            })
        )
        const dataByTrain: Array<{
            text: string,
            labels: Array<{
                start: number,
                end: number,
                label: string
            }>
        }> = state.TrainView.data.map(
            (value: { key?: string | undefined; text: string; label: { start: number; end: number; label: string; }[]; textArr: FontObject[]; }) => ({
                text: value['text'],
                labels: value['textArr'].map((value: FontObject) => ({
                    start: value['start'],
                    end: value['end'] + 1,
                    label: value['label']
                })).filter((value: { start: number; end: number; label: string; }) => value['label'] !== 'none' && value['label'] !== 'uncertain')
            })
        )
        const labelToColor: {
            [label: string]: string
        } = {}
        for (let i = state.TrainView.data.length - 1; i >= 0; i--) {
            for (let j = state.TrainView.data[i].textArr.length - 1; j >= 0; j--) {
                if (!['none', 'uncertain'].includes(state.TrainView.data[i].textArr[j]['label'])) {
                    labelToColor[state.TrainView.data[i].textArr[j]['label']] = state.TrainView.data[i].textArr[j]['color']
                }
            }
        }
        ipcRenderer.send(IDENTIFY_ENTITY, dataByTrain, data, labelToColor)
        return state
    }
    return state
}

const reducer = (state:StoreType = initStore, action:any) => {
    const store1:StoreType = combineReducer(state, action)
    const store2:StoreType = Reducer(store1, action)
    return store2
}
export default reducer

