import axios from "axios"
import qs from "qs"


// 案例ip
// 能调用司法案例
// const url = "http://170.192.106.4:8080"

// const url="http://192.168.191.3:8080"
//const url="http://170.192.106.5:8080";

//线上环境
const json_url="http://143.3.119.224:8081/search/csb-broker/PkCenter/json";
const form_url="http://143.3.119.224:8081/search/csb-broker/PkCenter/form";

// const form_url="http://localhost:8081/search/csb-broker/PkCenter/form";
// const json_url="http://localhost:8081/search/csb-broker/PkCenter/json";

// const json_url="http://170.192.106.5:8080/csb-broker/PkCenter/json";
// const form_url="http://170.192.106.5:8080/csb-broker/PkCenter/form";

// const url="http://192.168.1.18:8080"
//  中央法规高级检索下拉框获取数据
export function getZYLawSelect(typeName) {
    // return axios({
    //     url: `/sentence/searchMenuTree?type=`+typeName,
    // });

	return axios({
    url: `${form_url}`,
		params: {
		    'type':typeName
		},
		method: "post",
		headers:{
			_api_name:"fb_sentence_searchMenuTree",
			_api_version:"1.0.0",
			"Content-Type":"application/x-www-form-urlencoded"
		}
	});
}
export function Download(data) {
  axios({
    url:"http://143.3.119.223:8090/xsfb/criminal/BatchDownloadFulltext",
   // url: '/apis/CSB',
    params: {
      library: data.library,
      curLib: data.curLib,
      gids: data.gids,
      keepFields: data.keepFields,
      downloadType: data.downloadType
    },
    method: "get",
    headers: {
      _api_name: "fb_DownlodaFullText",
      _api_version: "1.0.0",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(res => {
    console.log("=====",res);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    let fileName = res.headers['content-disposition'].split('filename=');
    link.setAttribute('download', decodeURI(fileName[1]));
    document.body.appendChild(link);
    link.click();
  })
    .catch(er => {
      console.error(er);
    });
}

