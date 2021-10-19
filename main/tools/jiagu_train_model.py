"""训练数据"""
# -*- coding:utf-8 -*-
import sys
import os
import time
import gzip
import json
import pickle
import random
from collections import defaultdict

class AveragedPerceptron(object):                 #平均感知机
    def __init__(self):
        self.weights = {}              #最后是一个{ {} {}...}
        self.classes = set()
        self._totals = defaultdict(int)
        self._tstamps = defaultdict(int)
        self.i = 0                       #记录时训练集中有几个字载入

    def predict(self, features):
        '''Dot-product the features and current weights and return the best label.'''
        scores = defaultdict(float)
        for feat, value in features.items():
            if feat not in self.weights or value == 0:
                continue
            weights = self.weights[feat]
            for label, weight in weights.items():
                scores[label] += value * weight
        return max(self.classes, key=lambda label: (scores[label], label))  #如果不在weights里面的就返回  'O'  
                                                                        #否则从符合前后关系的features里面找到权重最大的返回

    def update(self, truth, guess, features):
        '''Update the feature weights.'''
        def upd_feat(c, f, w, v):
            param = (f, c)
            self._totals[param] += (self.i - self._tstamps[param]) * w     #self.i - self._tstamps[param]  相当于一种距离函数   上一次出现这种上下文关系的字和现在这个字的位置差
            # print(w,self.i , self._tstamps[param],"  ",param)       #这个在最后的均值化的时候作为除数    所以当这个距离大的话意味着该词出现的频率低达到削弱该种上下文关系的权重  
            self._tstamps[param] = self.i
            self.weights[f][c] = w + v                                 #f=>前缀    c=>tag         #如果没有这种上下文关系就添加   否则进行加减

        self.i += 1
        if truth == guess:           #如果猜对了则不更改
            return None
        for f in features:
            weights = self.weights.setdefault(f, {})                #如果猜错了那就给这个上下文关系的字典    进行给正确的  +1    给猜错的-1
            upd_feat(truth, f, weights.get(truth, 0.0), 1.2)                #2种更新情况     a.添加这个标签    b.对原有的标签进行加减
            upd_feat(guess, f, weights.get(guess, 0.0), -1.0)
        return None

    def average_weights(self):                                           #权重的平均化
        '''Average weights from all iterations.'''
        for feat, weights in self.weights.items():
            new_feat_weights = {}
            for clas, weight in weights.items():
                param = (feat, clas)
                total = self._totals[param]
                total += (self.i - self._tstamps[param]) * weight          #把最后没加上的加上
                averaged = round(total / float(self.i), 3)
                if averaged:
                    new_feat_weights[clas] = averaged
            self.weights[feat] = new_feat_weights
        return None

