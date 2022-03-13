<template>
  <n-layout>
    <n-layout-header bordered>
      <div class="logo"></div>
      <div
        class="funcItem"
        :bordered="false"
        v-for="item in funcArr"
        :key="item.id"
        @click="triggerFunc(item.funcId)"
      >
        <span :class="'iconfont icon-' + item.funcIcon"></span>
        <span class="funcText">
          {{ item.hasDrop ? '' : item.funcName }}
          <n-dropdown
            v-if="item.hasDrop"
            trigger="hover"
            placement="bottom-start"
            :options="options"
            :show-arrow="true"
            @select="handleSelect"
          >
            {{ item.funcName + '▼' }}
          </n-dropdown>
        </span>
      </div>
      <div class="space"></div>
    </n-layout-header>

    <n-layout has-sider sider-placement="right">
      <n-layout-content :native-scrollbar="false" content-style="padding: 8px;">
        <div
          class="aside-item-container"
          v-for="(item, index) in studentArr"
          :key="item.id"
        >
          <span>{{ index + 1 + '.' }}</span>
          <my-card
            v-if="refresh"
            :ref="cards"
            :class="
              (isPrint ? 'my-card-print ' : 'my-card ') +
              (item.id === selectedId ? ' current-card ' : '')
            "
            :showDetail="false"
            :rootFontSize="'1vh'"
            :name="item.sName"
            :department="item.sDepartment"
            :background="item.sBackground"
            :number="item.sNumber"
            @click="chooseCard(item.id)"
          ></my-card>
        </div>
        <div class="new-card aside-item-container">
          <span></span>
          <div class="my-card new-sign" @click="newStudent">+</div>
        </div>
      </n-layout-content>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="0"
        :width="'78vw'"
        bordered
        :native-scrollbar="true"
        content-style="padding: 24px;"
      >
        <div class="card-box">
          <my-card
            v-if="refresh"
            :showDetail="studentRef.id === -1 ? false : true"
            :name="studentRef.sName"
            :department="studentRef.sDepartment"
            :background="studentRef.sBackground"
            :number="studentRef.sNumber"
            :rootFontSize="'1vh'"
            @changeProp="changeProp"
          ></my-card>
        </div>
      </n-layout-sider>
    </n-layout>
    <my-model
      v-if="refresh"
      :isShow="isShow"
      :content="studentArr"
      :showDataType="'data'"
      @eModelClose="modelClose"
    ></my-model>
    <my-model
      v-if="refresh"
      :isShow="excelShow"
      :content="tempArr"
      :showDataType="'excel'"
      @eModelClose="modelClose"
      >管理由Excel导入的工位牌信息</my-model
    >
  </n-layout>
</template>

<script lang="ts">
import { FuncBar, Student } from '@/use/classUse'
import {
  saveToLocal,
  chooseCardDetail,
  changePropDetail,
  getNewStuId,
  setNewStuId,
} from '@/use/funcUse'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutSider,
  NCard,
  NDropdown,
} from 'naive-ui'
import { nextTick, reactive, toRefs, defineComponent } from 'vue'
import Card from '@/views/Card.vue'
import Model from '@/views/Model.vue'
import { read } from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const funcArr: Array<FuncBar> = [
  new FuncBar(0, '批量编辑 / 信息管理', 'piliangbianji', false),
  new FuncBar(1, '由文件导入', 'jurassic_import-form ', true),
  new FuncBar(2, '导出为PDF', 'daochuwenjian', false),
  new FuncBar(3, '打印', 'print', false),
]
function uploadFile() {
  const inputObj = document.createElement('input')
  inputObj.setAttribute('id', 'file')
  inputObj.setAttribute('type', 'file')
  inputObj.setAttribute('name', 'file')
  inputObj.setAttribute('style', 'display:none;')
  document.body.appendChild(inputObj)
  inputObj.value
  inputObj.click()
  return inputObj
}
function downloadExample() {
  const aObj = document.createElement('a')
  aObj.download = 'example.xlsx'
  // 没搞过服务器，就在网上找了一个上传下载平台，链接七天有效
  aObj.setAttribute('href', 'https://a.y8j5.top/s/DOoQ4sG')
  document.body.appendChild(aObj)
  aObj.click()
}
export function handleSelect(key: string | number) {
  downloadExample()
}

