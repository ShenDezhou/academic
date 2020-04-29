import axios from "axios"
// 案例ip
// 能调用司法案例
// const url = "http://170.192.106.4:8080"

// const url="http://192.168.191.3:8080"
// const url="http://170.192.106.5:60080"
const url="http://170.192.106.5:8080";//0620修改
// const url="http://192.168.1.18:8080"

// const urlPKCenter_form="http://170.192.106.5:8080/csb-broker/PkCenter/form";
// const urlKgCenter_json="http://170.192.106.5:8080/csb-broker/PkCenter/json";
//
const urlPKCenter_form="http://143.3.119.224:8081/search/csb-broker/PkCenter/form";
const urlKgCenter_json="http://143.3.119.224:8081/search/csb-broker/PkCenter/json";

// const urlFb="http://170.192.106.5:8080";
let tandu = JSON.parse(sessionStorage.getItem('tandu'));
// 获取我的收藏分类
export function getCollectCategory() {
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	   	    "token":100001
	    },
		headers:{
			_api_name:"1607_getCollectCategory",
			_api_version:"1.0.0",
		}
	});
}

// 添加搜索历史的接口
export function addKeyWordHistory(key,type) {
   let data = {
     "scope": "fulltext",
     "sort": "date",
     "page": 1,
     "size": 10,
     "index": "specialtopic",
     "keyword": key,
     "group": true,
     "title": "",
     "orderByIndex": 1,
     "userId":tandu.userId,
     "menu":type,
     "groupByIndex": 2,
     "modules": [
       1,
       2,
       3
     ]
   }

  return axios({
    url: `${urlPKCenter_form}`,
    method: "post",
    params: data,
    headers:{
      _api_name: "fb_xsfb_criminal_insertMySearchKeyList",
      _api_version:"1.0.0"
    }
  });
}


// 查看搜索历史的接口接口
export function showKeyWordHistory(key) {
 let data = {
    "userId":tandu.userId,
    "menu":key,
    "size":"10"
}

  return axios({
    url: `${urlPKCenter_form}`,
    method: "post",
    params: data,
    headers:{
      _api_name: "fb_xsfb_criminal_mySearchKeyList",
      _api_version:"1.0.0"
    }
  });
}
// 相关查询接口
export function showLikeQuery(keywords,type) {
  let data = {
    "keywords":keywords,
    "menu":type,
    "size":"10"
  }

  return axios({
    url: `${urlPKCenter_form}`,
    method: "post",
    params: data,
    headers:{
      _api_name: "fb_xsfb_criminal_synonym",
      _api_version:"1.0.0"
    }
  });
}
// 热搜词查询接口
export function hotKeywordQuery(keywords,type) {
    let data = {
      "keywords":keywords,
      "menu":type,
      "size":"10"
    }
  
    return axios({
      url: `${urlPKCenter_form}`,
      method: "post",
      params: data,
      headers:{
        _api_name: "fb_xsfb_criminal_hotKeyword",
        _api_version:"1.0.0"
      }
    });
  }


// 法宝联想接口
export function showfbThink(gid,library) {
  return axios({
    url: `${urlPKCenter_form}`,
    params: {
      "gid":gid,
      "library":library
    },
    headers:{
      _api_name:"fb_xsfb_criminal_magicWeaponLenovo",
      _api_version:"1.0.0",
    }
  });
}




// 法宝之窗接口
export function showfbWindow(key) {
  let data = {
    "gid":key.gid,
    "library":key.library,
    "tiao":key.tiao
  }
  return axios({
    url: `${urlKgCenter_json}`,
    method: "post",
    data,
    headers:{
      _api_name: "fb_xsfb_criminal_fbwindow",
      _api_version:"1.0.0",
      "Content-Type":"application/json",
    }
  });
}
// 变换文件夹的分类信息
export function updateCollectValue(data) {
  // return axios({
  //     url: `${url}/user/collect/addCollection`,
  //     params: data
  // })
  return axios({
    url: `${urlPKCenter_form}`,
    params: data,
    headers:{
      _api_name:"1607_addCollectValue",
      _api_version:"1.0.0",
    }
  });
}


// 添加文章收藏
export function addCollectValue(data) {
    // return axios({
    //     url: `${url}/user/collect/addCollection`,
    //     params: data
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: data,
		headers:{
			_api_name:"1607_addCollectValue",
			_api_version:"1.0.0",
		}
	});
}