class Perceptron:
	def __init__(self, loc=None):
		self.START = ['-START-', '-START2-']
		self.END = ['-END-', '-END2-']
		self.model = AveragedPerceptron()
		if loc != None:
			self.load(loc)

	def predict(self, words):
		prev, prev2 = self.START
		labels = []
		context = self.START + words + self.END
		for i, word in enumerate(words):
			features = self._get_features(i, word, context, prev, prev2)
			tag = self.model.predict(features)
			labels.append(tag)
			prev2 = prev
			prev = tag
		return labels
		
	def train(self, sentences, save_loc=None, nr_iter=5, shuf=False):
		self._make_tagdict(sentences)
		# print(len(sentences))
		if sentences == []:
			return
		for iter_ in range(nr_iter):
			c = 0
			n = 0
			for words, tags in sentences:       #sentences  =>[  [[words][tags]]  ]
				prev, prev2 = self.START            #prev =>上一个字的tag      prev2=>前一个字的tag
				context = self.START + words + self.END
				for i, word in enumerate(words):
					feats = self._get_features(i, word, context, prev, prev2)    #获取这个字的特征信息
					guess = self.model.predict(feats)                  #根据这个word的特征信息预测这个word的tag  
					self.model.update(tags[i], guess, feats)           #根据预测结果来对保存的特征集进行更新
					prev2 = prev
					prev = guess
					c += guess == tags[i]          #c用于记录猜对的次数
					n += 1                         #n用于记录总共的猜测次数
			if shuf == True:           #打乱训练集
				random.shuffle(sentences)
			self.save(save_loc)
		self.model.average_weights()
		self.save(save_loc)
		
	def save(self, loc=os.path.dirname(os.path.realpath(sys.argv[0]))+r'\ap.model', zip=True):
		if zip == False:
			pickle.dump((self.model.weights, self.model.classes), open(loc, 'wb'))
		else:
			pickle.dump((self.model.weights, self.model.classes), gzip.open(loc, 'wb'))
			
	def load(self, loc=os.path.dirname(os.path.realpath(sys.argv[0]))+r'\ap.model', zip=True):
		if zip == False:
			self.model.weights, self.model.classes = pickle.load(open(loc, 'rb'))
		else:
			self.model.weights, self.model.classes = pickle.load(gzip.open(loc,'rb'))
			
	def _get_features(self, i, word, context, prev, prev2):    #特征提取
		'''Map tokens into a feature representation, implemented as a
		{hashable: float} dict. If the features change, a new model must be
		trained.
		'''
		def add(name, *args):
			features[' '.join((name,) + tuple(args))] += 1
		i += len(self.START)
		features = defaultdict(int)                           #避免普通字典多个键值产生的ERRO
		# It's useful to have a constant feature, which acts sort of like a prior
		add('bias')
		add('i suffix', word[-3:])
		add('i pref1', word[0])
		add('i-1 tag', prev)
		add('i-2 tag', prev2)
		add('i tag+i-2 tag', prev, prev2)
		add('i word', context[i])
		add('i-1 tag+i word', prev, context[i])
		add('i-1 word', context[i - 1])
		add('i-1 suffix', context[i - 1][-3:])
		add('i-2 word', context[i - 2])
		add('i+1 word', context[i + 1])
		add('i+1 suffix', context[i + 1][-3:])
		add('i+2 word', context[i + 2])
		return features

	def _make_tagdict(self, sentences):
		'''Make a tag dictionary for single-tag words.'''
		for words, tags in sentences:
			for word, tag in zip(words, tags):
				self.model.classes.add(tag)              #保存所有的tag的类型
				                                                                    #ap.model是实体识别的    cws.model是分词的

def get_json_data(filepath):     #转化json格式训练集 到需要的sentence
	training_data = []
	sentence = ([], [])
	dict=json.load(open(filepath,"r",encoding="utf-8"))
	for dict_data in dict:
		new_sentence=dict_data["text"]
		for i in new_sentence:
			sentence[0].append(i)
			sentence[1].append("O")
		if dict_data["labels"] == []:
			continue
		for elem in dict_data["labels"]:
			label=elem["label"]
			sentence[1][elem["start"]]="B-"+label
			for j in range(elem["start"]+1,elem["end"]):
				sentence[1][j]="I-"+label
		training_data.append(sentence)
		sentence = ([], [])
	return training_data

def get_txt_data(filepath):        #获取txt格式的训练集
	training_data=[]
	sentence = ([], [])
	fin = open(filepath, 'r', encoding='utf8')
	for index, line in enumerate(fin):                  #数据准备sentence[0]存放word   sentence[1]存放对应的tag
		line = line.strip()
		if line == '':                              #训练集中的句子间需要有空格       且训练集中末句需要有两个换行否则末句将不会被读取
			training_data.append(sentence)
			sentence = ([], [])            
		else:
			params = line.split()
			if len(params) != 2: continue
			sentence[0].append(params[0])
			sentence[1].append(params[1])
	fin.close()
	return training_data

