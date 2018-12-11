<template>
  <div>
    <!-- 弹题的弹框 -->
    <ModalQ v-model='showModal'>
      <div slot="bd"
        class="topMain"
        v-if="!haveDone">
        答题时间~
      </div>
      <div slot="bd"
        class="topMain"
        v-if="haveDone">
        答题结果
      </div>
      <div slot="fd"
        class="content"
        v-if="!haveDone">
        <div class="gxs-survey-box"
          v-for="(item, eq) in surveyData.pages"
          v-show="eq==surveyData.index"
          :key="eq">
          <div class="title2">
            <div class="sst">
              <div class="mTitle2"
                v-if="item.qtype == 'radio'">
                单选题
              </div>
              <div class="mTitle2"
                v-if="item.qtype == 'multi'">
                多选题
              </div>
              <div class="mTitle2"
                v-if="item.qtype == 'indefinite'">
                不定项
              </div>
              <div class="mTitle2"
                v-if="item.qtype == 'fill'">
                填空题
              </div>
              <div class="mTitle2"
                v-if="item.qtype == 'judge'">
                判断题
              </div>
            </div>
            <div class="clear"></div>
            <div class="bottom">
              <span class="mText f-fl"> {{surveyData.index+1}}、</span>
              <div v-html='item.title'></div>
            </div>
          </div>
          <div class="clear"></div>
          <transition name="custom-classes-transition"
            enter-active-class="animated fast fadeIn"
            leave-active-class="animated fast fadeOut">
            <div class="haveDoitBox"
              v-if="haveDoit">
              <span class="opt">
                您的选择：
              </span>
              <span class="rst">
                {{initAnswer}}
              </span>
              <span class="opt">
                正确答案：
              </span>
              <span class="rst">
                {{oriAnswer}}
              </span>
              <div class="icon-right"
                v-if="key!='wrong' && key!='partRight'"></div>
              <div class="icon-wrong"
                v-else></div>
            </div>
          </transition>
          <div class="gxs-form allowScroll"
            :class="error ? 'gxs-form-error' : '' ">
            <Checkbox :info="item"
              :sty="'s'"
              v-if="item.type == 'checkbox'"></Checkbox>
            <RadioBox :info="item"
              :sty="'s'"
              v-if="item.type == 'radio'"></RadioBox>
            <TextBox :info="item"
              :sty="'s'"
              v-else-if="item.type == 'text'||item.type == 'number'"></TextBox>
            <TextRadio :info="item"
              :sty="'s'"
              v-else-if="item.type == 'TextRadio'"></TextRadio>
          </div>
          <transition name="custom-classes-transition"
            enter-active-class="animated fast fadeIn"
            leave-active-class="animated fast fadeOut">
            <div class="gxs-survey-box-error"
              style="margin-top:30px"
              v-if="error">{{error}}</div>
          </transition>
          <!-- 显示默认提示 -->
          <PageInit :pageInitData="item.pageInit"></PageInit>
          <!-- 选择后指定出现的提示 -->
          <SurveyWarning :info="item.inputHint"
            v-if="isSHow[eq]"></SurveyWarning>
          <div class="footerOuter"
            v-if="surveyData.pages&&surveyData.pages.length>0">
            <div class="footer">
              <div class="prev2"
                v-if="surveyData.pages.length>0 && eq!=0 "
                @click="prev()">上一题</div>
              <div class="prev2s"
                v-if="surveyData.pages.length>0 && eq==0 ">上一题</div>
              <div class="gxs-progress2">
                已完成
                <span v-if="surveyData.pages&&surveyData.pages.length>0"
                  style="color:#13C0FC;margin-left:5px;">{{surveyData.index+1}}</span> / {{surveyData.pages.length}}</div>
              <div class="next2"
                @click="complete2(item,eq)"
                v-show="isNext && !haveDoit && !haveNext">下一题</div>
              <div class="next2"
                @click="next(item,eq)"
                v-show="isNext && haveDoit  && haveNext">继续答题</div>
              <div class="complete2"
                @click="complete(item,eq)"
                v-show="isComplete && !haveDoit">完成</div>
              <div class="complete2"
                @click="checkGo(item,eq)"
                v-show="isComplete && haveDoit">继续学习</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="fd"
        class="done"
        v-if="haveDone">
        <div class="contentDone">
          <div class="i"
            v-for="(item,i) in answerR"
            :key="i">
            <div class="leftItemD">
              <div class="question">
                题{{i+1}}
              </div>
            </div>
            <div class="rightItemD">
              <div class="answer"
                :style="item?'color:#333333':'color:red'">
                {{item?'对啦':'错啦'}}
              </div>
            </div>
          </div>
        </div>
        <div class="goBtn"
          @click="checkGo">
          确认
        </div>
      </div>
    </ModalQ>

    <div class="preview-pic" style="position:relative;z-index:200;">
      <img v-if="course&&course.mainPic === '' && !showVideo"
        v-lazy="require('../../../assets/img/course-default.jpg')"
        alt="">
      <img v-else-if="course&&course.mainPic&&!showVideo"
        v-lazy="$baseImageUrl + course.mainPic+'?x-oss-process=image/resize,m_fixed,h_750,w_523'"
        alt="">
      <!-- 显示视频课程的视频 -->
      <video v-else-if="showVideo"
        class="method-video"
        id="video"
        controlsList="nodownload"
        webkit-playsinline
        style="object-fit:fill"
        webkit-playsinline="true"
        x-webkit-airplay="true"
        playsinline="true"
        x5-video-player-type="h5"
        controls
        :poster="$baseImageUrl + lessonActive.courseMainPic"
        preload="auto"
        :src="playedVideoUrl">
      </video>
      <div class="video-progress-tips">
        上次已学习00:00:00，点击继续学习
      </div>
    </div>
    <!-- <div class="preview-title">
      {{course.title}}
    </div>
    <div class="views">
      <div class="icon-browser"></div>
      <span class="num">{{course.studyNum}}</span>
    </div> -->
    <!-- <div class="divition"></div> -->
    <div style="position:relative;z-index:2000;">
      <Affix :offset-top="0"
        scrollEl="page-content">
        <div class="tab">
          <ul class="tab-menu f-cb">
            <!--  <li @click="active = 'tab-intro'" class="tab-item">
              <a href="javascript:;" :class="{'active':active == 'tab-intro'}">
                <div class="activeTab" v-if=" active === 'tab-intro'"></div>
                介绍
              </a>

            </li> -->
            <li @click="active = 'tab-task'"
              class="tab-item">
              <a href="javascript:;"
                :class="{'active':active == 'tab-task'}">
                <div class="activeTab"
                  v-if=" active === 'tab-task'"></div>
                任务<span class="t-num">({{course.taskCount}})</span>
              </a>

            </li>
            <li @click="active = 'tab-topic'"
              class="tab-item">
              <a href="javascript:;"
                :class="{'active':active == 'tab-topic'}">
                <div class="activeTab"
                  v-if=" active === 'tab-topic'"></div>
                问答
              </a>

            </li>
            <li @click="active = 'tab-note'"
              class="tab-item">
              <a href="javascript:;"
                :class="{'active':active == 'tab-note'}">
                <div class="activeTab"
                  v-if=" active === 'tab-note'"></div>
                笔记
              </a>

            </li>
            <!-- <li @click="active = 'tab-source'" class="tab-item">
              <a href="javascript:;" :class="{'active':active == 'tab-source'}">
                <div class="activeTab" v-if=" active === 'tab-source'"></div>
                资料区
              </a>

            </li> -->
            <li @click="active = 'tab-judge'"
              class="tab-item">
              <a href="javascript:;"
                :class="{'active':active == 'tab-judge'}">
                <div class="activeTab"
                  v-if=" active === 'tab-judge'"></div>
                评价<span class="t-num">({{course.judgeCount}})</span>
              </a>

            </li>
          </ul>
        </div>
      </Affix>
      <div style="overflow:auto">
        <mt-tab-container v-model="active"
          :swipeable="false">
          <mt-tab-container-item id="tab-intro">
            <div class="preview-content">
              <div class="preview-content-item">
                <div class="title"></div>
                <div class="des">
                  <div v-for="(item, index) in teacher"
                    :key="index"
                    class="preview-teacher f-cb">
                    <template v-if="item">
                      <div class="pic f-fl">
                        <img v-if="item.title === ''"
                          v-lazy="require('../../../assets/img/course-default.jpg')"
                          alt="">
                        <img v-else
                          v-lazy="$baseImageUrl + item.title"
                          alt="">
                      </div>
                      <div class="info f-fl">
                        <div class="name">
                          <b>{{item.userRealName}}</b>
                        </div>
                        <div class="intro">{{item.tags === '' ? '暂无' : item.tags}}</div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="preview-content-item">
                <div class="title"></div>
                <div class="des2">
                  <div v-html="course.about"></div>
                </div>
              </div>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-task">
            <div class="preview-content"
              :style="{margin: course.edpTag == 1 ? '0' : ''}">
              <HavebuyTask :course="course" />
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-topic">
            <div class="preview-content1">
              <HavebuyTopic :course="course" />
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-note">
            <div class="preview-content2">
              <HavebuyNote :course="course" />
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-source">
            <div class="preview-content3">
              <HavebuySource />
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="tab-judge">
            <div class="preview-content">
              <HavebuyJudge />
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>

    </div>
    <!-- TODO 视频弹题 -->

  </div>
