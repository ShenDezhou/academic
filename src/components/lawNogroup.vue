<template>
  <div id="no-group-wrap" style="padding: 0 15px 15px;">
    <!-- {{maincontent}} -->
    <template v-if="maincontent.total==undefined">
      <div class="no_data_wrap">
        <img :src="no_data_logo" alt="未查询到相关数据">
        <p class="one">未查询到相关数据</p>
        <p class="two">建议您修改相关查询条件重新查询</p>
      </div>
    </template>
    <template v-if="maincontent.total > 0">
        <template v-if="maincontent.index=='chl'||maincontent.index=='lar'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              <!-- 法律法规内容区（不按照效力级别分组排序）刑事法规 -->
              <div class="contentTitle">
                <!-- <span class="numb_sort_checkall">
                  <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                </span> -->
                <p class="numb_sort_checkall_p">
                  <span class="numb_sort_checkall_sort">
                    {{(pagecount-1)*pagesize + (index+1)}}.
                  </span>
                  <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                    <span v-html="item.Title"></span>
                  </a>
                </p>
              </div>
              <template v-if="item.TimelinessDic">
                <div class="contentCon" style="display: inline-block;"><span v-html="item.TimelinessDic"></span> / </div>
              </template>
              <template v-if="item.DocumentNO">
                <div class="contentCon" style="display: inline-block;"><span v-html="item.DocumentNO"></span> / </div>
              </template>
              <template v-if="item.IssueDate">
                <div class="contentCon" style="display: inline-block;">
                <span v-html="item.IssueDate"></span>发布 
                <template v-if="item.ImplementDate"> / </template> 
                </div>
              </template>
              <template v-if="item.ImplementDate">
                <div class="contentCon" style="display: inline-block;">
                <span v-html="item.ImplementDate"></span>实施 
                </div>
              </template>
             
              <div class="highlightFullText_wrap" v-if="item.hitTimes != '0'&& select=='fulltext'">
                <div class="highlightFullText_wrap_hidden">
                  <p class="ckxq_wrap-guanj_minz">
                    <span class="minzhong-cishu">命中次数：</span>
                    <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                  </p>
                  <p class="ckxq_wrap">
                    <!-- <a :href="'#/detail/'+maincontent.index+'/'+item.Gid+'/'+keyword" target="_blank">
                      查看详情
                    </a> -->
                  <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                    展开命中
                  </a>
                  <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                    收起命中
                  </a>
                  </p>
                  <ul class="highlightFullText_wrap_ul">
                    <div id="hidden_highLighter" style="display:none;">
                      <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                        <span v-html="item01" v-if="index01 < 5"></span>
                      </li>
                      <div class="fenye" v-if="item.highLighter.length > 5">
                        <el-pagination style="text-align: right;"
                          background
                          @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                          :page-size="fulltextPageSize"
                          :current-page.sync="currentPageFulltext[index]"
                          layout="prev,pager,next,slot"
                          :total="currentFulltextTotal[index]"
                        ></el-pagination>
                      </div>
                    </div>
                    <div id="play_highLighter">
                      <li v-for="(item01,index01) in item.highLighter" :key="index01">
                        <span v-html="item01" v-if="index01 < 1"></span>
                      </li>
                    </div>
                  </ul>
                </div>
              
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
          <template v-if="maincontent.index=='cricase'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              
              <div class="contentTitle">
                 <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                    <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
              </div>
              <div class="contentCon">
                裁判规则：
                <span class="clore">{{item.CriJudgmentRule}}</span>
              </div>

              <div class="contentCon">
                权威引导：
                <span class="clore">{{item.CriAuthority}}</span>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
          <!-- 专家精释 -->
          <template v-if="maincontent.index=='cribookcontent'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              <!-- 法律法规内容区（不按照效力级别分组排序）专家精释 -->
              <div class="contentTitle">
                <!-- <span class="numb_sort_checkall">
                  <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                </span> -->
                <p class="numb_sort_checkall_p">
                  <span class="numb_sort_checkall_sort">
                    {{(pagecount-1)*pagesize + (index+1)}}.
                  </span>
                  <a :href="'#/detail/cribook/'+item.BookId+'/'+item.ContentSort" target="_blank">
                    <span v-html="item.CriTitle"></span>
                  </a>
                </p>
                
              </div>
              <div class="contentCon">
                <span v-html="item.CriFullText"></span>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
          <!-- 立法资料 -->
            <template v-if="maincontent.index=='workreport'|| maincontent.index=='legislation' || maincontent.index=='lawexplanation' || maincontent.index=='protocol' || maincontent.index=='whitebook'">
              <div class="content" v-for="(item,index) in maincontent.data" :key="index">
                <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
                <div class="contentTitle">
                  <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                   <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
                 
                </div>
                <div class="contentCon" v-if="maincontent.index=='protocol'">{{item.IssueDepartment==''?'':item.IssueDepartment[0]+'/'}}{{item.IssueDate}}发布</div>
                <div class="contentCon" v-if="maincontent.index=='lawexplanation'">{{item.IssueDate}}发布</div>
                <div class="contentCon" v-if="maincontent.index=='whitebook'">{{item.IssueDepartment==''?'':item.IssueDepartment[0]+'/'}}{{item.IssueDate}}发布</div>
                <div class="contentCon" v-if="maincontent.index=='workreport'">{{item.IssueDate}}发布</div>
                <div class="contentCon" v-if="maincontent.index=='legislation'">{{item.IssueDepartment==''?'':item.IssueDepartment[0]+'/'}}{{item.IssueDate}}发布</div>
                <div class="highlightFullText_wrap" v-if="item.hitTimes != '0'&& select=='fulltext'">
                  <div class="highlightFullText_wrap_hidden">
                    <p class="ckxq_wrap-guanj_minz">
                      <span class="minzhong-cishu">命中次数：</span>
                      <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                    </p>
                    <p class="ckxq_wrap">
                      <!-- <a :href="'#/detail/'+maincontent.index+'/'+item.Gid+'/'+keyword" target="_blank">
                        查看详情
                      </a> -->
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                        展开命中
                      </a>
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                        收起命中
                      </a>
                    </p>
                    <ul class="highlightFullText_wrap_ul">
                      <div id="hidden_highLighter" style="display:none;">
                        <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                          <span v-html="item01" v-if="index01 < 5"></span>
                        </li>
                        <div class="fenye" v-if="item.highLighter.length > 5">
                          <el-pagination style="text-align: right;"
                            background
                            @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                            :page-size="fulltextPageSize"
                            :current-page.sync="currentPageFulltext[index]"
                            layout="prev,pager,next,slot"
                            :total="currentFulltextTotal[index]"
                          ></el-pagination>
                        </div>
                      </div>
                      <div id="play_highLighter">
                        <li v-for="(item01,index01) in item.highLighter" :key="index01">
                          <span v-html="item01" v-if="index01 < 1"></span>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagecount"
                  :page-sizes="[10, 50, 100, 200,400]"
                  :page-size="pagesize"
                  layout="prev, pager, next,sizes,jumper,->,total,slot"
                  background
                  :total="maincontent.total"
                ></el-pagination>
              </div>
            </template>
          <!-- 立法资料 -->
          <!-- 外国法规 -->
          <template v-if="maincontent.index=='iel'">
              <div class="content" v-for="(item,index) in maincontent.data" :key="index">
                <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
                <div class="contentTitle">
                   <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
                  
                </div>
                <div class="contentCon">{{item.IssueDepartment==''?'':item.IssueDepartment[0]+'/'}}{{item.IssueDate}}发布/{{item.ImplementDate}}实施/{{item.Category==undefined?'':item.Category[0]}}</div>
                <div class="highlightFullText_wrap" v-if="item.hitTimes != '0'&& select=='fulltext'">
                  <div class="highlightFullText_wrap_hidden">
                    <p class="ckxq_wrap-guanj_minz">
                      <span class="minzhong-cishu">命中次数：</span>
                      <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                    </p>
                    <p class="ckxq_wrap">
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                        展开命中
                      </a>
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                        收起命中
                      </a>
                    </p>
                    <ul class="highlightFullText_wrap_ul">
                      <div id="hidden_highLighter" style="display:none;">
                        <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                          <span v-html="item01" v-if="index01 < 5"></span>
                        </li>
                        <div class="fenye" v-if="item.highLighter.length > 5">
                          <el-pagination style="text-align: right;"
                            background
                            @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                            :page-size="fulltextPageSize"
                            :current-page.sync="currentPageFulltext[index]"
                            layout="prev,pager,next,slot"
                            :total="currentFulltextTotal[index]"
                          ></el-pagination>
                        </div>
                      </div>
                      <div id="play_highLighter">
                        <li v-for="(item01,index01) in item.highLighter" :key="index01">
                          <span v-html="item01" v-if="index01 < 1"></span>
                        </li>
                      </div>
                    </ul>
                  </div>
                 
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagecount"
                  :page-sizes="[10, 50, 100, 200,400]"
                  :page-size="pagesize"
                  layout="prev, pager, next,sizes,jumper,->,total,slot"
                  background
                  :total="maincontent.total"
                ></el-pagination>
              </div>
            </template>
          <!-- 外国法规 -->
          <!-- 澳门 -->
          <template v-if="maincontent.index== 'aom'">
              <div class="content" v-for="(item,index) in maincontent.data" :key="index">
                <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
                <div class="contentTitle">
                  <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                   <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
                </div>
                <div class="contentCon">{{item.IssueDate}}发布</div>
                <div class="highlightFullText_wrap" v-if="item.hitTimes != '0'&& select=='fulltext'">
                  <div class="highlightFullText_wrap_hidden">
                    <p class="ckxq_wrap-guanj_minz">
                      <span class="minzhong-cishu">命中次数：</span>
                      <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                    </p>
                      <p class="ckxq_wrap">
                        <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                          展开命中
                        </a>
                        <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                          收起命中
                        </a>
                      </p>
                    <ul class="highlightFullText_wrap_ul">
                      <div id="hidden_highLighter" style="display:none;">
                        <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                          <span v-html="item01" v-if="index01 < 5"></span>
                        </li>
                        <div class="fenye" v-if="item.highLighter.length > 5">
                          <el-pagination style="text-align: right;"
                            background
                            @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                            :page-size="fulltextPageSize"
                            :current-page.sync="currentPageFulltext[index]"
                            layout="prev,pager,next,slot"
                            :total="currentFulltextTotal[index]"
                          ></el-pagination>
                        </div>
                      </div>
                      <div id="play_highLighter">
                        <li v-for="(item01,index01) in item.highLighter" :key="index01">
                          <span v-html="item01" v-if="index01 < 1"></span>
                        </li>
                      </div>
                    </ul>
                    
                  </div>
                 
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagecount"
                  :page-sizes="[10, 50, 100, 200,400]"
                  :page-size="pagesize"
                  layout="prev, pager, next,sizes,jumper,->,total,slot"
                  background
                  :total="maincontent.total"
                ></el-pagination>
              </div>
            </template>
          <!-- 澳门 -->
          <!-- 中外条约 -->
           <template v-if="maincontent.index=='eagn'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
              <div class="contentTitle">
                 <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/eagn/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
                
              </div>
              <div class="contentCon">{{item.IssueDepartment==undefined?'':item.IssueDepartment[0]}}/{{item.IssueDate}}发布/{{item.ConcludeAddress}}</div>
              <div class="highlightFullText_wrap" v-if="item.hitTimes != '0' && select=='fulltext'">
                <div class="highlightFullText_wrap_hidden">
                  <p class="ckxq_wrap-guanj_minz">
                    <span class="minzhong-cishu">命中次数：</span>
                    <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                  </p>
                    <p class="ckxq_wrap">
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                        展开命中
                      </a>
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                        收起命中
                      </a>
                    </p>
                  <ul class="highlightFullText_wrap_ul">
                    <div id="hidden_highLighter" style="display:none;">
                      <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                        <span v-html="item01" v-if="index01 < 5"></span>
                      </li>
                      <div class="fenye" v-if="item.highLighter.length > 5">
                        <el-pagination style="text-align: right;"
                          background
                          @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                          :page-size="fulltextPageSize"
                          :current-page.sync="currentPageFulltext[index]"
                          layout="prev,pager,next,slot"
                          :total="currentFulltextTotal[index]"
                        ></el-pagination>
                      </div>
                    </div>
                    <div id="play_highLighter">
                      <li v-for="(item01,index01) in item.highLighter" :key="index01">
                        <span v-html="item01" v-if="index01 < 1"></span>
                      </li>
                    </div>
                  </ul>
                 
                </div>
               
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
              <!-- 台湾法规 -->
           <template v-if="maincontent.index=='twd'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
              <div class="contentTitle">
                <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                 <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/twd/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
                
              </div>
              <div class="contentCon">{{item.DocumentNO}}/{{item.ValidState}}/{{item.ReleaseDate}}发布/{{item.Department}}</div>
              <div class="highlightFullText_wrap" v-if="item.hitTimes != '0' && select=='fulltext'">
                <div class="highlightFullText_wrap_hidden">
                  <p class="ckxq_wrap-guanj_minz">
                    <span class="minzhong-cishu">命中次数：</span>
                    <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                  </p>
                    <p class="ckxq_wrap">
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                        展开命中
                      </a>
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                        收起命中
                      </a>
                    </p>
                  <ul class="highlightFullText_wrap_ul">
                   <div id="hidden_highLighter" style="display:none;">
                      <li v-for="(item01,index01) in highLighter[index]" :key="index01">
                        <span v-html="item01" v-if="index01 < 5"></span>
                      </li>
                      <div class="fenye" v-if="item.highLighter.length > 5">
                        <el-pagination style="text-align: right;"
                          background
                          @current-change="handleCurrentChangeFll($event,item.highLighter,index)"
                          :page-size="fulltextPageSize"
                          :current-page.sync="currentPageFulltext[index]"
                          layout="prev,pager,next,slot"
                          :total="currentFulltextTotal[index]"
                        ></el-pagination>
                      </div>
                    </div>
                    <div id="play_highLighter">
                      <li v-for="(item01,index01) in item.highLighter" :key="index01">
                        <span v-html="item01" v-if="index01 < 1"></span>
                      </li>
                    </div>
                  </ul>
                 
                </div>
               
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
               <!-- 香港法规 -->
           <template v-if="maincontent.index=='hkd'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
              <div class="contentTitle">
                <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/hkd/'+item.Gid" target="_blank">
                      <span v-html="item.Title"></span>
                    </a>
                  </p>
                
              </div>
              <div class="highlightFullText_wrap" v-if="item.hitTimes != '0' && select=='fulltext'">
                <div class="highlightFullText_wrap_hidden">
                  <p class="ckxq_wrap-guanj_minz">
                    <span class="minzhong-cishu">命中次数：</span>
                    <span class="oblique-cishu">{{keyword}} <span class="one">({{item.hitTimes}})</span></span>
                  </p>
                    <p class="ckxq_wrap">
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="!mingzongArr[item.Gid]">
                        展开命中
                      </a>
                      <a href="javascript:void(0);" @click="openAllFullText($event,item.Gid,index)" v-show="mingzongArr[item.Gid]">
                        收起命中
                      </a>
                    </p>
                  <ul class="highlightFullText_wrap_ul">
                    <div id="hidden_highLighter" style="display:none;">
                      <li  v-for="(item01,index01) in item.highLighter">
                        <span v-html="item01"></span>
                      </li>
                    </div>
                    <div id="play_highLighter" >
                      <li  v-for="(item01,index01) in item.highLighter">
                        <span v-html="item01" v-if="index01 < 2"></span>
                      </li>
                    </div>
                    <li v-if="!item.highLighter" class="keyword">{{keyword}}</li>
                  </ul>
                  <p class="minzong">
                    <span class="oblique">（命中 {{item.hitTimes}} 次）</span>
                  </p>
                </div>
                <!-- <div class="highlightFullText_wrap_play">
                  <span class="keyword">{{keyword}}</span>
                  <span class="oblique">（命中 {{item.hitTimes}} 次）</span>
                </div> -->
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
           <!-- 学说观点 -->
          <template v-if="maincontent.index=='crijournal'">
            <div class="content" v-for="(item,index) in maincontent.data" :key="index">
              <!-- 法律法规内容区（不按照效力级别分组排序）学术观点 -->
              <div class="contentTitle">
                <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                <!-- <span class="numb_sort_checkall">
                    <el-checkbox v-model="checkAllList[index].status" :id="item.Gid" @change="checkedItem($event,item,index)"></el-checkbox>
                  </span> -->
                  <p class="numb_sort_checkall_p">
                    <span class="numb_sort_checkall_sort">
                      {{(pagecount-1)*pagesize + (index+1)}}.
                    </span>
                     <a :href="'#/detail/crijournal/'+item.CGid" target="_blank">
                      <span v-html="item.CriTitle"></span>
                    </a>
                  </p>
                
              </div>
              <div class="contentCon">{{item.JournalYear}}年/第{{item.JournalIssue}}期/{{item.InfoAuthor}}</div>
              <div class="contentConcrijournal">
                专家观点：
                <span v-html="item.CriFullText"></span>
              </div>
            </div>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagecount"
                :page-sizes="[10, 50, 100, 200,400]"
                :page-size="pagesize"
                layout="prev, pager, next,sizes,jumper,->,total,slot"
                background
                :total="maincontent.total"
              ></el-pagination>
            </div>
          </template>
    </template>
  </div>