// 个人中心收藏夹目录列表展示
export function getCollectList() {
    // return axios({
    //     url: `${url}/user/collect/queryDirectoryList`,
    //     params: {
    //         "userId":123,
    //    	    "token":100001
    //     }
    // })
	// console.log(tandu.userId,'huoqu')
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	   	    "token":100001
	    },
		headers:{
			_api_name:"1607_getCollectList",
			_api_version:"1.0.0",
		}
	})
}

// 个人中心收藏夹列表每一个收藏夹的内容列表
export function getCollectListItem(directoryId,rank) {
    // return axios({
    //     url: `${url}/user/collect/queryCollectionList`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         directoryId
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params:{
            "userId":tandu.userId,
            "token":100001,
            directoryId,
            "rank":rank
        },
		headers:{
			_api_name:"1607_getCollectListItem",
			_api_version:"1.0.0",
		}
	});
}

// 增加收藏夹分类
export function addCollectCategory(directoryName) {
    // return axios({
    //     url: `${url}/user/collect/addDirectory`,
    //     params: {
    //         "userId":123,
    //         "token":"token",
    //         directoryName
    //     }
    // });
	console.log(tandu.userId,'tianj',directoryName)
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	        "token":100001,
	        directoryName
	    },
		headers:{
			_api_name:"1607_addCollectCategory",
			_api_version:"1.0.0",
		}
	})
}

//批量删除笔记
export function delNoteMany(list) {
  let data = {
    "userId":tandu.userId,
    "token":100001,
    "directoryId":list.directoryId,
    "listIds":list.listIds,
    "noteIds":[]
  }
  // console.log("删除文件夹-----",data)
  // return axios({
  //     url: `${url}/user/collect/delDirectory`,
  //     method: "post",
  //     data
  // });
  console.log("-----------------进入删除文件夹-----",data)
  return axios({
    url: `${urlKgCenter_json}`,
    method: "post",
    data,
    headers:{
      _api_name:"167_delNoteManyCategoryItem",
      _api_version:"1.0.0",
      "Content-Type":"application/json",
    }
  });
}


//批量删除文件夹
// 删除收藏文件夹
export function delCollectMany(list) {
  let data = {
    "userId":tandu.userId,
    "token":100001,
    "directoryId":list.directoryId,
    "collectionIds":list.collectionIds
  }
  // console.log("删除文件夹-----",data)
  // return axios({
  //     url: `${url}/user/collect/delDirectory`,
  //     method: "post",
  //     data
  // });
  console.log("-----------------进入删除文件夹-----",data)
  return axios({
    url: `${urlKgCenter_json}`,
    method: "post",
    data,
    headers:{
      _api_name:"user-collect-delManyCollection",
      _api_version:"1.0.0",
      "Content-Type":"application/json",
    }
  });
}






// 删除收藏文件夹
export function delCollectCategory(list) {
    let data = {
        "userId":tandu.userId,
        "token":100001,
        "directoryIds":list
	}
	// console.log("删除文件夹-----",data)
    // return axios({
    //     url: `${url}/user/collect/delDirectory`,
    //     method: "post",
    //     data
	// });
	console.log("-----------------进入删除文件夹-----",data)
	return axios({
	    url: `${urlKgCenter_json}`,
		method: "post",
		data,
		headers:{
			_api_name:"1607_delCollectCategory",
			_api_version:"1.0.0",
			"Content-Type":"application/json",
		}
	});
}

// 删除单个收藏
export function delCollectItem(directoryId, collectionId) {
    // return axios({
    //     url: `${url}/user/collect/delCollection`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         directoryId,
    //         collectionId,
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	        "token":100001,
	        directoryId,
	        collectionId,
	    },
		headers:{
			_api_name:"1607_delCollectItem",
			_api_version:"1.0.0",
		}
	});
}

// 收藏夹名字修改
export function changeCollectCategory(directoryId, directoryName) {
    // return axios({
    //     url: `${url}/user/collect/modifyDirectory`,
    //     params: {
    //         "userId":123,
    //    		"token":100001,
    //    		directoryId,
    //    		directoryName
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	    	"token":100001,
	    	directoryId,
	    	directoryName
	    },
		headers:{
			_api_name:"1607_changeCollectCategory",
			_api_version:"1.0.0",
		}
	});
}

// 收藏夹置顶
export function collectSort(directoryId, directoryName) {
    // return axios({
    //     url: `${url}/user/collect/sortDirectory`,
    //     params: {
    //         "userId":123,
    //    		"token":100001,
    //    		directoryId,
    //    		directoryName
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	        "token":100001,
	        directoryId,
	        directoryName
	    },
		headers:{
			_api_name:"1607_collectSort",
			_api_version:"1.0.0",
		}
	});
}