def train(filepath=r'./new_train_data.txt', model=os.path.dirname(os.path.realpath(sys.argv[0]))+r'\ap.model', nr_iter=1):         #这个nr_iter=1
	"""
		目前支持   json格式  和  txt格式训练集
	"""
	tagger = Perceptron()
	key=filepath.split(".")[-1]
	if key=='json':
		training_data = get_json_data(filepath)
	elif key=='txt':
		training_data = get_txt_data(filepath)
	# print(f'training corpus size : {len(training_data)}' )   #输出的是读入训练集的句数              #training_data 的数据格式  => [sentence1,sentence2...   ]
	tagger.train(training_data, save_loc=model, nr_iter=nr_iter)

def json_txt_prd(filepath,savePath,onuse_str,tagger):   #读取的json格式的测试集
	def ceshi_trans(filepath):   # 由 json_prd调用  将json格式测试集转化为需要的sentence格式
		sentence = []
		list=json.load(open(filepath,"r",encoding="utf-8"))
		for obj in list:
			sentence.append(obj["text"])
		return sentence
	ff2=ceshi_trans(filepath)
	txtWrite = open(savePath,"w",encoding="utf-8")
	for line in ff2:
		for elem in onuse_str:
			line=line.replace(elem,'')
		words = list(line)
		lables=tagger.predict(words)
		for word, label in zip(words, lables):
			txtWrite.write(word+"\t"+label+"\n")
			# print(word, label)
		txtWrite.write("\n")
	txtWrite.close()

def json_json_prd(filepath,savePath,onuse_str,tagger):
	"""
		json 格式的训练集
		得到json格式的预测集 该预测集保留了之前打好标签的部分
	"""
	js = open(filepath,"r",encoding="utf-8")
	train_list =json.load(js)
	def ceshi_trans(train_list):   # 由 json_prd调用  将json格式测试集转化为需要的sentence格式
		sentence = []
		for obj in train_list:
			sentence.append(obj["text"])
		return sentence
	ff2=ceshi_trans(train_list)
	txtWrite = open(savePath,"w",encoding="utf-8")
	arr = []
	for line in ff2:
		temp_dict = {"text":"",'labels':[]}
		lb = {'start':0 , 'end':0 ,'label': ''}
		pre_label = "O"
		for elem in onuse_str:
			line=line.replace(elem,'')
		words = list(line)
		temp_dict['text'] = line
		lables=tagger.predict(words)
		for index,[word, label] in enumerate(zip(words, lables)):
			if "-" in label:
				label = label.split("-")[1]
			if pre_label != label:
				if pre_label == "O":
					pre_label = label
					lb['start'] = index
					lb['label'] = label
				else:
					lb['end'] = index
					temp_dict['labels'].append(lb)
					lb = {'start':0 , 'end':0 ,'label': ''}
					pre_label = label
					if label != "O":
						lb['start'] = index
						lb['label'] = label
		arr.append(temp_dict)
	# print(len(arr))
	# print(len(train_list))
	new_arr= []        
	for train,predict in zip(train_list,arr):       #保留训练集中已经打好标签的   并输出json格式的预测集
		temp_dict = {"text":"",'labels':[]}
		temp_dict["text"] = train["text"]
		temp_dict["labels"] = train["labels"]
		predict_labels = predict["labels"]
		if train["labels"] == []:
			temp_dict["labels"] = predict["labels"]
			new_arr.append(temp_dict)
			continue
		if predict_labels != []:
			for elem in predict_labels:
				flag = 0
				for i in train["labels"]:
					if (elem['start'] <= i['start'] and elem['end'] >= i['end']) or (elem['start'] <i['end'] and elem['end']>=i['end']):
						flag = 1
						break
				if flag == 0:
					temp_dict["labels"].append(elem)
		new_arr.append(temp_dict)
	txtWrite.write(json.dumps(new_arr,indent=4,ensure_ascii=False))
	txtWrite.close()
	js.close()

