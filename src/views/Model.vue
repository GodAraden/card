<template>
  <div class="model" v-bind:style="{ display: isShow }">
    <div
      class="model-bg"
      v-bind:style="{ display: isShow }"
      @click="closeModel(showDataType)"
    ></div>
    <div class="model-show" v-bind:style="{ display: isShow }">
      <div class="model-header">
        <h3>
          <span class="header-item">
            <slot>管理所有工位牌信息</slot>
          </span>
          <span class="header-item header-button" @click="newStudent"
            >新建工位牌</span
          >
          <span class="header-item close-btn" @click="closeModel('close')"
            >×</span
          >
        </h3>
      </div>
      <n-layout-content
        :native-scrollbar="false"
        class="model-content"
        bordered
      >
        <table cellspacing="0">
          <thead>
            <tr>
              <th>序号</th>
              <th>姓名</th>
              <th>部门</th>
              <th>学历</th>
              <th>学号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              :class="error.some((val) => val === item.id) ? 'error-tr' : ''"
              v-for="(item, index) in data"
              :key="item.id"
            >
              <td>{{ index }}</td>
              <td
                class="editable"
                @click="changeProp(item.sName, '名字', item.id)"
              >
                {{ item.sName }}
              </td>
              <td
                class="editable"
                @click="changeProp(item.sDepartment, '部门', item.id)"
              >
                {{ item.sDepartment }}
              </td>
              <td class="forbidden">{{ item.sBackground }}</td>
              <td
                class="editable"
                @click="changeProp(item.sNumber, '学号', item.id)"
              >
                {{ item.sNumber }}
              </td>
              <td class="operable" @click="deleteCard(item.id, item.sName)">
                删除
              </td>
            </tr>
          </tbody>
        </table>
      </n-layout-content>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent } from 'vue'
import { NLayoutContent } from 'naive-ui'
import { Student } from '@/use/classUse'
import {
  checkNumber,
  saveToLocal,
  changePropDetail,
  getNewStuId,
  setNewStuId,
} from '@/use/funcUse'

export default defineComponent({
  props: {
    isShow: {
      type: String,
      required: true,
    },
    content: {
      type: Array,
      required: true,
    },
    showDataType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const events: {
      data: Array<Student>
      [propName: string]: any
    } = reactive({
      data: props.content as Array<Student>,
      error: [],
    })
    function newStudent() {
      if (confirm('新建一张工位牌？')) {
        let newStuId = getNewStuId()
        events.data.push(new Student(newStuId++))
        saveToLocal(events.data)
        setNewStuId(newStuId)
      }
    }
    function changeProp(prop: string, propName: string, id: number) {
      if (
        events.data.some((value) => {
          if (value.id === id) {
            changePropDetail(prop, propName, id, events.data)
            return true
          }
        })
      )
        saveToLocal(events.data)
    }
    function deleteCard(id: number, name: string) {
      if (!confirm('确认要删除' + name + '的工位牌吗？')) return
      if (
        events.data.some((value, index, array) => {
          if (value.id === id) {
            array.splice(index, 1)
            return true
          }
        })
      ) {
        localStorage.setItem('studentArr', JSON.stringify(events.data))
      }
    }
    return {
      events,
      ...toRefs(events),
      newStudent,
      changeProp,
      deleteCard,
    }
  },
  components: {
    'n-layout-content': NLayoutContent,
  },
  methods: {
    closeModel(param: string) {
      this.checkArr()
      if (this.events.error.length !== 0) {
        alert('还有不正确的数据存在。')
        return
      }
      this.$emit('eModelClose', param)
    },
    checkArr() {
      this.events.error = []
      for (const k of this.events.data) {
        if (
          k.sName.split('').every((value) => value === ' ') ||
          k.sDepartment.split('').every((value) => value === ' ') ||
          k.sNumber.split('').every((value) => value === ' ') ||
          checkNumber(k.sNumber) !== ''
        )
          this.events.error.push(k.id)
      }
    },
  },
})
</script>

<style lang="less" scoped>
.model {
  display: none;
  .model-bg {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 1001;
    -moz-opacity: 0.3;
    opacity: 0.3;
    filter: alpha(opacity=30);
  }

  .model-show {
    display: none;
    position: absolute;
    top: 15vh;
    left: 20vw;
    width: 60vw;
    height: auto;
    padding: 8px;
    background-color: white;
    box-shadow: 0 0 40px 8px #888;
    z-index: 1002;
    overflow: auto;
    .model-header {
      margin: 10px;
      h3 {
        display: flex;
        .header-item:first-of-type {
          flex: 10;
        }
        .header-item:last-child {
          flex: 1;
          text-align: center;
          margin: 0 0 0 16px;
          border: 1px solid #ccc;
          border-radius: 16px / 50%;
        }
        .header-button {
          flex: 5;
          padding: 0 8px;
          border: 1px solid #ccc;
          text-align: center;
          border-radius: 16px / 50%;
          box-sizing: border-box;
        }
        .header-button:hover {
          border: 1px solid #2c76f5;
          color: #215cc1;
          transition: all 0.2s linear;
          cursor: pointer;
        }
        .close-btn:hover {
          border: 1px solid #ff2525;
          color: #ff2525;
          transition: all 0.15s linear;
          cursor: pointer;
        }
      }
    }
    .model-content {
      border-radius: 2px;
      height: 60vh;
      table {
        width: 100%;
        text-align: center;
        line-height: 24px;
        border: none;
        thead {
          tr {
            background-color: #efefef;
            th {
              height: 40px;
              line-height: 30px;
              font-size: 20px;
            }
          }
        }
        tbody {
          tr {
            height: 40px;
            td {
              margin: 5px 0;
              height: 30px;
              line-height: 30px;
              font-size: 18px;
            }
            .editable:hover {
              cursor: text;
              color: #215cc1;
            }
            .forbidden:hover {
              cursor: not-allowed;
            }
            .operable:hover {
              cursor: pointer;
              color: #ff2525;
            }
          }
          tr:nth-of-type(even) {
            background-color: #fafafa;
          }
          tr:hover {
            background-color: #e6e6e6;
          }
          .error-tr {
            color: #fc4e4e;
            td:hover {
              color: #f00;
            }
          }
        }
      }
    }
  }
}
</style>
