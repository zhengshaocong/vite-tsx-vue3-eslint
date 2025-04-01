<!-- 轨道 -->
<template>
  <div ref="scrollRef" class="scroll" :class="{ 'text-top': handleTimeText }">
    <div
      class="drag"
      :class="{ animation: isAnimation }"
      @mousedown="startDrag"
      :style="{
        transform: `translate(${x}px)`
      }"
    >
      <Icon-location class="icon"></Icon-location>
      <div class="now-time">{{ currentTime }}</div>
    </div>
    <div class="stage" v-for="(item, key) in stageViewData" :key="key">
      <template v-for="(one, o) in item" :key="o">
        <div
          class="scale"
          v-for="(i, i_key) in one"
          :key="i_key"
          :style="{ width: stageItemWidth + 'px' }"
        ></div>
      </template>
      <span class="time-text">{{ key }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, defineEmits } from 'vue'
  import IconLocation from './Icon-location.vue'
  import type { TrackItem, stageViewDataType } from './GradualChangeScrollType.ts'
  import { inject } from 'vue'
  const props = withDefaults(
    defineProps<{
      track: TrackItem[]
    }>(),
    {
      track: () => []
    }
  )
  const scrollRef = ref()
  const isDragging = ref(false)
  const x = ref(0)
  const startX = 0
  let endX = 0
  let direction = 1 //拖动方向 1正方向 -1 反方向

  const isAnimation = ref(false)

  const emit = defineEmits(['change', 'stop'])

  const handleTimeText = inject('handleTimeText')

  // 记录初始位置和鼠标偏移量
  let srcollLeft = 0

  //单位宽度
  const stageItemWidth = ref(0)
  //用于显示的数据
  const stageViewData = ref<stageViewDataType>({})
  const currentTime = ref('')

  watch(
    () => props.track.length,
    () => {
      if (!scrollRef.value) return

      srcollLeft = scrollRef.value.getBoundingClientRect().left
      endX = scrollRef.value.clientWidth
      stageViewData.value = disposalData(props.track)
      stageItemWidth.value = scrollRef.value.clientWidth / (props.track.length - 1) //这里的长度之所要减1 是因为第一张图所在的位置是0
      currentTime.value = props.track[0]?.date
    }
  )

  const onDrag = (event: MouseEvent) => {
    if (!isDragging.value) return
    // 计算新位置（考虑页面滚动）
    const newX = Math.max(startX, Math.min(endX, event.clientX - window.scrollX - srcollLeft))
    direction = newX >= x.value ? 1 : -1
    x.value = newX

    const quotient =
      direction > 0
        ? Math.floor(x.value / stageItemWidth.value)
        : Math.ceil(x.value / stageItemWidth.value)
    const residual = Number((x.value % stageItemWidth.value) / stageItemWidth.value)
    currentTime.value = props.track[quotient]?.date
    emit('change', { index: quotient, percent: residual * direction })
  }

  const stopDrag = () => {
    isAnimation.value = true
    const residual = Number((x.value % stageItemWidth.value) / stageItemWidth.value)
    const stopIndex = Math.round(x.value / stageItemWidth.value)
    x.value = stopIndex * stageItemWidth.value
    emit('stop', { index: stopIndex, direction: residual >= 0.5 ? 1 : -1 })
    setTimeout(() => {
      isAnimation.value = false
      currentTime.value = props.track[stopIndex]?.date
    }, 300)

    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  const startDrag = () => {
    isDragging.value = true
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  //整理数据   按照月分组   按照天分组
  function disposalData(data: TrackItem[]) {
    return data.reduce((acc, item) => {
      const [year, month, day] = item.date.split('-')
      const monthKey = `${year}-${month}`
      acc[monthKey] ??= {}
      acc[monthKey][day] ??= []
      acc[monthKey][day].push(item.url)
      return acc
    }, {} as stageViewDataType)
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
      height: 6px;
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
    height: 18px;
    @include coordinate;
    &::after {
      height: 10px;
      left: -0.5px;
    }
    &.text-top {
      margin-top: 65px;
    }
    .drag {
      position: relative;
      &.animation {
        transition: transform 0.3s;
        will-change: transform;
      }
      .icon {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        left: -15px;
        top: -30px;
        cursor: pointer;
      }
      .now-time {
        position: absolute;
        left: 50%;
        top: -48px;
        white-space: nowrap;
        font-size: 12px;
        transform: translate(-50%, 0);
        color: #999;
      }
    }
    .stage {
      height: 100%;
      display: flex;
      @include coordinate;
      &:nth-child(2) .scale:first-child {
        width: 0 !important;
        &::after {
          display: none;
        }
      }
      &::after {
        right: -0.5px;
        height: 10px;
      }
      .scale {
        height: 100%;
        @include coordinate;
        &:after {
          height: 3px;
          right: -0.5px;
        }
      }
      .time-text {
        position: absolute;
        display: block;
        left: 50%;
        top: 0;
        line-height: 28px;
        transform: translate(-50%, 0);
        font-size: 12px;
        white-space: nowrap;
        color: #666;
      }
    }
  }
</style>