</template>

<script>
import RadioBox from "./template/Radio"
import Checkbox from "./template/Checkbox"
import TextBox from "./template/Text"
import TextRadio from "./template/TextRadio"
import PageInit from "./template/PageInit"
import SurveyWarning from "./template/SurveyWarning"
import getFilePreviewUrl from './../../../utils/getFilePreviewUrl'
import { mapGetters, mapActions } from 'vuex'
import HavebuyTask from './HavebuyTask'
import HavebuyTopic from './HavebuyTopic'
import HavebuyNote from './HavebuyNote'
import HavebuySource from './HavebuySource'
import HavebuyJudge from './HavebuyJudge'
import Cookies from 'js-cookie'
import bus from '../../../utils/bus'
import { diff } from 'semver';
export default {
  name: 'list',
  components: {
    HavebuyTask,
    HavebuyTopic,
    HavebuyNote,
    HavebuySource,
    HavebuyJudge,
    RadioBox,
    Checkbox,
    TextBox,
    TextRadio,
    PageInit,
    SurveyWarning  },
  props: ['course'],
  data () {
    return {
      active: 'tab-task',
      //来自taskMethod2
      // 同步定时器
      watch1: null,
      timer: null,
      // 学习计时，有进度则在原来的进度上继续学习，无进度则从0开始学习
      count: 0,
      canNext: false,
      recordStart: true, // 是否开始轮询
      canSet: true,
      limit: 0,
      qlist: [],
      surveyData: [],
      error: '',
      isSHow: [],
      showModal: false,
      completeData: {},
      showResult: false,
      checkQ: {},
      letsgo: true,
      answerR: {},
      t: '',
      haveDone: false,
      recordVisible: false,
      qaVisible: false,
      testNow: 0,
      durationR: 0,
      currentTimeR: 0,
      inteShow: false,
      quitShow: false,
      haveDoit: false,
      initAnswer: '',
      key: '',
      oriAnswer: '',
      haveNext: false,
      countPlay: 0,
      isFirst: true,
      courseList: {},
      lessonActive: {},
      showVideo: false,
      playedVideoUrl: '',
      // 操作播放视频的时间点，用来跟当前时间做比较，处理视频学习的watchTime
      operatePlayVideoTime: null
    }
  },
  computed: {
    ...mapGetters({
      teacher: 'course/findTeacherMessageFb'
    })
  },
  methods: {
    ...mapActions({
      onFindTeacherMessage: 'course/onFindTeacherMessage',
      onFindChapterTaskList: 'course/onFindChapterTaskList',

      //来自视频及视频弹题 taskMethod2
      onInsertCourseUserLesson: 'course/onInsertCourseUserLesson',
      onFindMCourseById: 'course/onFindMCourseById', // 查询课程的详情
      changeLessonActive: 'course/changeLessonActive',
      onSelectCourseMarkerByLessonId: 'course/onSelectCourseMarkerByLessonId',
      onAnswerQusetion: 'course/onAnswerQusetion',
      changeRecordActive: 'course/changeRecordActive',
      onFindCourseLessonById: 'course/onFindCourseLessonById'
    }),

    // 支持视频播放以及弹题的方法

    quit () {
      this.$router.go('-1')
    },
    closeQuitShow () {
      this.quitShow = false
    },
    closeInteShow () {
      this.inteShow = false
    },
    goRecord () {
      console.log("this.lessonActive", this.lessonActive)
      let record = {
        courseId: this.lessonActive.courseId,
        courseTitle: this.lessonActive.courseTitle,
        chapterId: this.lessonActive.chapterId,
        chapterNum: this.lessonActive.chapterNum,
        chapterTitle: this.lessonActive.chapterTitle,
        unitId: this.lessonActive.unitId,
        unitNum: this.lessonActive.unitNum,
        unitTitle: this.lessonActive.unitTitle,
        taskId: this.lessonActive.taskId,
        taskNum: this.lessonActive.taskNum,
        taskTitle: this.lessonActive.taskTitle
      }
      this.changeRecordActive(record)
      this.$router.push({
        path: '/course/lesson/record',
        query: {
          courseId: this.lessonActive.courseId,
          courseTitle: this.lessonActive.courseTitle,
          chapterId: this.lessonActive.chapterId,
          chapterNum: this.lessonActive.chapterNum,
          chapterTitle: this.lessonActive.chapterTitle,
          unitId: this.lessonActive.unitId,
          unitNum: this.lessonActive.unitNum,
          unitTitle: this.lessonActive.unitTitle,
          taskId: this.lessonActive.taskId,
          taskNum: this.lessonActive.taskNum,
          taskTitle: this.lessonActive.taskTitle
        }
      })
    },
    goQA () {
      this.$router.push({ path: '/course/lesson/Q&A' })
    },
    //退出全屏
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

    },
    string2Array (stringObj) {
      stringObj = stringObj.replace(/([\w,]∗)/, "$1");
      if (stringObj.indexOf("[") == 0) {// if has chinese
        stringObj = stringObj.substring(1, stringObj.length - 1);
        console.log(stringObj)
      }
      let arr = stringObj.split("\"");
      let newArray = [];//new Array();
      for (let i = 0; i < arr.length; i++) {
        let arrOne = arr[i]
        if (i !== 0 && (i + 1) % 2 === 0) {
          newArray.push(arrOne);
        }
      }
      return newArray;
    },
    rush () {
      location.reload()
    },
    abrogate () {
      this.$emit("ievent", "goCode");
      this.inteShow = false
    },
    stopCount () {
      clearTimeout(this.t)
    },
    clearCount () {
      this.count = 0
    },
    timedCount () {
      let that = this
      this.count++
      this.t = setTimeout(function () {
        that.timedCount()
      }, 1000)
    },
    checkAnswer (data) {
      let testAnswer = []
      if (typeof (data) === 'number') {
        if (data === 1) {
          testAnswer = 'A'
        } else if (data === 2) {
          testAnswer = 'B'
        } else if (data === 3) {
          testAnswer = 'C'
        } else if (data === 4) {
          testAnswer = 'D'
        }
        return testAnswer
      } else if (typeof (data) === 'object') {
        for (let key in data) {

          if (data[key]) {
            if (key === '0') {
              testAnswer.push('A')
            } else if (key === '1') {
              testAnswer.push('B')
            } else if (key === '2') {
              testAnswer.push('C')
            } else if (key === '3') {
              testAnswer.push('D')
            }
          }
        }
        return testAnswer.join(',')
      }
    },
    next (item, eq) {
      let that = this
      $("input").each(function () {
        $("input:checkbox").removeAttr("disabled") //启用
      });
      that.haveDoit = false
      that.initAnswer = ''
      that.key = ''
      that.oriAnswer = ''
      this.animatedIn = "animated fast fadeInRight";
      this.animatedOut = "animated fast fadeOutLeft";
      if (this.validation()) {
        this.surveyData.index >= this.surveyData.pages.length - 1
          ? (this.surveyData.index = this.surveyData.pages.length)
          : this.surveyData.index++;

        //清零计时器
        this.clearCount()
        //开始计时器
        this.timedCount()
      }
    },
    prev () {
      this.animatedIn = "animated fast fadeInLeft";
      this.animatedOut = "animated fast fadeOutRight";
      if (this.surveyData.index <= 0) {
        this.surveyData.index = 0;
        this.isPrev = false;
      } else {
        this.surveyData.index--;
      }
    },
    checkGo () {
      this.haveDoit = false
      this.initAnswer = ''
      this.key = ''
      this.oriAnswer = ''
      $("input:checkbox").removeAttr("disabled") //启用
      // 关掉弹题
      this.showModal = false
      // 关闭弹题结果
      this.haveDone = false
      this.answerR = []
      let myVideo = document.getElementById("video");
      if (this.currentTimeR !== this.durationR) {
        setTimeout(function () {
          myVideo.play()
        }, 300)
      }
    },
    complete2 (item, eq) {
      let that = this
      if (this.validation()) {
        /**
         * 停止计时，并且清零
         */
        this.stopCount()
        /**
         * 提交答题，并存储结果
         */
        let submitData = {
          id: item.itemId,
          answer: this.checkAnswer(item.value),
          answerTime: this.count
        }
        this.onAnswerQusetion({
          params: submitData,
          callback: (data) => {
            if (data.code === 0) {
              //清零计时器
              that.clearCount()
              that.haveDoit = true
              that.haveNext = true
              that.initAnswer = this.checkAnswer(item.value)
              that.key = data.data.status
              that.oriAnswer = item.questionAnswer
              $("input").each(function () {
                $("input:checkbox").attr("disabled", "disabled") //禁用
              })
            }
          }
        })
      }
    },
    complete (item, eq) {

      let that = this
      if (this.validation()) {
        //如果通过验证，就确认界面显示结果，且提交答题返回结果

        // item[0].isCheck = true
        this.checkQ[item.markerId].pages[0].isCheck = true

        if (!item.answer) {
          /**
           * 停止计时，并且清零
           */
          this.stopCount()

          /**
           * 提交答题，并存储结果
           */
          let submitData = {
            id: item.itemId,
            answer: this.checkAnswer(item.value),
            answerTime: this.count
          }
          this.onAnswerQusetion({
            params: submitData,
            callback: (data) => {
              if (data.code === 0) {
                if (data.data.status !== 'wrong' && data.data.status !== 'partRight') {
                  that.answerR[eq] = true
                } else {
                  that.answerR[eq] = false
                }
                //该题目已经答完
                that.surveyData.pages[eq].answer = true
                //清零计时器
                that.clearCount()
                that.haveDoit = true
                // that.haveDone = true

                that.initAnswer = this.checkAnswer(item.value)
                that.key = data.data.status
                that.oriAnswer = item.questionAnswer


                $("input").each(function () {
                  $("input:checkbox").attr("disabled", "disabled") //禁用
                });

              }
            }
          })
        } else {
        }

      }
    },
    destroy () {
      // console.log('成功触发destroyed')
      const { onInsertCourseUserLesson } = this
      this.count = ''
      // 清除定时器
      if (this.timer) {
        clearInterval(this.timer)
      }

      // 同步本地学习记录到后台
      if (this.lessonActive && Object.keys(this.lessonActive).length > 0 && this.lessonActive.fileList.length >= 0 && (this.count <= this.lessonActive.fileList[0].duration)) {
        onInsertCourseUserLesson({
          params: {
            courseId: this.lessonActive.courseId,
            lessonId: this.lessonActive.id,
            taskMethod: this.lessonActive.taskMethod,
            type: this.lessonActive.type,
            learnTime: this.count,
            position: this.count,
            status: 1
          }
        });
      } else if (this.lessonActive && Object.keys(this.lessonActive).length > 0 && this.lessonActive.fileList.length >= 0) {
        onInsertCourseUserLesson({
          params: {
            courseId: this.lessonActive.courseId,
            lessonId: this.lessonActive.id,
            taskMethod: this.lessonActive.taskMethod,
            type: this.lessonActive.type,
            learnTime: this.lessonActive.fileList[0].duration,
            position: this.lessonActive.fileList[0].duration,
            status: 2
          }
        });
      }
      Cookies.remove('lessonRecord')
    },
    // 获取弹题
    getCourseMarker () {
      let that = this
      this.onSelectCourseMarkerByLessonId({
        params: {
          lessonId: this.lessonActive.id
        },
        callback: (data) => {

          // 开始组装试题
          // 外层包装
          let wapper = {}
          let paperArr1 = {
            index: 0,
            pages: []
          }
          let getPaper = data.data
          if (getPaper && getPaper.length > 0) {
            for (let i = 0; i < getPaper.length; i++) {
              let item = getPaper[i]

              // 获取单选
              if (item.questionType === 'radio') {

                let itemRadio = item
                let radioItem = {
                  title: itemRadio.questionName,
                  type: 'radio',
                  index: 'xR' + i,
                  name: 'xR' + i,
                  choices: JSON.parse(itemRadio.questionMetas),
                  value: '',
                  itemId: itemRadio.id,
                  qtype: 'radio',
                  markerId: itemRadio.markerId,
                  second: itemRadio.second,
                  isCheck: false,
                  answer: false,
                  status: itemRadio.status,
                  questionAnswer: itemRadio.questionAnswer
                }

                if (!wapper.hasOwnProperty(radioItem.markerId)) {
                  let paperArr = {
                    index: 0,
                    pages: []
                  }
                  paperArr.pages.push(radioItem)
                  wapper[radioItem.markerId] = []
                  wapper[radioItem.markerId] = paperArr
                } else {
                  wapper[radioItem.markerId].pages.push(radioItem)
                }
              } else if (item.questionType === 'multi') {
                let itemMulti = item
                let multiItem = {
                  title: itemMulti.questionName,
                  type: 'checkbox',
                  index: 'xM' + i,
                  name: 'xM' + i,
                  choices: JSON.parse(itemMulti.questionMetas),
                  value: {},
                  itemId: itemMulti.id,
                  qtype: 'multi',
                  markerId: itemMulti.markerId,
                  second: itemMulti.second,
                  isCheck: false,
                  answer: false,
                  status: itemMulti.status,
                  questionAnswer: itemMulti.questionAnswer
                }
                for (let x = 0; x < multiItem.choices.length; x++) {
                  multiItem.value[x] = false
                }

                if (!wapper.hasOwnProperty(multiItem.markerId)) {
                  let paperArr = {
                    index: 0,
                    pages: []
                  }
                  paperArr.pages.push(multiItem)
                  wapper[multiItem.markerId] = []
                  wapper[multiItem.markerId] = paperArr
                } else {
                  wapper[multiItem.markerId].pages.push(multiItem)
                }

              } else if (item.questionType === 'indefinite') {
                let itemIndefinite = item
                let indefiniteItem = {
                  title: itemIndefinite.questionName,
                  type: 'checkbox',
                  index: 'xI' + i,
                  name: 'xI' + i,
                  choices: JSON.parse(itemIndefinite.questionMetas),
                  value: {},
                  itemId: itemIndefinite.id,
                  qtype: 'indefinite',
                  markerId: itemIndefinite.markerId,
                  second: itemIndefinite.second,
                  isCheck: false,
                  answer: false,
                  status: itemIndefinite.status,
                  questionAnswer: itemIndefinite.questionAnswer
                }
                for (let i = 0; i < indefiniteItem.choices.length; i++) {
                  indefiniteItem.value[i] = false
                }
                if (!wapper.hasOwnProperty(indefiniteItem.markerId)) {
                  let paperArr = {
                    index: 0,
                    pages: []
                  }
                  paperArr.pages.push(indefiniteItem)
                  wapper[indefiniteItem.markerId] = []
                  wapper[indefiniteItem.markerId] = paperArr
                } else {
                  wapper[indefiniteItem.markerId].pages.push(indefiniteItem)
                }
              }
            }
          }

          that.checkQ = wapper
          // 这里
          that.error = false
          that.watch1 = that.$watch('surveyData.pages',
            function () {
              if (that.surveyData && that.surveyData.length > 0 && that.surveyData.pages.length > 0) {
                if (!this.letsgo) {
                  this.letsgo = true
                } else {
                  that.validation();
                }
              } else {

              }
            },
            { deep: true })
        }
      })
    },
    answerQusetion (item) {
      let data = {
        id: item.id
      }
      this.onSelectCourseMarkerByLessonId({
        params: {
          lessonId: this.lessonActive.id
        },
        callback: (data) => {
        }
      })
    },
    validation () {
      let isText = null;
      let surveysIndex = this.surveyData.pages[this.surveyData.index];
      let surveysIndexs = surveysIndex.index;
      if (this.surveyData.pages[this.surveyData.index].type === "TextRadio") {
        let ary = 0;
        for (let i = 0; i < surveysIndex.choices.length; i++) {
          if (surveysIndex.choices[i].value.length > 0) {
            ary++;
            if (ary >= surveysIndex.choices.length) {
              this.error = ''
              return true;
            }
          } else {
            this.error = '请填写或选择此项';
            return false;
          }
        }
      } else {
        if (typeof (surveysIndex.value) === 'object') {
          let checkArr = false
          let that = this
          for (let key in surveysIndex.value) {
            if (surveysIndex.value[key]) {
              checkArr = true
              if (surveysIndex.inputHint) {
                if (surveysIndex.value instanceof Array) {
                  isText = surveysIndex.value[0];
                } else {
                  isText = surveysIndex.value;
                }
                for (let y = 0; y < surveysIndex.inputHint.choices.length; y++) {
                  if (isText === surveysIndex.inputHint.choices[y]) {
                    that.$set(that.isSHow, that.surveyData.index, true);
                    break;
                  } else {
                    that.$set(that.isSHow, that.surveyData.index, false);
                  }
                }
              } else {
                isText = surveysIndex.value;
                that.$set(that.isSHow, that.surveyData.index, false);
              }
              that.error = "";
              return true;
            }
          }
          if (checkArr) {
            if (surveysIndex.inputHint) {
              if (surveysIndex.value instanceof Array) {
                isText = surveysIndex.value[0];
              } else {
                isText = surveysIndex.value;
              }
              for (let y = 0; y < surveysIndex.inputHint.choices.length; y++) {
                if (isText === surveysIndex.inputHint.choices[y]) {
                  this.$set(this.isSHow, this.surveyData.index, true);
                  break;
                } else {
                  this.$set(this.isSHow, this.surveyData.index, false);
                }
              }
            } else {
              isText = surveysIndex.value;
              this.$set(this.isSHow, this.surveyData.index, false);
            }

            this.$set(this.completeData, surveysIndexs, isText);
            this.error = "";
            return true;
          } else {
            if (surveysIndex.inputHint) {
              this.$set(this.isSHow, this.surveyData.index, false);
            }
            if (surveysIndex.type === "radio") {
              this.$toast('请选择本题选项')
            } else if (surveysIndex.type === "checkbox") {
              this.$toast('请选择本题选项')
            } else {
              this.$toast('请选择本题选项')
            }
            return false;
          }
        } else {
          if (
            surveysIndex.value.length > 0 ||
            Object.keys(surveysIndex.value).length > 0 ||
            surveysIndex.value != ''
          ) {
            if (surveysIndex.inputHint) {
              if (surveysIndex.value instanceof Array) {
                isText = surveysIndex.value[0];
              } else {
                isText = surveysIndex.value;
              }
              for (let y = 0; y < surveysIndex.inputHint.choices.length; y++) {
                if (isText === surveysIndex.inputHint.choices[y]) {
                  this.$set(this.isSHow, this.surveyData.index, true);
                  break;
                } else {
                  this.$set(this.isSHow, this.surveyData.index, false);
                }
              }
            } else {
              isText = surveysIndex.value;
              this.$set(this.isSHow, this.surveyData.index, false);
            }

            this.$set(this.completeData, surveysIndexs, isText);
            this.error = "";
            return true;
          } else {
            if (surveysIndex.inputHint) {
              this.$set(this.isSHow, this.surveyData.index, false);
            }
            if (surveysIndex.type === "radio") {
              // this.error = "请选择此项";
              this.$toast('请选择本题选项')
            } else if (surveysIndex.type === "checkbox") {
              this.$toast('请选择本题选项')
            } else {
              this.$toast('请选择本题选项')
            }
            return false;
          }
        }


      }
    },
    intervalSixty () {
      let that = this
      this.count = $("#video").attr("currentTime");
      this.onInsertCourseUserLesson({
        params: {
          courseId: this.lessonActive.courseId,
          lessonId: this.lessonActive.id,
          taskMethod: this.lessonActive.taskMethod,
          type: this.lessonActive.type,
          learnTime: this.count,
          position: this.count
          // status: 2
        }
      });
      setTimeout(function () {
        that.intervalSixty()
      }, 60 * 1000)
    },
    playV () {
      let myVideo = document.getElementById("video");
      myVideo.play()

    },
    calculateTime () {
      // 开始播放视频时，就每3秒存一次本地，如果视频暂停，就不再每3秒保存一次
      let that = this
      if (this.recordStart) {
        this.count++
        let position = $("#video").attr("currentTime");
        this.lessonActive.count = this.count
        const o = {
          courseId: this.lessonActive.courseId,
          lessonId: this.lessonActive.id,
          taskMethod: this.lessonActive.taskMethod,
          type: this.lessonActive.type,
          learnTime: this.lessonActive.count,
          position: position
        }

        // 同步本地记录 三秒同步一次
        Cookies.set('lessonRecord', JSON.stringify(o), { expire: 180 })
        setTimeout(function () {
          that.calculateTime()
        }, 3000)
      } else {
        that.$emit("ievent", 'goCode')
        // 学习完成，清除定时器
        // clearInterval(this.timer)
        let position = $("#video").attr("duration");
        // 刷新完成状态
        let data = {
          id: that.lessonActive.id
        };
        that.onFindCourseLessonById({
          params: data,
          callback: (res) => {
            let getItem = res.data
            let arr = {
              ...getItem.lessonInfo,
              nextId: getItem.nextId,
              lastId: getItem.lastId,
              nextTitle: getItem.nextTitle,
              nextTaskMethod: getItem.nextTaskMethod
            }
            if (arr.finishStatus != 2 && arr.completeTaskNum + 1 == arr.taskNum) {
              that.inteShow = true
            }
          }
        });
        this.canNext = true
        this.count = 0
        const { onInsertCourseUserLesson } = this
        onInsertCourseUserLesson({
          params: {
            courseId: this.lessonActive.courseId,
            lessonId: this.lessonActive.id,
            taskMethod: this.lessonActive.taskMethod,
            type: this.lessonActive.type,
            learnTime: this.lessonActive.mustLength,
            position: this.lessonActive.fileList[0].duration,
            status: 2
          }
        });
      }
    }

  },
  created () {
    let that = this
    bus.$on('playTaskMethod2', function (data) {
      // console.log('playTaskMethod2 I get it');
      // 获取到子组件的事件，当前页面开始播放视频，并且准备好弹题
      that.lessonActive = data
      that.showVideo = true
      /**
       * 获取弹题
       */
      that.getCourseMarker()




      /**
       * 视频的记录：
       * 1、监听视频播放，如果视频播放，开始轮询，每3秒存一次本地，每60秒传一次server，
       * 2、监听视频停止，如果视频停止，停止所有轮询
       * 3、播放完毕和离开都传server
       */
      this.$nextTick(function () {

        let o = {}
        // DOM is now updated
        // `this` is bound to the current instance
        let myVideo = document.getElementById("video");
        if (myVideo) {
          myVideo.addEventListener('play', function () {
            document.querySelector('.video-progress-tips').style.display = 'none'
            this.operatePlayVideoTime = new Date().getTime()
          })
          myVideo.addEventListener('pause', function (e) {
            that.exitFullscreen()
            if (navigator.userAgent.indexOf("iPhone") < 0) {

            }
          });
          myVideo.addEventListener("webkitfullscreenchange", function (e) {

            if (!document.webkitIsFullScreen) { //退出全屏暂停视频
              video.pause();
            };
          }, false);
          myVideo.addEventListener("fullscreenchange ", function (e) {
            if (!document.webkitIsFullScreen) { //退出全屏暂停视频
              video.pause();
            };
          }, false);
          myVideo.addEventListener('ended', function () {
            //播放完毕，退出全屏
            that.exitFullscreen()
          }, false);


          if (that.lessonActive.finishedModel != 'none' && that.lessonActive && that.lessonActive.mustLength > 0) {

          } else {
            // 刷新完成状态
            let data = {
              id: that.lessonActive.id
            };
            setTimeout(function () {
              that.onFindCourseLessonById({
                params: data,
                callback: (res) => {
                  let getItem = res.data
                  let arr = {
                    ...getItem.lessonInfo,
                    nextId: getItem.nextId,
                    lastId: getItem.lastId,
                    nextTitle: getItem.nextTitle,
                    nextTaskMethod: getItem.nextTaskMethod
                  }
                  if (arr.finishStatus != 2 && arr.completeTaskNum + 1 == arr.taskNum) {
                    that.inteShow = true
                  }
                }
              });
            }, 200)

            that.$emit("ievent", 'goCode')
            that.onInsertCourseUserLesson({
              params: {
                courseId: that.lessonActive.courseId,
                lessonId: that.lessonActive.id,
                taskMethod: that.lessonActive.taskMethod,
                type: that.lessonActive.type,
                learnTime: that.lessonActive.mustLength,
                position: parseInt(this.currentTimeR),
                status: 2
              }
            });
          }

          myVideo.ontimeupdate = function () {
            console.log('开始播放视频啦')
            // 累计播放时长
            that.durationR = this.duration
            that.currentTimeR = this.currentTime
            let myVideo = document.getElementById("video");
            $(".icon-play").hide();
            $("#poster_img").hide();
            /**
             * 检查之前的时间是否有未答的题目，如果有，则播放进度跳至第一个未答题时间 Cookies.set('testNow')
             */
            if (that.checkQ && Object.keys(that.checkQ).length > 0) {
              for (let key in that.checkQ) {
                let checkItem = that.checkQ[key]
                if (checkItem.pages[0].status !== 'right') {
                  if (checkItem.pages[0].second && !checkItem.pages[0].isCheck) {
                    if (parseInt(this.currentTime) > checkItem.pages[0].second) {
                      if (checkItem.pages[0].second - 5 > 0) {
                        this.currentTime = checkItem.pages[0].second - 5
                      } else {
                        this.currentTime = 0
                      }
                    }
                  }
                }
              }
            }
            if (that.isFirst) {
              that.isFirst = false
              this.currentTime = that.lessonActive.position
            }

            // 每时都检查是否到了检查点，如果是，就退出全屏（无论是否全屏），暂停视频，弹出该题目
            for (let key in that.checkQ) {
              let checkItem = that.checkQ[key]
              if (parseInt(this.currentTime) === checkItem.pages[0].second && !checkItem.pages[0].isCheck && checkItem.pages[0].status !== 'right') {
                // 遇到了检查点,推入该题目，到弹题，且弹出题目
                myVideo.pause()
                that.exitFullscreen()
                //如果是安卓position: relative; display: none;  z-index: -1;
                if (navigator.userAgent.indexOf("iPhone") < 0) {
                  $("video").css("position", "relative");
                  $("video").css("z-index", "-1");
                  $("video").css("display", "none");
                  setTimeout(function () {
                    $("video").css("position", "relative");
                    $("video").css("z-index", "1");
                    $("video").css("display", "block");
                  }, 2000)
                }

                that.letsgo = false
                that.surveyData = checkItem
                setTimeout(function () {
                  that.showModal = true
                }, 300)

                that.error = false

                /**
                 * 开始计时
                 */
                that.timedCount()
              }
            }
            if (that.lessonActive.mustLength && parseInt(this.duration) < that.lessonActive.mustLength) {
              this.limit = parseInt(this.duration)
            } else {
              this.limit = that.lessonActive.mustLength
            }
            if (that.lessonActive.position === this.limit) {
              that.count = this.limit
              that.$emit("ievent", 'goCode')
            } else {
              that.count = parseInt(this.currentTime)
            }

            //每过3秒，存一次本地

            if (this.currentTime === that.lessonActive.mustLength) {
              that.$emit("ievent", 'goCode')
            }
            if (that.canSet) {
              if (that.lessonActive && that.lessonActive.position) {
                myVideo.currentTime = that.lessonActive.position
              }
              that.canSet = false
            }
            if (parseInt(this.currentTime) !== 0 && parseInt(this.currentTime) % 3 === 0) {
              o = {
                courseId: that.lessonActive.courseId,
                lessonId: that.lessonActive.id,
                taskMethod: that.lessonActive.taskMethod,
                type: that.lessonActive.type,
                learnTime: parseInt(this.currentTime),
                position: parseInt(this.currentTime)
              }
              // 同步本地记录 三秒同步一次
              Cookies.set('lessonRecord', JSON.stringify(o), { expire: 180 })
            }


            // 给服务器发送的太频繁，处理短一些时间,大概3秒一次
            let prevTime = that.operatePlayVideoTime
            let nowTime = new Date().getTime()
            let diffTime = parseInt((nowTime - prevTime)/1000)
            if (diffTime >= 3 && diffTime < 10) {
              if (parseInt(this.currentTime) !== 0 && parseInt(this.currentTime) % 2 === 0 && parseInt(this.currentTime) !== parseInt(this.duration)) {
                console.log('=====================1')
                that.onInsertCourseUserLesson({
                  params: {
                    courseId: that.lessonActive.courseId,
                    lessonId: that.lessonActive.id,
                    taskMethod: that.lessonActive.taskMethod,
                    type: that.lessonActive.type,
                    learnTime: that.lessonActive.mustLength,
                    watchTime: diffTime,
                    position: parseInt(this.currentTime),
                    status: 1
                  }
                });
                // 每保存一次，重新计算视频观看时间点
                this.operatePlayVideoTime = new Date().getTime()
                // console.log(new Date().getTime())
              }
              if (parseInt(this.currentTime) !== 0 && (parseInt(this.currentTime) - 1) === parseInt(that.lessonActive.mustLength)) {
                console.log('=====================2')
                that.onInsertCourseUserLesson({
                  params: {
                    courseId: that.lessonActive.courseId,
                    lessonId: that.lessonActive.id,
                    taskMethod: that.lessonActive.taskMethod,
                    type: that.lessonActive.type,
                    learnTime: that.lessonActive.mustLength,
                    watchTime: diffTime,
                    position: parseInt(this.currentTime),
                    status: 2
                  },
                  callback: (data) => {
                    // 刷新完成状态
                    let data1 = {
                      id: that.lessonActive.id
                    };
                    if (that.lessonActive.finishStatus != 2) {
                      that.onFindCourseLessonById({
                        params: data1,
                        callback: (res) => {
                          let getItem = res.data
                          let arr = {
                            ...getItem.lessonInfo,
                            nextId: getItem.nextId,
                            lastId: getItem.lastId,
                            nextTitle: getItem.nextTitle,
                            nextTaskMethod: getItem.nextTaskMethod
                          }
                          if (arr.finishStatus == 2 && arr.completeTaskNum + 1 == arr.taskNum) {
                            that.inteShow = true
                          }
                        }
                      });
                    }
                  }
                });
                that.$emit("ievent", 'goCode')
                that.onInsertCourseUserLesson({
                  params: {
                    courseId: that.lessonActive.courseId,
                    lessonId: that.lessonActive.id,
                    taskMethod: that.lessonActive.taskMethod,
                    type: that.lessonActive.type,
                    learnTime: that.lessonActive.mustLength,
                    watchTime: diffTime,
                    position: parseInt(this.currentTime),
                    status: 2
                  }
                })
                // 每保存一次，重新计算视频观看时间点
                this.operatePlayVideoTime = new Date().getTime()
                console.log(new Date().getTime())
              }
            }
            // 用户自己修改客户端时间，导致观看异常，重置视频播放时间为当前时间
            if(diffTime > 10){
              that.operatePlayVideoTime = new Date().getTime()
            }
          };
          // 用户已经拖动进度条
          myVideo.onseeked = function () {
            return false;
          }
          // 用户正在拖动进度条
          myVideo.onseeking = function () {
            return false;
          }
        }

      }
      )
    });
    bus.$on('notPlayTaskMethod2', function (data) {
      // console.log('notPlayTaskMethod2 I get it');
      // 获取到子组件的事件，当前页面开始播放视频，并且准备好弹题
      that.watch1 = null
      that.showVideo = false
      that.lessonActive = []
      that.surveyData = []
      that.checkQ = []
      that.destroy()
    });
  },
  mounted () {
    this.active = Cookies.get('tab') ? Cookies.get('tab') : 'tab-task'
    Cookies.remove('tab')
    // 来自视频和视频弹题
  },
  watch: {
    "surveyData.index" () {
      if (this.surveyData.index >= this.surveyData.pages.length - 1) {
        this.isNext = false;
        this.isComplete = true;
      } else if (this.surveyData.index <= 0) {
        this.isNext = true;
        this.isPrev = false;
        this.isComplete = false;
      } else {
        this.isComplete = false;
        this.isNext = true;
        this.isPrev = true;
      }
    },
    "lessonActive" () {
      this.playedVideoUrl = this.$getFilePreviewUrl(this.$baseVideoUrl + this.lessonActive.fileList[0].uri)
    }
  },
  destroyed () {
    this.destroy()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../../assets/mixin.less';
video::-webkit-media-controls-enclosure {
  overflow: hidden !important;
}
video::-webkit-media-controls-panel {
  width: calc(100% + 10px) !important;
}

.footerOuter {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: absolute;
  height: 120px;
  bottom: -118px;
  width: 100%;
  background: #ffffff;
  .footer {
    height: 70px;
    bottom: 0;
    width: 90%;
    margin-top: 25px;
    margin: 25px auto auto auto;
    font-size: 0;
    .prev2 {
      display: inline-block;
      vertical-align: top;
      line-height: 80px;
      height: 80px;
      background: #9c2024;
      border-radius: 10px;
      width: 33.3333%;
      font-size: 30px;
      font-family: PingFang-SC-Regular;
      color: rgba(249, 249, 249, 1);
      text-align: center;
    }
    .prev2s {
      display: inline-block;
      vertical-align: top;
      line-height: 80px;
      height: 80px;
      background: #dddddd;
      border-radius: 10px;
      width: 33.3333%;
      font-size: 30px;
      font-family: PingFang-SC-Regular;
      color: rgba(249, 249, 249, 1);
      text-align: center;
    }
    .prev2X {
      display: inline-block;
      vertical-align: top;
      line-height: 80px;
      height: 80px;
      background: #9c2024;
      border-radius: 10px;
      width: 33.3333%;
      font-size: 30px;
      font-family: PingFang-SC-Regular;
      color: rgba(249, 249, 249, 1);
      text-align: center;
    }
    .gxs-progress2 {
      display: inline-block;
      vertical-align: top;
      line-height: 80px;
      height: 80px;
      // background: rgba(244, 243, 243, 1);
      border-radius: 10px;
      text-align: center;
      margin-left: 10px;
      margin-right: 10px;
      width: calc(33.3333% - 20px);
      font-size: 28px;
      font-family: PingFang-SC-Regular;
      color: rgba(3, 51, 51, 1);
    }
    .next2 {
      display: inline-block;
      vertical-align: top;
      line-height: 80px;
      height: 80px;
      background: #9c2024;
      border-radius: 10px;
      width: 33.3333%;
      font-size: 30px;
      font-family: PingFang-SC-Regular;
      color: rgba(249, 249, 249, 1);
      text-align: center;
    }
    .complete2 {
      display: inline-block;
      vertical-align: top;
      line-height: 80px;
      height: 80px;
      background: #9c2024;
      border-radius: 10px;
      width: 33.3333%;
      font-size: 30px;
      font-family: PingFang-SC-Regular;
      color: rgba(249, 249, 249, 1);
      text-align: center;
    }
  }
}
.content {
  height: 700px;
}
.title2 {
  padding: 0px 40px;
  .sst {
    .mTitle2 {
      float: left;
      padding-left: 14px;
      padding-right: 14px;
      margin-bottom: 25px;
      height: 32px;
      line-height: 32px;
      background: rgba(231, 247, 253, 1);
      border-radius: 2px;
      font-size: 22px;
      font-family: PingFang-SC-Regular;
      color: #9c2024;
      text-align: center;
    }
  }
  .bottom {
    font-size: 32px;
    font-family: PingFang-SC-Bold;
    color: rgba(51, 51, 51, 1);
    .mText {
    }
  }
  .bottom /deep/ p {
    font-size: 30px !important;
    font-family: PingFang-SC-Bold;
    color: rgba(51, 51, 51, 1);
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-align: left;
  }
  .bottom /deep/ p img {
    width: 100% !important;
  }
  .bottom /deep/ ol {
    width: 100% !important;
  }

  .bottom /deep/ img {
    width: 100%;
  }
}

.icon-wrong {
  display: inline-block;
  // margin-left: 30px;
  margin-top: 17px;
  width: 40px;
  height: 40px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image('../assets/img/course/cuo');
}
.icon-right {
  display: inline-block;
  // margin-left: 30px;
  // margin-top: 35px;
  margin-top: 17px;
  width: 40px;
  height: 40px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image('../assets/img/course/dui');
}

.haveDoitBox {
  // background: #20c855;
  // font-size: 28px;
  // color: #fff;
  // padding: 8px 15px;
  // text-align: center;
  // border-radius: 4px;
  position: absolute;
  top: 40%;
  z-index: 99;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  height: 80px;
  line-height: 80px;
  background: rgba(249, 249, 249, 1);
  opacity: 1;
  border-radius: 10px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.08);
  font-size: 26px;
  font-family: PingFang-SC-Regular;
  color: rgba(153, 153, 153, 1);
  .opt {
    float: left;
    margin-left: 32px;
    // margin-right: 10px;
    height: 80px;
    line-height: 80px;
    color: #999999;
  }
  .rst {
    float: left;
    margin-left: 6px;
    margin-right: 30px;
    height: 80px;
    line-height: 80px;
    color: #333333;
  }
}
.tab {
  border: none !important;
}