export default defineComponent({
  setup() {
    const studentArr = !!localStorage.getItem('studentArr')
      ? JSON.parse(localStorage.getItem('studentArr') as string)
      : []
    const arrFromExcel: Array<Student> = []
    const events = reactive({
      selectedId: 0,
      studentRef: new Student(-1, '↖点这里新建工位牌', '某部门', '20S202020'),
      refresh: true,
      isShow: 'none',
      excelShow: 'none',
      tempArr: arrFromExcel,
      arr: [],
      cards: (el: HTMLElement) => {
        if (!(events.arr as Array<HTMLElement>).some((value) => value === el)) {
          ;(events.arr as Array<HTMLElement>).push(el)
        }
      },
      isPrint: false,
    })
    function changeProp(prop: string, propName: string) {
      if (changePropDetail(prop, propName, events.selectedId, studentArr)) {
        chooseCard(events.selectedId)
        saveToLocal(studentArr)
      }
    }
    function chooseCard(id: number) {
      chooseCardDetail(id, events, studentArr)
    }
    function modelClose(type: string) {
      switch (type) {
        case 'data':
          events.isShow = 'none'
          break
        case 'excel':
          events.excelShow = 'none'
          for (const k of events.tempArr) studentArr.push(k)
          events.tempArr = []
          break
        case 'close':
          if (!confirm('确认关闭窗口吗？')) return
          events.tempArr = []
          events.isShow = 'none'
          events.excelShow = 'none'
          break
      }
      chooseCard(events.selectedId)
      saveToLocal(studentArr)
    }
    function triggerFunc(id: number) {
      switch (id) {
        case 0:
          events.isShow = 'block'
          break
        case 1:
          uploadFile().addEventListener('change', (changeE: any) => {
            let newStuId = getNewStuId()
            for (let entry of changeE.target.files) {
              readWorkbookFromLocalFile(entry, (e: any) => {
                for (const k in e.Sheets) {
                  let i = 0
                  for (const _ in e.Sheets[k]) i++
                  const length = Math.floor(i / 3)
                  for (let j = 1; j <= length; j++) {
                    events.tempArr.push(
                      new Student(
                        newStuId++,
                        e.Sheets[k]['A' + j].v,
                        e.Sheets[k]['B' + j].v,
                        e.Sheets[k]['C' + j].v.toString()
                      )
                    )
                  }
                }
                setNewStuId(newStuId)
              })
            }
            events.excelShow = 'block'
          })
          break
        case 2:
        case 3:
          if (studentArr.length === 0) {
            alert('请先新建一个工位牌，，，')
            return
          }
          events.isPrint = true
          nextTick(() => {
            let pdf = new jsPDF('l', 'cm')
            let promiseArray: Array<Promise<void>> = []
            for (let i = 0; i < events.arr.length; i++) {
              const t = createPromiseArray(i, pdf, events.arr.length)
              if (t !== null) promiseArray.push(t)
            }
            Promise.all(promiseArray)
              .then(() => {
                if (id === 2) pdf.save('card.pdf')
                return pdf
              })
              .then((res: jsPDF) => {
                if (id === 3) {
                  res.autoPrint()
                  res.output('dataurlnewwindow')
                }
              })
            events.isPrint = false
          })
      }
    }

    function createPromiseArray(i: number, pdf: jsPDF, l: number) {
      return html2canvas(events.arr[i]['container'] as HTMLElement).then(
        (canvas) => {
          let imgData = canvas.toDataURL('image/jpeg', 1.0)
          pdf.addImage(
            imgData,
            'JPEG',
            (i % 4) % 2 === 0 ? 0.9 : 15.3,
            i % 4 <= 1 ? 1 : 11,
            13.5,
            9
          )
          if (i % 4 === 3 && i + 1 !== l) pdf.addPage()
        }
      )
    }
    function newStudent() {
      let newStuId = getNewStuId()
      studentArr.push(new Student(newStuId++))
      chooseCard(newStuId - 1)
      saveToLocal(studentArr)
      setNewStuId(newStuId)
    }
    function readWorkbookFromLocalFile(file: File, callback: Function) {
      const reader = new FileReader()
      reader.onload = function (e: any) {
        const data = e.target.result
        const workbook = read(data, { type: 'binary' })
        if (callback) callback(workbook)
      }
      reader.readAsBinaryString(file)
    }
    if (studentArr.length !== 0) {
      events.studentRef = studentArr[0]
      events.selectedId = studentArr[0].id
    }
    return {
      events,
      ...toRefs(events),
      funcArr: funcArr,
      options: [
        {
          label: '下载文件模板',
          key: 'PDF下载',
        },
      ],
      handleSelect,
      triggerFunc,
      studentArr,
      changeProp,
      chooseCard,
      modelClose,
      newStudent,
    }
  },
  components: {
    'n-layout': NLayout,
    'n-layout-header': NLayoutHeader,
    'n-layout-content': NLayoutContent,
    'n-layout-sider': NLayoutSider,
    'n-card': NCard,
    'n-dropdown': NDropdown,
    'my-card': Card,
    'my-model': Model,
  },
})
</script>