// 我的笔记文件夹增加
export function addNoteCategory(directoryName) {
    // return axios({
    //     url: `${url}/user/note/addDirectory`,
    //     params: {
    //         "userId":123,
    //    		"token":100001,
    //    		directoryName
    //     }
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	        "token":100001,
			directoryName
	    },
		headers:{
			_api_name:"1607_addNoteCategory",
			_api_version:"1.0.0",
		}
	})
}
// 我的笔记-查询笔记文件夹列表
export function getNoteCategory() {
    // return axios({
    //     url: `${url}/user/note/queryDirectoryList`,
    //     params: {
    //         "userId":123,
    //         "token":100001
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	        "token":100001
	    },
		headers:{
			_api_name:"1607_getNoteCategory",
			_api_version:"1.0.0",
		}
	})
}
// 我的笔记-查询笔记文件夹下的子项列表
export function getNoteCategoryItem(directoryId,rank) {
    console.log(rank,'ll')
    // return axios({
    //     url: `${url}/user/note/queryArticleList`,
    //     params: {
    //         "userId":"123",
    //     	"token":100001,
    //     	directoryId
    //     }
    // })
    let data = {
        "userId":tandu.userId,
        "token":100001,
        directoryId,
        "rank":rank,
    };
	return axios({
        url: `${urlKgCenter_json}`,
        method:'POST',
	    data,
		headers:{
			_api_name:"1607_getNoteCategoryItem",
            _api_version:"1.0.0",
            "Content-Type":"application/json",
		}
	})
}
// 我的笔记文件夹置顶
export function noteSort(directoryId, directoryName) {
    // return axios({
    //     url: `${url}/user/note/sortDirectory`,
    //     params: {
    //         "userId":123,
    //    		"token":100001,
    //         directoryId,
    //         directoryName
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	       "userId":tandu.userId,
	       "token":100001,
	       directoryId,
	       directoryName
	    },
		headers:{
			_api_name:"1607_noteSort",
			_api_version:"1.0.0",
		}
	})
}
// 我的笔记删除笔记文件夹
export function delNoteCategory(list) {
    let data = {
        "userId":tandu.userId,
        "token":100001,
        "item":list
    }
    // return axios({
    //     url: `${url}/user/note/delDirectory`,
    //     method: "post",
    //     data
	// })http://143.3.118.68:8080/csb-broker/PkCenter/json urlPKCenter_form
	console.log("===================进入我的笔记文件夹删除======================")
	return axios({
	    url: `${urlKgCenter_json}`,
		method: "post",
	    data,
		headers:{
			_api_name:"1607_delNoteCategory",
			_api_version:"1.0.0",
			"Content-Type":"application/json",
		}
	});
}
//删除笔记/变更分类






// 我的笔记删除笔记文件夹下的子项
export function delNoteItem(articleId, listId, directoryId) {
    // return axios({
    //     url: `${url}/user/note/delArticle`,
    //     method: "post",
    //     params: {
    //         "userId":"123",
    //         "token":100001,
    //         articleId,
    //         listId,
    //         directoryId
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
		method: "post",
	    params:{
            "userId":tandu.userId,
            "token":100001,
            articleId,
            listId,
            directoryId
        },
		headers:{
			_api_name:"1607_delNoteItem",
			_api_version:"1.0.0",
		}
	})
}

// 我的笔记-笔记内容添加
export function addNoteVal(data) {
    // return axios({
    //     url: `${url}/user/note/addNoteContent`,
    //     params: data
    // })

	return axios({
	    url: `${urlPKCenter_form}`,
	    params: data,
		headers:{
			_api_name:"1607_addNoteVal",
			_api_version:"1.0.0",
		}
	})
}

// 我的足迹-批量删除足迹
export function delFeetSelect(key){
    let data = {
        "userId":tandu.userId,
        "token":100001,
        "searchIds":key.searchIds
    }
    return axios({
	    url: `${urlKgCenter_json}`,
		method: "post",
	    data,
		headers:{
			_api_name:"1607_delManyFeetsSelects",
			_api_version:"1.0.0",
			"Content-Type":"application/json",
		}
	});
}

// 我的笔记-笔记文件夹名字修改
export function changeNoteCategory(directoryId, directoryName) {
    // return axios({
    //     url: `${url}/user/note/modifyDirectory`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         directoryId,
    //    		directoryName
    //     }
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
            "userId":tandu.userId,
            "token":100001,
            directoryId,
       		directoryName
        },
		headers:{
			_api_name:"1607_changeNoteCategory",
			_api_version:"1.0.0",
		}
	})
}


