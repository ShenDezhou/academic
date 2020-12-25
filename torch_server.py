# -*- coding: UTF-8 -*-
import argparse
import logging
import os
import sys
import time
import falcon
import pandas
from falcon_cors import CORS
import json
import waitress

if sys.hexversion < 0x02080000:
    ft = time.time
elif sys.hexversion < 0x03070000:
    ft = time.process_time
else:
    ft = time.process_time_ns

logging.basicConfig(level=logging.INFO, format='%(asctime)-18s %(message)s')
logger = logging.getLogger()
cors_allow_all = CORS(allow_all_origins=True,
                      allow_origins_list=['*'],
                      allow_all_headers=True,
                      allow_all_methods=True,
                      allow_credentials_all_origins=True
                      )

parser = argparse.ArgumentParser()
parser.add_argument(
    '-p', '--port', default=58080,
    help='falcon server port')
args = parser.parse_args()

# 0
bio = "他是清华大学计算机科学与技术系，计算机科学与技术专业，工程硕士研究生（201503-202010）。他的导师是人机交互与媒体与媒体研究所的SUNLIFENG教授。他的主要研究方向为社交网络计算、计算机视觉和自然语言处理。He gets the Master Degree of Computer Science and Technology, in the Department of Computer Science and Technology, Tsinghua University (201503-202010). His mentor is Professor Sun Lifeng in the Institute of Human-Computer Interaction and Media. His main research areas are social networking computing, computer vision, and natural language processing."
# 1
acdemic_news = [
  {"title": "2014", "content": "2014年，本人与Hu、Liu等人合作完成的《Security research of state cryptographic authentication security chip in smart grid（智能电网中的国密安全芯片研究）》，在CICED2014发布。"},
  {"title": "2015", "content": "2015年，本人与李、黄等人合作完成的《基于微信大数据的股票市场预测研究》，在ICOC2015发布。"},
  {"title": "2016", "content": "2016年12月，本人参与完成的国家标准《GB/T 33242-2016：数字城市智能卡应用技术要求》，由全国智能建筑及居住区数字化标准化技术委员会发布。"},
  {"title": "2019", "content": "2019年6月，本人与谢、冯等人合作完成的《用于移动终端的图形用户界面外观专利》，在国家知识产权局登记公布。"},
  {"title": "2020", "content": "2020年4月28日，本人的图计算发明专利，《基于提前收敛重复平方的限定域矩阵乘法距离积计算方法》，在中国国家知识产权局2020年4月28日36卷1801期登记公布。"},
  {"title": "2020", "content": "2020年6月25日，本人的图计算论文《Lower Bounds on Rate of Convergence of Matrix Products in All Pairs Shortest Path of Social Network》在arxiv.org发布。",
"ref":"https://arxiv.org/abs/2006.13412","cite":"Shen, D. (2020). Lower Bounds on Rate of Convergence of Matrix Products in All Pairs Shortest Path of Social Network. arXiv preprint arXiv:2006.13412."},
  {"title": "2020", "content": "2020年6月25日，本人的社交网络计算论文《Movie Box-office Prediction via Joint Actor Representations and Social media Sentiment》在arxiv.org发布。","ref":"https://arxiv.org/abs/2006.13417", "cite":"Shen, D. (2020). Movie Box office Prediction via Joint Actor Representations and Social Media Sentiment. arXiv preprint arXiv:2006.13417."},
  {"title": "2020", "content": '2020年，本人的图像分类论文《Enhance Image Classification Performance Via Unsupervised Pre-trained Transformers Language Models》在researchsquare.com发布', "ref":'https://www.researchsquare.com/article/rs-93060/latest.pdf'
   ,'cite':"Shen, D. (2020). Enhance Image Classification Performance Via Unsupervised Pre-trained Transformers Language Models."},
  {"title":"2020", "content":"2020年，本人的图像分类论文《Unify Language and Vision: An Efficient COVID-19 Tomography Image Classification Approach》在researchsquare.com发布，并被europepmc.org索引。","ref":"https://europepmc.org/article/ppr/ppr240245","cite":"Shen, D. (2020). Unify Language and Vision: An Efficient COVID-19 Tomography Image Classification Approach."},
  {"title":"2020", "content":"2020年，本人的图像检测与识别论文《Text Detection and Chinese Character Recognition in Natural Scene Images via Pre-trained Vision and Language Models》投递CVPR2021."},
  {"title":"2020", "content":"2020年，本人的文本摘要专利《一种基于层次多维变压器模型的文档摘要计算方法》向中国国家知识产权局递交申请."}
]
# 2
competetional_news = [
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法阅读理解赛道，最终成绩第三十七名。'},
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法摘要赛道，最终成绩第二十七名。'},
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法考试赛道，最终成绩第十三名。'},
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法论辩挖掘赛道，最终成绩第十八名。'}
]
# 3
zhihu="一种中英文本摘要算法,lawrouge中英文文本摘要评价器,基于命名实体识别的文本金额识别模型,基于融合全网语料的文本分词工具（lawa）,lawrouge中英文文本摘要测评工具-python,lawaplugin基于法律语料的文本分词Elasticsearch插件工具（法阿-elastic）,lawa基于法律语料的文本分词工具（法阿-python）,基于法律问答知识的RoBERTa微调语言模型,CAIL2020司法摘要赛道总结,CAIL2020论辩挖掘赛道总结,人工智能架构漫谈,基于TPU的合同分类模型训练,CAIL2020论辩挖掘ATTENTION模型,CAIL2020司法考试新基线,CAIL2020司法考试模型中BERT预训练语言模型的作用分析,个人发展与组织发展,两篇NIPS2020会议论文arxiv公布,BAAI2020会议参加总结,CAIL2020阅读理解新基线,CAIL2020论辩挖掘总结,基于BERT+CNN及GRU语言模型的司法考试问答模型,基于BERT+CNN语言模型的司法考试问答模型,基于BERT语言模型的司法考试问答模型,表示学习：社交网络最短路径表征,社交网络所有对最短路径矩阵距离积收敛率下限,基于Bigram的（1987-2019）NeurIPS录取论文标题的上下文联想模型,SERS:基于稀疏矩阵乘法(SpMM)的ERS社交网络测量/图最短路径计算方法,JERS：基于OpenBLAS/CuBLAS社交网络测量/图最短路径计算方法,ESR：社交网络测量/图最短路径计算方法,天授Tianshou在Windows10+CPU下的尝试,Pubseg:一种单双字串的BiLSTM中文分词工具,斯坦福Stanza分词在ICWS2005PKU数据集上的测评,基于预训练字Unigram和Bigram字向量的BiLSTM情感分类模型,基于CNN和BiLSTM的文档二分类模型,计图Jittor在Centos上的安装尝试,BiLSTM中文分词模型的多维特征分析,预训练词向量和Ngram对BiLSTM中文分词模型的影响,基于Pretrained-UnigramBigram的中文分词模型,基于预训练字模型的BiLSTM中文分词模型,LSTM中文分词模型中神经网络层分析,基于LSTM的中文分词模型,基于自定义词典和Viterbi解码的中文分词方法,基于马尔可夫链的MBA联考2020年国家分数线预测,Conditional Random Field迁移学习,HMM、CRF、JIEBA以及IK的在ICWS2005-PKU训练集上中文分词效果的评价对比,Conditional Random Field中文分词,隐马尔可夫模型中文分词测试结果"
zhihuurl='https://www.zhihu.com/zvideo/1318971493880004608,https://zhuanlan.zhihu.com/p/332251719,https://zhuanlan.zhihu.com/p/269429576,https://zhuanlan.zhihu.com/p/268779443,https://zhuanlan.zhihu.com/p/257939614,https://zhuanlan.zhihu.com/p/257029909,https://zhuanlan.zhihu.com/p/242778463,https://zhuanlan.zhihu.com/p/222344456,https://zhuanlan.zhihu.com/p/199195813,https://zhuanlan.zhihu.com/p/183720882,https://zhuanlan.zhihu.com/p/183078658,https://zhuanlan.zhihu.com/p/163706734,https://zhuanlan.zhihu.com/p/159735923,https://zhuanlan.zhihu.com/p/154116994,https://zhuanlan.zhihu.com/p/151210221,https://zhuanlan.zhihu.com/p/151008799,https://zhuanlan.zhihu.com/p/150657041,https://zhuanlan.zhihu.com/p/150553110,https://zhuanlan.zhihu.com/p/150518933,https://zhuanlan.zhihu.com/p/150048263,https://zhuanlan.zhihu.com/p/147157462,https://zhuanlan.zhihu.com/p/146845331,https://zhuanlan.zhihu.com/p/146574544,https://zhuanlan.zhihu.com/p/141446301,https://zhuanlan.zhihu.com/p/139051161,https://zhuanlan.zhihu.com/p/133468295,https://zhuanlan.zhihu.com/p/132453830,https://zhuanlan.zhihu.com/p/126637444,https://zhuanlan.zhihu.com/p/125450644,https://zhuanlan.zhihu.com/p/121701700,https://zhuanlan.zhihu.com/p/117377082,https://zhuanlan.zhihu.com/p/115844694,https://zhuanlan.zhihu.com/p/115491853,https://zhuanlan.zhihu.com/p/115335759,https://zhuanlan.zhihu.com/p/115011521,https://zhuanlan.zhihu.com/p/112243414,https://zhuanlan.zhihu.com/p/112023014,https://zhuanlan.zhihu.com/p/111681404,https://zhuanlan.zhihu.com/p/111102569,https://zhuanlan.zhihu.com/p/110756802,https://zhuanlan.zhihu.com/p/110182149,https://zhuanlan.zhihu.com/p/108908389,https://zhuanlan.zhihu.com/p/108513845,https://zhuanlan.zhihu.com/p/108198690,https://zhuanlan.zhihu.com/p/107964523,https://zhuanlan.zhihu.com/p/107593308,https://zhuanlan.zhihu.com/p/106562090'
non_acdemic_news = []
zhihu = zhihu.split(',')
zhihuurl = zhihuurl.split(',')
for i in range(len(zhihu)):
    non_acdemic_news.append({
      "title":'2020',
      "content":zhihu[i],
      "href":zhihuurl[i]
    })
