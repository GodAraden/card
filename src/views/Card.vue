<template>
  <div class="container" ref="container">
    <n-layout-header>
      <my-card-header :rootFontSize="rootFontSize"></my-card-header>
    </n-layout-header>
    <div v-if="showDetail" class="props-with-func">
      <div class="name" @click="$emit('changeProp', sName, '名字')">
        {{ sName }}
      </div>
      <div class="other">
        <span
          class="department"
          @click="$emit('changeProp', sDepartment, '部门')"
          >{{ sDepartment }}</span
        >
        <span class="background">{{ sBackground }}</span>
        <span class="number" @click="$emit('changeProp', sNumber, '学号')"
          >#{{ sNumber }}</span
        >
      </div>
    </div>
    <div v-else class="props-without-func">
      <div class="name">{{ sName }}</div>
      <div class="other">
        <span class="department">{{ sDepartment }}</span>
        <span class="background">{{ sBackground }}</span>
        <span class="number">#{{ sNumber }}</span>
      </div>
    </div>
    <n-layout-footer>
      <template v-if="sBackground === '本科'">
        <div
          v-for="(item, index) in backgroundArray[0]"
          :class="index + 1 < sYear ? 'finished-year' : ''"
          :key="item.id"
        >
          {{ item.key }}
        </div>
      </template>
      <template v-else-if="sBackground === '硕士'">
        <div
          v-for="(item, index) in backgroundArray[1]"
          :class="index + 1 < sYear ? 'finished-year' : ''"
          :key="item.id"
        >
          {{ item.key }}
        </div>
      </template>
      <template v-else-if="sBackground === '博士'">
        <div
          v-for="(item, index) in backgroundArray[2]"
          :class="index + 1 < sYear ? 'finished-year' : ''"
          :key="item.id"
        >
          {{ item.key }}
        </div>
      </template>
    </n-layout-footer>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, toRefs, reactive, defineComponent } from 'vue'
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter } from 'naive-ui'
import { numToYear } from '@/use/funcUse'
import CardHeader from '@/components/CardHeader.vue'
export default defineComponent({
  props: {
    name: {
      type: String,
      require: true,
    },
    department: {
      type: String,
      require: true,
    },
    background: {
      type: String,
      require: true,
    },
    number: {
      type: String,
      require: true,
    },
    showDetail: {
      type: Boolean,
      default: false,
    },
    rootFontSize: {
      type: String,
      default: '1vh',
    },
  },
  setup(props) {
    const events: { [propName: string]: any } = reactive({
      sName: props.name,
      sDepartment: props.department,
      sBackground: props.background,
      sNumber: props.number,
      sYear: numToYear(''),
    })
    events.sYear = numToYear(events.sNumber)

    const backgroundArray = [
      [
        { id: 1, key: '大一' },
        { id: 2, key: '大二' },
        { id: 3, key: '大三' },
        { id: 4, key: '大四' },
      ],
      [
        { id: 1, key: '研一' },
        { id: 2, key: '研二' },
        { id: 3, key: '研三' },
      ],
      [
        { id: 1, key: '博一' },
        { id: 2, key: '博二' },
        { id: 3, key: '博三' },
        { id: 4, key: '博四' },
        { id: 5, key: '博五' },
      ],
    ]
    const container = ref<HTMLElement | null>(null)
    const rootFontSize = props.rootFontSize
    onMounted(() => {
      if (!!container.value) {
        container.value.style.fontSize = rootFontSize
      }
    })

    return { ...toRefs(events), backgroundArray, container, rootFontSize }
  },
  components: {
    'n-layout': NLayout,
    'n-layout-header': NLayoutHeader,
    'n-layout-content': NLayoutContent,
    'n-layout-footer': NLayoutFooter,
    'my-card-header': CardHeader,
  },
})
</script>

<style lang="less" scoped>
@keyframes ants {
  to {
    background-position: 100%;
  }
}
.hover-box {
  border: 1px solid transparent;
  background: linear-gradient(#fcfafe, #fcfafe) padding-box,
    repeating-linear-gradient(-45deg, black 0 5%, #fcfafe 0 10%) 0 / 100px 40px;
  animation: ants 8s linear infinite;
  border-radius: 2px;
}

.container {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  color: #000;
  .n-layout-header {
    padding: 2em 0;
    font-size: 1em;
  }
  .props-with-func {
    .name {
      display: block;
      position: absolute;
      left: 50%;
      top: 48%;
      padding: 0 1em;
      transform: translate(-50%, -50%);
      font-size: 11em;
      font-weight: 600;
      cursor: text;
    }
    .name:hover {
      .hover-box();
    }
    .other {
      position: absolute;
      left: 50%;
      top: 68%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      font-size: 4em;
      cursor: text;
      span {
        padding: 0 1em;
        border: 1px solid transparent;
        border-left: 2px solid #000;
        box-sizing: border-box;
      }
      .department {
        border-left: 1px solid transparent;
      }
      .department:hover {
        .hover-box();
        animation: ants 1.2s linear infinite;
      }
      .background {
        cursor: default;
      }
      .number:hover {
        .hover-box();
        animation: ants 2.5s linear infinite;
        border-left: 2px solid #000;
      }
    }
  }
  .props-without-func {
    .name {
      display: block;
      position: absolute;
      left: 50%;
      top: 48%;
      padding: 0 1em;
      transform: translate(-50%, -50%);
      font-size: 11em;
      font-weight: 600;
    }
    .other {
      position: absolute;
      left: 50%;
      top: 68%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      font-size: 4em;
      span {
        padding: 0 1em;
        border: 1px solid transparent;
        border-left: 0.2em solid #000;
        box-sizing: border-box;
      }
      .department {
        border-left: 1px solid transparent;
      }
      .background {
        cursor: default;
      }
    }
  }
  .n-layout-footer {
    display: flex;
    position: absolute;
    width: 100%;
    bottom: 0;
    div {
      flex: 1;
      border: 1px solid #fff;
      border-top: none;
      border-bottom: none;
      padding: 0.4em;
      text-align: center;
      color: #fff;
      font-weight: 600;
      background-color: #f3eff6;
      font-size: 3.8em;
    }
    .finished-year {
      background: #f3eff6
        repeating-linear-gradient(
          120deg,
          transparent 0 1.5vh,
          #e2bfbf 1.5vh 1.6vh
        );
    }
  }
}
</style>
