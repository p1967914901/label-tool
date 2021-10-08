import sys,xlwt,json
from numpy.lib.function_base import copy
import pandas as pd

def tr(path: str) -> list:   
    """
        path: xls文件的路径
        list: Array<{
            name: string,
            label: string,
            abbreviations: Array<string>
        }>
    """
    arr=[]
    temp_dict={}
    df = pd.read_excel(path,keep_default_na=False)
    data=df.values.tolist()
    for elem in data:
        temp_dict={}
        temp_dict['name']=elem[1]
        temp_dict['label']=elem[0]
        temp_dict['abbreviations']=[i for i in elem[2:] if i != ""]
        arr.append(temp_dict)
    # print(arr)
    return arr

def tf( data_path : str,filepath: str):
    """ 
        data_path: str   json.file ,
        filepath: where to save excel
    """
    data=json.load(open(data_path,"r",encoding="utf8"))
    index=1
    f=xlwt.Workbook(encoding="utf-8")
    sheet1 = f.add_sheet('字典',cell_overwrite_ok=True)
    row0 = ["标签","全称","别名"]
    for i in range(0,len(row0)):
        sheet1.write(0,i,row0[i])
    for arr in data:
        for id,dict in enumerate(arr['name']):
            temp=[]
            temp.append(arr["label"])
            temp.append(dict["name"])
            temp+=dict['abbreviations']
            for i in range(len(temp)):
                sheet1.write(index,i,temp[i])
            index+=1
    f.save(filepath)
    return { 'success': True }

if __name__ == '__main__':
    # sys.argv[1]  'r' | 'w'
    # f(sys.argv[2])
    # if sys.argv[1] == "r":
    #     tr(sys.argv[2])
    # elif sys.argv[1] == "w":
    #     tf(sys.argv[2], sys.argv[3])
    # tf("./ditc.json","./返回的excel.xls")
    print(json.dumps(tr(sys.argv[2]) if sys.argv[1] == "r" else tf(sys.argv[2], sys.argv[3])))
    pass