</template>



<script>
export default {
  name: "lawNogroup",
  props: [
    "maincontent", 
    "pagesize", 
    "pagecount",
    "keyword",
    "select", 
    "checkAllState",
    "checkAllList",
    "dataIndex",
  ],
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      no_data_logo:'../../static/img/no_data.png',
      openOrClose:"展开命中",
      openAllFullTextFlag:false,
      // 有关命中分页的参数
      currentFulltextTotal:[],
      currentPageFulltext:[],
      currentFulltextData:[],
      fulltextPageSize:5,
      highLighter:[],
      mingzongArr:{},
        
    };
  },
  methods: {
     // 点个选择
      checkedItem(val,item,index){
          let _this = this;
          // console.log('--------------单个选择-------------',val,this.checkAllList,item,index);
            this.checkAllList.forEach((ele,index)=>{
              if(ele.Gid == item.Gid){
                ele.status = val;
              }
            });
            this.$emit("isCheckOne", this.checkAllList);

      },
    // 全文分页
    packUp(){
      // currentFulltextTotal
      let _this = this;
      _this.currentFulltextTotal =[];
      _this.currentPageFulltext=[],
      _this.highLighter = [];
      // console.log(_this.maincontent.data,'-------------packUp-------------------')
      _this.maincontent.data.forEach((ele,index)=>{
        // hitTimes
        _this.currentFulltextTotal.push(ele.highLighter.length);
        _this.currentPageFulltext.push(1);
        _this.highLighter.push(ele.highLighter);					
      });
      console.log(_this.currentFulltextTotal,this.highLighter);
    },
    // 全文分页 
    handleCurrentChangeFll(val,data,index) {
      // this.highLighter[index] = this.doPagation(val,data);
      this.$set(this.highLighter, index, this.doPagation(val,data));
      // console.log('--------quanwenfeny------',val,index,this.highLighter[index],this.highLighter);
    },
    //获取当前的数组
    doPagation: function(num, data) {
      let arry = data.slice((num - 1) * 5, num * 5);
      return arry;
    },



    openAllFullText(e,currentId,index) {

      // console.log($(e.target),'4444444444444444444444444444444444444')
      this.packUp();
      if(this.mingzongArr[currentId] == true){
        this.$set(this.mingzongArr, currentId, false);
        // console.log('4444444444对444444444444444444444444444',this.mingzongArr[currentId])
        $(e.target).parents(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
        $(e.target).parents(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");

      }else{
        // 展开命中显示 
        this.$set(this.mingzongArr, currentId, true);
        // console.log('4444444444错444444444444444444444444444',this.mingzongArr[currentId])
        $(e.target).parents(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "block");
        $(e.target).parents(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "none");
      }
    },
    handleSizeChange: function(val) {
      const queryData = {
        size: val, //字段标识
        page: this.pagecount
      };
      this.$emit("changePagination", queryData);
      $(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
      $(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
      this.mingzongArr={};
    },
    handleCurrentChange: function(val) {
      const queryData = {
        size: this.pagesize, //字段标识
        page: val
      };
      this.$emit("changePagination", queryData);
      $(".highlightFullText_wrap_hidden").find("#hidden_highLighter").css("display", "none");
      $(".highlightFullText_wrap_hidden").find("#play_highLighter").css("display", "block");
      this.mingzongArr={};
    }
  },
  created() {},
  watch:{
    checkAllState:function(newValue,oldValue){
      // console.log(this.checkAllList,'---------------子组状态件里面----------------',newValue,oldValue);
      let _this = this;
      let flag_c=false;
      for(let xy = 0; xy < this.checkAllList.length;xy++){
        if(_this.checkAllList[xy].status){
          flag_c=true;
          break;
        }
      }
      if(flag_c && !this.checkAllState){
        return;
      }
      this.checkAllListArr=[];
      this.checkAllListArr = this.checkAllList;
      
      this.checkAllList.forEach((ele,index)=>{
        // console.log(ele)
        ele.status = this.checkAllState;
      });
    },
    checkAllList:function(){
      // console.log(this.checkAllList,'---------------子组件里面----------------')
      this.checkAllListArr=[];
      this.checkAllListArr = this.checkAllList;
      // this.$set(_this.checkAllListArr, ele.Gid, true);
      let _this = this;
      this.checkAllList.forEach((ele,index)=>{
        // console.log(ele)
        ele.status = false;
      });
      // console.log(this.checkAllList,this.checkAllListArr,'---------------子组件里面信息----------------')
    },
  }
};
</script>
<style>
  .ckxq_wrap{
    text-align: right;
    margin: 0;
    margin-bottom: 10px;
  }
  .ckxq_wrap a{
    color: #82a6df !important;
  }
  .ckxq_wrap a:hover{
    color: #4f5e7b !important;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no_data_wrap{
  padding: 50px;
  box-sizing: border-box;
}
.no_data_wrap img{

}
.no_data_wrap .one{

}
.no_data_wrap .two{
  color: #879bba;
    font-size: 13px;
}
.contentTitle a{
  color: #4f5e7b;
}
.contentTitle a:visited {
  /* color: #fc9b81; */
}
.contentCon{
color:#879bba;
font-size: 14px;
margin: 10px 0;
}
.contentConcrijournal{
  color:#219CD4;
}
.contentConcrijournal span{
  color:#999;
}
.pagination {
  text-align: center;
  padding-top: 20px;
  margin-bottom: 20px;
  padding-left: 15px;
}
.red {
  color: red;
}
.content {
  padding: 20px 60px 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px dashed #a9c4df;
  text-align: left;
  position: relative;
}
.circle {
    position: absolute;
    left: 10px;
    top: 25px;
    display: block;
   
  }

  .contentTitle {
    line-height: 30px;
    color: #4f5e7b;
    /* text-indent: 20px; */
  }
.content a {
  text-decoration: none;
  color: #4f5e7b;
  text-align: left;
  outline: none;
}
#subSider {
  text-align: left;
  padding-left: 50px;
  word-wrap: break-word;
}
</style>
<style scoped lang="less">
  .numb_sort_checkall{
    display: inline-block;
    float: left;
  }
  .numb_sort_checkall_p{
    // margin-left: 25px;
  }
</style>
