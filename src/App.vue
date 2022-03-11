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
            :class="
              'my-card ' + (item.id === appCurrentId ? 'current-card' : '')
            "
            :showDetail="false"
            :rootFontSize="'0.28vh'"
            :name="item.sName"
            :department="item.sDepartment"
            :background="item.sBackground"
            :number="item.sNumber"
            @click="chooseCard(item.id)"
          ></my-card>
        </div>
        <div class="new-card aside-item-container">
          <span></span>
          <div class="my-card new-sign">+</div>
        </div>
      </n-layout-content>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="0"
        :width="'78vw'"
        bordered
        :native-scrollbar="true"
        show-trigger="bar"
        content-style="padding: 24px;"
      >
        <div class="card-box">
          <my-card
            v-if="refresh"
            :showDetail="true"
            :name="studentRef.sName"
            :department="studentRef.sDepartment"
            :background="studentRef.sBackground"
            :number="studentRef.sNumber"
            @changeProp="changeProp"
          ></my-card>
        </div>
      </n-layout-sider>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { FuncBar, Student } from '@/use/classUse'
import { triggerFunc, handleSelect, checkNumber } from '@/use/funcUse'
import { currentId } from '@/use/dataUse'
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

const funcArr: Array<FuncBar> = [
  new FuncBar('批量编辑', 'piliangbianji', false),
  new FuncBar('由文件导入', 'jurassic_import-form ', true),
  new FuncBar('导出为PDF', 'daochuwenjian', false),
  new FuncBar('打印', 'print', false),
]

export default defineComponent({
  setup() {
    const studentArr: Array<Student> = [
      new Student(0, '张三丰', '事业部', '17B111201'),
      new Student(1, 'James Brown', '运营部', '2201110201'),
      new Student(2, '白', '吉祥物', '19S686666'),
      new Student(4, '请输入姓名', '请输入部门', '请输入学号'),
    ]
    const events = reactive({
      appCurrentId: currentId,
      studentRef: new Student(-1, '', '', ''),
      refresh: true,
    })
    function changeProp(prop: string, propName: string) {
      let newProp: string | null = prompt(
        '原' + propName + '为：' + prop + '，请输入修改后的' + propName
      )
      if (newProp && !newProp.split('').every((value) => value === ' ')) {
        studentArr.some((value) => {
          if (value.id === events.appCurrentId) {
            switch (propName) {
              case '名字':
                value.sName = newProp as string
                break
              case '部门':
                value.sDepartment = newProp as string
                break
              case '学号':
                while (!!checkNumber(newProp as string)) {
                  alert(checkNumber(newProp as string))
                  newProp = prompt(
                    '原' +
                      propName +
                      '为：' +
                      prop +
                      '，请输入修改后的' +
                      propName
                  )
                }
                value.sNumber = newProp as string
                break
            }
            chooseCard(events.appCurrentId)
            return true
          }
        })
      }
    }
    function chooseCard(id: number) {
      events.appCurrentId = id
      events.studentRef = studentArr.filter((value) => {
        if (value.id === events.appCurrentId) return true
      })[0]
      events.refresh = false
      nextTick(() => {
        events.refresh = true
      })
    }
    events.studentRef = studentArr.filter((value) => {
      if (value.id === events.appCurrentId) return true
    })[0]
    return {
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
    display: flex;
    height: 22vh;
    margin: 2vh 0;
    span {
      padding: 2px;
      flex: 1;
    }
    .my-card {
      flex: 19;
      margin: 0 1.4vh;
      overflow: hidden;
    }
    .my-card:hover {
      box-shadow: 0 0 20px 1px #ddd;
    }
    .current-card {
      outline: rgba(33, 92, 193, 0.8) solid 2px;
    }
    .current-card:hover {
      box-shadow: none;
    }
  }
  .new-card .new-sign {
    border: 1px solid #ddd;
    text-align: center;
    line-height: 20vh;
    font-size: 12vh;
    color: #888;
    font-weight: 900;
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