.tab {
  border: none !important;
  width: 100% !important;
  margin: 0 auto;
  .tab-item {
    width: 20% !important;
    height: 85px !important;
    position: relative;
    a {
      height: 80px;
      position: relative;
      font-size: 28px;
      font-family: PingFang-SC-Regular;
      color: rgba(1, 1, 1, 1);
      .activeTab {
        position: absolute;
        bottom: -1px; /* no */
        height: 4px;
        width: 36px;
        background: #9c2024;
        left: 50%;
        margin-left: -18px;
      }
    }
    .active {
      font-size: 28px;
      font-weight: bold;
      color: #000 !important;
    }
  }
}
.video-js {
  width: 100% !important;
  height: 360px !important;
}
.icon-browser {
  display: inline-block;
  vertical-align: top;
  margin-top: 6px;
  width: 20px;
  height: 20px;
  background-size: 100%;
  background-repeat: no-repeat;
  .bg-image('../assets/img/course/20180716/rs');
}
.tab {
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.31);
}
.tab > .tab-menu .tab-item {
  width: 25% !important;
  // margin-right: 30px;
}
.preview-pic {
  position: relative;
  padding-bottom: 55.87%;
  height: 0;
  overflow: hidden;
  width: 100%;
  // background: rgba(33, 36, 130, 1);
  // border-radius: 5px;
  img {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
  #video {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    // border-radius: 5px;
  }
}

