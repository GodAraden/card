<template>
  <div id="header-box" ref="headerContainer">
    <span class="logo"></span>
    <span class="text">
      国家信息安全重点实验室（威海）<br />
      哈尔滨工业大学（威海）网络与信息安全技术研究中心
    </span>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'

export default defineComponent({
  props: {
    rootFontSize: {
      type: String,
      default: '1em',
    },
  },
  setup(props) {
    const headerContainer = ref<HTMLElement | null>(null)
    onMounted(() => {
      if (!!headerContainer.value) {
        headerContainer.value.style.fontSize = props.rootFontSize
      }
    })
    return {
      headerContainer,
    }
  },
})
</script>

<style lang="less" scoped>
#header-box {
  display: flex;
  padding: 4em 0;
  vertical-align: baseline;
  .logo {
    flex: 1;
    padding: 0 3em;
    height: 8.2em;
    background: center / contain url('@/assets/cardLogo.png') no-repeat;
  }
  .text {
    flex: 4;
    font-family: '华文新魏';
    font-weight: 600;
    font-size: 3em;
    // chrome有一个最小字体的问题，影响了视觉效果
  }
}
</style>