def txt_txt_prd(filepath,savePath,onuse_str,tagger):      #读取使用 txt格式测试集  输出txt格式的预测集
	with open (filepath,"r",encoding="utf-8") as f:
		ww = open(savePath,"w",encoding="utf-8")
		arr=list(f)
		for line in arr:
			line=line.strip()
			for elem in onuse_str:
				line=line.replace(elem,"")
			words=list(line)
			labels=tagger.predict(words)
			for word,label in zip(words, labels):
				ww.write(word+"\t"+label+"\n")
			ww.write("\n")
		ww.close()

def txt_json_prd(filepath,savePath,onuse_str,tagger):
	"""
		TXT格式的训练集  得到json格式的预测集
	"""
	with open (filepath,"r",encoding="utf-8") as f:
		ww = open(savePath,"w",encoding="utf-8")
		ff2 = list(f)
		arr = []
		for line in ff2:
			line=line.strip()
			temp_dict = {"text":"",'labels':[]}
			lb = {'start':0 , 'end':0 ,'label': ''}
			pre_label = "O"
			for elem in onuse_str:
				line=line.replace(elem,'')
			words = list(line)
			temp_dict['text'] = line
			lables=tagger.predict(words)
			for index,[word, label] in enumerate(zip(words, lables)):
				if "-" in label:
					label = label.split("-")[1]
				if pre_label != label:
					if pre_label == "O":
						pre_label = label
						lb['start'] = index
						lb['label'] = label
					else:
						lb['end'] = index
						temp_dict['labels'].append(lb)
						lb = {'start':0 , 'end':0 ,'label': ''}
						pre_label = label
						if label != "O":
							lb['start'] = index
							lb['label'] = label
			arr.append(temp_dict)
		ww.write(json.dumps(arr,indent=4,ensure_ascii=False))
		ww.close()

def predict(filepath,savePath,model = os.path.dirname(os.path.realpath(sys.argv[0])) + r'\ap.model'):                        #实体识别预测函数
	"""
		测试集数据格式支持json   txt
	"""
	onuse_str="\n"
	tagger = Perceptron(model)
	key=filepath.split(".")[-1]
	key2 = savePath.split(".")[-1]
	txt_json_prd(filepath,savePath,onuse_str,tagger)
	if key=="json" and key2=="txt":
		json_txt_prd(filepath,savePath,onuse_str,tagger)
	elif key=="txt" and key2=="txt":
		txt_txt_prd(filepath,savePath,onuse_str,tagger)
	elif key=="txt" and key2=="json":
		txt_json_prd(filepath, savePath, onuse_str, tagger)
	elif key=="json" and key2=="json":
		json_json_prd(filepath,savePath,onuse_str,tagger)

def write_predict(predict_path,save_predictions_path):
	predict(predict_path,save_predictions_path) 

def get_arg():
	args = sys.argv
	if len(args) == 2:                #传入1 个参数   1.json格式训练集   只训练模型
		train_path = args[1]
		train(filepath=train_path,nr_iter=3) 
		write_predict(train_path,os.path.dirname(os.path.realpath(sys.argv[0])) + r'.\result.json')
		print("success")
	elif len(args) == 3:                #传入2个参数的时候  1.json格式训练集路径  2.json格式预测集路径
		train_path = args[1]
		train(filepath=train_path,nr_iter=3) 
		current_dir = os.path.dirname(os.path.realpath(sys.argv[0])) + r'.\result.json'
		predict_path = args[2]
		write_predict(predict_path, r'.\result.json')
		print(current_dir)
	elif len(args) == 4:                    #传入3个参数的时候  1.json格式训练集路径  2.json格式预测集路径    3.json格式预测结果的保存路径
		train_path = args[1]
		train(filepath=train_path,nr_iter=3) 
		predict_path = args[2]
		save_predictions_path = args[3]
		write_predict(predict_path, save_predictions_path)
		print(save_predictions_path)
	else :
		print(args)
		print('false')

if __name__ == '__main__':
	get_arg()
	time.sleep(2)