<style lang="less" scoped>
@header-height: 16vh;
@other-height: 100vh - @header-height;
@view-height: @other-height - 8vh;
/deep/ * {
  user-select: none;
}
.n-layout-header {
  display: flex;
  height: @header-height;
  .logo {
    flex: 2;
    background: center / contain url('@/assets/logo.png') no-repeat;
    margin: 2vw;
    min-width: 24vw;
  }
  .funcItem {
    display: flex;
    flex: 2;
    max-height: @header-height;
    max-width: @header-height * 2;
    border: 1px solid transparent;
    text-align: center;
    flex-direction: column;
    cursor: pointer;
    box-sizing: border-box;
    .iconfont {
      flex: 3;
      font-size: @header-height * 0.4;
      line-height: 12vh;
    }
    .funcText {
      flex: 1;
      line-height: 2vh;
    }
  }
  .funcItem:hover {
    background-color: #eee;
    border: 1px solid #ddd;
  }
  .space {
    flex: 4;
  }
}

.n-layout-sider,
.n-layout-content {
  height: @other-height;
  .aside-item-container {
    position: relative;
    display: flex;
    height: 22vh;
    margin: 2vh 0;
    span {
      padding: 2px;
      flex: 1;
      background-color: #fff;
    }
    .my-card {
      position: absolute;
      flex: 19;
      margin: 0 1.4vh 0 0;
      width: @view-height * 1.5;
      height: @view-height;
      top: 50%;
      left: 50%;
      overflow: hidden;
      // 展示状态
      transform: translate(-50%, -50%) scale(0.28);
    }
    .my-card-print {
      position: absolute;
      flex: 19;
      margin: 0 1.4vh 0 0;
      width: @view-height * 1.5;
      height: @view-height;
      top: 50%;
      left: 50%;
      overflow: hidden;
      // 打印状态
      transform: none !important;
    }
    .my-card:hover {
      box-shadow: 0 0 20px 1px #ddd;
    }
    .current-card {
      outline: rgba(33, 92, 193, 0.8) solid 6px;
    }
    .current-card:hover {
      box-shadow: none;
    }
  }
  .new-card .new-sign {
    border: 1px solid #ddd;
    text-align: center;
    line-height: 66vh;
    font-size: 56vh;
    color: #888;
    font-weight: 500;
    background-color: #fafafa;
  }
  .new-card .new-sign:hover {
    color: #999;
    cursor: pointer;
    background-color: #fbfbfb;
  }
}
.n-layout-sider {
  .card-box {
    margin: auto;
    width: @view-height * 1.5;
    height: @view-height;
    box-shadow: 0 0 20px 2px #eee;
    background-color: rgb(252, 250, 254);
    overflow: hidden;
  }
}

/deep/ .card-box *,
/deep/.aside-item-container * {
  background-color: rgb(252, 250, 254);
  white-space: nowrap;
}
</style>
