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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                      <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                        <span v-html="item.Title"></span>
                      </a>
                    </div>
                    <div class="contentCon">{{item.DocumentNO}}/{{item.IssueDate}}发布/{{item.ImplementDate}}实施</div>
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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                        <span v-html="item.Title"></span>
                      </a>
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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                      <a :href="'#/detail/cribook/'+item.BookId+'/'+item.ContentSort" target="_blank">
                        <span v-html="item.CriTitle"></span>
                      </a>
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
                      <div class="circle"></div>
                      <div class="contentTitle">
                        <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                        <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                          <span v-html="item.Title"></span>
                        </a>
                      </div>
                      <div class="contentCon">{{item.IssueDepartment==''?'':item.IssueDepartment[0]+'/'}}{{item.IssueDate}}发布</div>
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
                      <div class="circle"></div>
                      <div class="contentTitle">
                        <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                        <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                          <span v-html="item.Title"></span>
                        </a>
                      </div>
                      <div class="contentCon">{{item.IssueDepartment==''?'':item.IssueDepartment[0]+'/'}}{{item.IssueDate}}发布/{{item.ImplementDate}}实施/{{item.Category==undefined?'':item.Category[0]}}</div>
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
                      <div class="circle"></div>
                      <div class="contentTitle">
                        <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                        <a :href="'#/detail/'+maincontent.index+'/'+item.Gid" target="_blank">
                          <span v-html="item.Title"></span>
                        </a>
                      </div>
                      <div class="contentCon">{{item.IssueDate}}发布</div>
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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                      <a :href="'#/detail/eagn/'+item.Gid" target="_blank">
                        <span v-html="item.Title"></span>
                      </a>
                    </div>
                    <div class="contentCon">{{item.IssueDepartment==undefined?'':item.IssueDepartment[0]}}/{{item.IssueDate}}发布/{{item.ConcludeAddress}}</div>
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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                      <a :href="'#/detail/twd/'+item.Gid" target="_blank">
                        <span v-html="item.Title"></span>
                      </a>
                    </div>
                    <div class="contentCon">{{item.DocumentNO}}/{{item.ValidState}}/{{item.ReleaseDate}}发布/{{item.Department}}</div>
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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                      <a :href="'#/detail/hkd/'+item.Gid" target="_blank">
                        <span v-html="item.Title"></span>
                      </a>
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
                    <div class="circle"></div>
                    <div class="contentTitle">
                      <!-- <a href="http://www.w3school.com.cn" target="_blank" ><span v-html="maincontent.Title"></span></a> -->
                      <a :href="'#/detail/crijournal/'+item.CGid" target="_blank">
                        <span v-html="item.CriTitle"></span>
                      </a>
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
        props: ["maincontent", "pagesize", "pagecount"],
        data() {
          return {
            msg: "Welcome to Your Vue.js App",
            no_data_logo:'../../static/img/no_data.png'
          };
        },
        methods: {
          handleSizeChange: function(val) {
            const queryData = {
              size: val, //字段标识
              page: this.pagecount
            };
            this.$emit("changePagination", queryData);
          },
          handleCurrentChange: function(val) {
            const queryData = {
              size: this.pagesize, //字段标识
              page: val
            };
            this.$emit("changePagination", queryData);
          }
        },
        created() {}
      };
      </script>
      
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
        color: #fc9b81;
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
        left: 15px;
        top: 30px;
        display: block;
        width: 8px;
        height: 8px;
        border: 1px solid #a7a7a7;
        border-radius: 50%;
      }
      .contentTitle {
        line-height: 30px;
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
      