.preview-title {
  margin: 28px 40px 0px 40px;
  font-size: 32px;
  font-family: PingFang-SC-Medium;
  color: rgba(51, 51, 51, 1);
  font-weight: Medium;
}
.views {
  margin: 20px 40px 25px 40px;
  .num {
    display: inline-block;
    vertical-align: top;
    font-size: 24px;
    font-family: PingFang-SC-Regular;
    color: rgba(153, 153, 153, 1);
  }
}
.divition {
  height: 20px;
  width: 100%;
  background: #f2f1f1;
}
.preview-content1 {
  font-size: 28px;
  overflow: hidden;
  min-height: 900px !important;
  .preview-content-item {
    margin-bottom: 30px;
  }
  .title {
    font-weight: bold;
    font-size: 32px;
  }
  .des {
    img {
      width: 100% !important;
    }
  }
}
.preview-content2 {
  margin: 0px 40px;
  font-size: 28px;
  overflow: hidden;
  min-height: 900px !important;
  .preview-content-item {
    margin-bottom: 30px;
  }

  .title {
    font-weight: bold;
    font-size: 32px;
  }

  .des {
    img {
      width: 100% !important;
    }
  }
}
.preview-teacher {
  margin-top: 20px;
  margin-bottom: 20px;

  .pic {
    width: 100px !important;
    height: 100px !important;
    border-radius: 100%;
    img {
      width: 100px !important;
      height: 100px !important;
      border-radius: 100%;
    }
  }
  .info {
    width: 65%;
    height: 100px;
    margin-left: 20px;
    .name {
      margin-top: 10px;
      font-size: 30px;
      font-family: PingFang-SC-Regular;
      color: rgba(51, 51, 51, 1);
    }
    .intro {
      font-size: 26px;
      font-family: PingFang-SC-Regular;
      color: rgba(153, 153, 153, 1);
    }
  }
}
.preview-content {
  margin: 45px 40px;
  font-size: 28px;
  overflow: hidden;
  min-height: 900px !important;
  .preview-content-item {
    margin-bottom: 30px;
  }

  .title {
    font-weight: bold;
    font-size: 32px;
  }

  .title {
    font-size: 28px;
  }
  /* .des2 {
    margin-left: 120px;
  } */
  .des2 /deep/ p img {
    width: 100% !important;
  }
}
.preview-content3 {
  padding: 45px 40px;
  font-size: 28px;
  overflow: hidden;
  min-height: 900px !important;
  background: #f2f1f1;
  .preview-content-item {
    margin-bottom: 30px;
  }

  .title {
    font-weight: bold;
    font-size: 32px;
  }

  .title {
    font-size: 28px;
  }
  .des2 {
    margin-left: 120px;
  }
  .des2 /deep/ p img {
    width: 100% !important;
  }
}
.preview-teacher {
  margin-top: 20px;
  margin-bottom: 20px;

  .pic {
    width: 32%;
    img {
      width: 100%;
    }
  }
  .info {
    width: 65%;
  }
}
</style>