# 4
code_news = [
  {"title": '2020', "content": '2020年，发布了中文词法分析模块lawa。',
  'href':'https://pypi.org/project/lawa/', 'cite':'lawa: Massive vocabulary based Chinese word segmentation module for Law and Internet domain.'},
  {"title": '2020', "content": '2020年，发布了中英文字面匹配方法lawrouge，可用于中英文的摘要、问答评价。',
  'href':'https://pypi.org/project/lawrouge/', 'cite':'lawrouge: A Multilingual Literal match method used on evaluation summary and question answering, et al.'}

]

# 5
model_pretrained = [
  {"type": "COM", "title": '2020', "content": '2020年，发布了中文SKIPGRAM预训练词向量语言模型：word2vec_skipgram_qa。',
   'href': 'https://drive.google.com/drive/folders/1bWtkwvUucT9ZtEvjjds08Oc8TGe6Iw11?usp=sharing',
   'cite': 'skipgram-qa-512dim-147935words'},

  {"type":"NLP", "title": '2020', "content": '2020年，发布了中文BERT预训练语言模型：robert_wwm_ext_qa。',
   'href': 'https://drive.google.com/drive/folders/1-wnz-EC9znkZz-DW40Mhisr4PaejtctC?usp=sharing',
   'cite': 'qabert-12layers'},
  {"type":"NLP", "title": '2020', "content": '2020年，发布了中文BERT预训练大型语言模型：robert_wwm_large_ext_qa第一版。',
   'href': 'https://drive.google.com/drive/folders/1-2U4oaOpbb5nlUOUBMdurxyoO7qMBBxf?usp=sharing',
   'cite': 'qabert-24layers-v1'},
  {"type":"NLP", "title": '2020', "content": '2020年，发布了中文BERT预训练大型语言模型：robert_wwm_large_ext_qa第二版。',
   'href': 'https://drive.google.com/drive/folders/11Pd5sy2jRePz5AVlOdImRYNDSbCtwtAS?usp=sharing',
   'cite': 'qabert-24layers-v2'}

]


