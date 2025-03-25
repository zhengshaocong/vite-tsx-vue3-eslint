<!-- 轨道 -->
<template>
  <div ref="scrollRef" class="scroll">
    <div
      class="drag"
      @mousedown="startDrag"
      :style="{
        transform: `translate(${x}px)`
      }"
    >
      <Icon-location class="icon"></Icon-location>
      <div class="screen" :style="{ width: screenWidth + 'px' }"></div>
    </div>
    <div
      class="stage"
      v-for="item in props.track"
      :key="item.width"
      :style="{ width: item.width + '%' }"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, defineEmits } from 'vue'
  import IconLocation from './Icon-location.vue'
  import type { TrackItem, IocationData } from './PaintedScroll'
  const props = withDefaults(
    defineProps<{
      track: TrackItem[]
      location: IocationData
    }>(),
    {
      track: () => []
    }
  )
  const scrollRef = ref()
  const isDragging = ref(false)
  const x = ref(0)
  let startX = 0
  let endX = 0
  const screenWidth = ref(0)
  const emit = defineEmits(['change'])

  // 记录初始位置和鼠标偏移量
  let srcollLeft = 0

  watch(
    () => props.location.width,
    () => {
      const ratio = props.location.width / props.location.scrollWidth
      srcollLeft = scrollRef.value.getBoundingClientRect().left
      const width = scrollRef.value.clientWidth
      const dragWidth = width * ratio
      startX = dragWidth / 2
      x.value = dragWidth / 2
      endX = width - dragWidth / 2
      screenWidth.value = scrollRef.value.clientWidth * ratio
    }
  )

  const onDrag = (event: MouseEvent) => {
    if (!isDragging.value) return
    // 计算新位置（考虑页面滚动）
    const newX = Math.max(startX, Math.min(endX, event.clientX - window.scrollX - srcollLeft))
    x.value = newX
    emit('change', (newX - startX) / (endX - startX))
  }

  const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  const startDrag = () => {
    isDragging.value = true

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  onMounted(() => {})
</script>

<style lang="scss" scoped>
  $color: #999;
  @mixin coordinate {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0px;
      width: 1px;
      height: 5px;
      background-color: $color;
    }
  }
  .scroll {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    border-top: 1px solid $color;
    margin-bottom: 10px;
    margin-top: 30px;
    display: flex;
    position: relative;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    @include coordinate;
    &::after {
      left: 0;
    }
    .drag {
      position: relative;
      .icon {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        left: -15px;
        top: -30px;
        cursor: pointer;
      }
      .screen {
        background-color: #fef4c7;
        height: 5px;
        position: absolute;
        top: 0;
        transform: translate(-50%);
      }
    }
    .stage {
      height: 100%;
      @include coordinate;
      &::after {
        right: 0;
      }
    }
  }
</style>