// 我的笔记-笔记详情页列表获取
export function getNoteDetailList(directoryId, listId, page, num) {
  let data = {
    "userId":tandu.userId,
    "token":100001,
    directoryId,
    listId,
    page,
    num,
    "rank":'ASC'
  };
  console.log(data);
  // return axios({
  //     url: `${url}/user/note/queryNoteContentList`,
  //     params: {
  //         "userId":"123",
  //      "token":100001,
  //      directoryId,
  //      listId,
  //      page,
  //      num
  //     }
  // })
  return axios({
    url: `${urlKgCenter_json}`,
    data,
    method:"post",
    headers:{
      _api_name:"1607_getNoteDetailList",
      _api_version:"1.0.0",
      "Content-Type":"application/json",
    }
  })
}


// 我的笔记详情页删除笔记内容项
export function delNoteCategoryItem(directoryId, listId, noteId) {
    // return axios({
    //     url: `${url}/user/note/delNoteContent`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         directoryId,
    //         listId,
    //         noteId
    //     }
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
	        "token":100001,
	        directoryId,
	        listId,
	        noteId
	    },
		headers:{
			_api_name:"1607_delNoteCategoryItem",
			_api_version:"1.0.0",
		}
	})
}
// 我的笔记-笔记详情页内容修改
export function changeNoteCategoryItem(directoryId, listId, noteId, articleId, noteContent) {
   //  return axios({
   //      url: `${url}/user/note/modifyNoteContent`,
   //      params: {
   //          "userId":123,
   //          "token":100001,
   //          directoryId,
   //     		listId,
   //     		noteId,
			// articleId,
   //     		noteContent
   //      }
   //  })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	       "userId":tandu.userId,
	       "token":100001,
	       directoryId,
	       listId,
	       noteId,
	       articleId,
	       noteContent
	    },
		headers:{
			_api_name:"1607_changeNoteCategoryItem",
			_api_version:"1.0.0",
		}
	})
}

// 我的检索-检索内容添加
export function addSearch(keyword, path) {
    // return axios({
    //     url: `${url}/user/search/addContent`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         keyword,
    //    		url: path
    //     }
    // });
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
            "userId":tandu.userId,
            "token":100001,
            keyword,
       		url: path
        },
		headers:{
			_api_name:"1607_addSearch",
			_api_version:"1.0.0",
		}
	})
}

// 我的检索-检索内容获取
export function getSearchList(page, size ,rank) {
    // return axios({
    //     url: `${url}/user/search/queryContentList`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         page,
    //    		size
    //     }
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	        "userId":tandu.userId,
            "token":100001,
            "rank":"DESC",
	        page,
	    	size
	    },
		headers:{
			_api_name:"1607_getSearchList",
			_api_version:"1.0.0",
		}
	})
}

// 我的检索-检索内容删除
export function delSearch(searchId) {
    // return axios({
    //     url: `${url}/user/search/delContent`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         searchId
    //     }
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	       "userId":tandu.userId,
	       "token":100001,
	       searchId
	    },
		headers:{
			_api_name:"1607_delSearch",
			_api_version:"1.0.0",
		}
	})
}
// 我的检索-检索内容批量删除
export function delSearchSelect(searchIds) {
    // return axios({
    //     url: `${url}/user/search/delContent`,
    //     params: {
    //         "userId":123,
    //         "token":100001,
    //         searchId
    //     }
    // })
	return axios({
	    url: `${urlPKCenter_form}`,
	    params: {
	       "userId":tandu.userId,
	       "token":100001,
	       searchIds
	    },
		headers:{
			_api_name:"1607_delSearch",
			_api_version:"1.0.0",
		}
	})
}

// 司法案例搜索--获取左侧列表
export function getAggs(data) {
    return axios({
        method: "post",
        url: `/lawcases/pub/getAggs`,
        data,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                    if(it !== "tagJson"){
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }else{
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(JSON.stringify(data[it])) + '&'
                    }
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'Content-Type': 'multipart/form-data'
        }
    })
}

// 司法案例搜索--获取内容列表
export function getCases(data) {
    return axios({
        method: "post",
        url: `/lawcases/pub/getCases`,
        data,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                    if(it !== "tagJson"){
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }else{
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(JSON.stringify(data[it])) + '&'
                    }
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'Content-Type': 'multipart/form-data'
        }
    })
}
