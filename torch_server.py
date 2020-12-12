# -*- coding: UTF-8 -*-
import argparse
import logging
import sys
import time
import falcon
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

acdemic_news = [
  {"title": "2019", "content": "2019年6月，本人完成的《用于移动终端的图形用户界面外观专利》，在国家知识产权局登记公布。"},
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

competetional_news = [
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法阅读理解赛道，最终成绩第三十七名。'},
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法摘要赛道，最终成绩第二十七名。'},
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法考试赛道，最终成绩第十三名。'},
  {'title': '2020', 'content': '2020年5月15日-2020年12月12日，本人参加的2020中国‘法研杯’司法人工智能挑战赛（CAIL2020）司法论辩挖掘赛道，最终成绩第十八名。'}
]

word_ads = [
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
        if type == '1':
            lines = acdemic_news

        if type == '2':
            lines = competetional_news

        if type == '3':
            lines = word_ads

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


if __name__ == "__main__":
    api = falcon.API(middleware=[cors_allow_all.middleware])
    api.req_options.auto_parse_form_urlencoded = True
    api.add_route('/z', TorchResource())
    waitress.serve(api, port=args.port, threads=48, url_scheme='http')