# 6
cooperation_inviting = [
  {
    'title': '2020-2021', 'content':"科研合作邀请，诚邀各位专家学者与本人开展计算机视觉、文本处理方面的科研、项目合作。email: tsinghua9boy@sina.com"
  },
 {
    'title': '2020-2021', 'content':"Scientific research cooperation invitation: sincerely invite all experts and scholars to cooperate with me in scientific research and project cooperation in computer vision and text processing. Email: tsinghua9boy@sina.com"
  }
]



class TorchResource:

    def __init__(self):
        logger.info("...")
        logger.info("###")

    def getData(self, type):
        if type == "0":
            lines = bio

        if type == '1':
            lines = acdemic_news

        if type == '2':
            lines = competetional_news

        if type == '3':
            lines = non_acdemic_news

        if type == '4':
            lines = code_news

        if type == '5':
            lines = model_pretrained

        if type == '6':
            lines = cooperation_inviting

        return lines

    def on_get(self, req, resp):
        logger.info("...")
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', '*')
        resp.set_header('Access-Control-Allow-Headers', '*')
        resp.set_header('Access-Control-Allow-Credentials', 'true')
        line = req.get_param('text', True)
        lines = self.getData(line)
        resp.media = lines
        logger.info("###")

    def on_post(self, req, resp):
        """Handles POST requests"""
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', '*')
        resp.set_header('Access-Control-Allow-Headers', '*')
        resp.set_header('Access-Control-Allow-Credentials', 'true')
        resp.set_header("Cache-Control", "no-cache")
        start = ft()
        jsondata = json.loads(req.stream.read(req.content_length))
        line=jsondata['text']
        lines = self.getData(line)
        resp.media = lines
        logger.info("tot:{}ns".format(ft() - start))
        logger.info("###")

statefile='state.csv'
class StateResource:

    def __init__(self):
        logger.info("...")
        logger.info("###")
        if os.path.isfile(statefile):
            self.df = pandas.read_csv(statefile)
        else:
            self.df = pandas.DataFrame()


    def on_get(self, req, resp):
        logger.info("...")
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', '*')
        resp.set_header('Access-Control-Allow-Headers', '*')
        resp.set_header('Access-Control-Allow-Credentials', 'true')
        now = time.time()
        self.df = self.df.append({'time':now},ignore_index=True)
        if len(self.df) % 10:
            self.df.to_csv('state.csv',index=False)
        resp.media = len(self.df)
        logger.info("###")


if __name__ == "__main__":
    api = falcon.API(middleware=[cors_allow_all.middleware])
    api.req_options.auto_parse_form_urlencoded = True
    api.add_route('/z', TorchResource())
    api.add_route('/a', StateResource())
    waitress.serve(api, port=args.port, threads=48, url_scheme='http')
