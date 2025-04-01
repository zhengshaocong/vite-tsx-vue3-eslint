<!-- 刻度轨道实现 根据刻度实现对应图片 隐显切换 -->
<template>
  <div class="max-w">
    <div class="painted-scroll">
      <GradualScrollTrack
        :track="scrollData"
        @change="dragScroll"
        @stop="stopScroll"
      ></GradualScrollTrack>
      <div ref="imgSheelRef" class="img">
        <div v-if="imgLoading" ref="imgScrollRef" class="img-sheel">
          <img
            class="pre-img"
            :class="{ animation: imgAnimation }"
            :src="preImageSrc"
            :style="{ opacity: preImgOpacity }"
          />
          <img :src="imageList[activeImage].url" @click="imageClick(imageList[activeImage].url)" />
          <img
            class="next-img"
            :class="{ animation: imgAnimation }"
            :src="nextImageSrc"
            :style="{ opacity: nextImgOpacity }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import GradualScrollTrack from './gradual-scroll-track.vue'
  import type { ImageType, TrackItem } from './GradualChangeScrollType'
  import { provide } from 'vue'

  const imageList = ref<ImageType[]>([])
  const imgSheelRef = ref()
  const imgScrollRef = ref()
  const imgLoading = ref(false)
  const emit = defineEmits(['imageClick'])

  const activeImage = ref(0) //当前显示的图片索引
  const isDerection = ref<1 | -1>(1) // 下一张图片的方向
  const nextImgOpacity = ref(0) // 下一张图片的透明度
  const preImgOpacity = ref(0) // 上一张图片的透明度
  const imgAnimation = ref(false) // 下一张图片透明度变化是否需要动画

  // imgList/图片列表 handleTimeText/是否显示时间轴拖拽点的时间
  const props = withDefaults(defineProps<{ imgList: ImageType[]; handleTimeText?: boolean }>(), {
    imgList: () => [],
    handleTimeText: true
  })

  const scrollData = ref<TrackItem[]>([])

  provide('handleTimeText', props.handleTimeText)

  watch(
    () => props.imgList,
    () => {
      imageList.value = sortData(props.imgList)
    },
    {
      immediate: true
    }
  )
  // 根据标尺拖动方向确定下一张图片
  const nextImageSrc = computed(() => {
    const nextIndex = Math.min(activeImage.value + 1, imageList.value.length - 1)
    return imageList.value[nextIndex]?.url
  })

  // 根据标尺拖动方向确定上一张图片
  const preImageSrc = computed(() => {
    const nextIndex = Math.max(activeImage.value - 1, 0)
    return imageList.value[nextIndex]?.url
  })

  //加载所有图片
  const loadingImage = async () => {
    const height = (imgSheelRef.value as HTMLDivElement).clientHeight

    const promises = imageList.value.map(async (item, i) => {
      try {
        const img = new Image()
        img.src = item.url
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        return {
          index: i,
          data: {
            date: item.date,
            url: item.url,
            width: height * (img.width / img.height)
          }
        }
      } catch {
        console.error('图片预加载失败:', item.url)
        return { index: i, data: null }
      }
    })
    // 等待所有加载完成
    const results = await Promise.all(promises)
    const validResults = results.filter(r => r.data)
    validResults.sort((a, b) => a.index - b.index)
    scrollData.value = validResults.map(r => r.data!)
    imgLoading.value = true
  }

  //触发标尺拖动事件
  const dragScroll = ({ index, percent }: { index: number; percent: number }) => {
    activeImage.value = index
    if (percent >= 0) {
      nextImgOpacity.value = percent
      preImgOpacity.value = 0
      isDerection.value = 1
    } else {
      preImgOpacity.value = 1 + percent
      nextImgOpacity.value = 0
      isDerection.value = -1
    }
  }

  //index 代表松手后的显示图片索引 direction代表松手后自动定位的方向
  const stopScroll = ({ index, direction }: { index: number; direction: -1 | 1 }) => {
    imgAnimation.value = true
    if (isDerection.value > 0) {
      if (direction === 1) {
        nextImgOpacity.value = 1
        preImgOpacity.value = 0
      } else {
        nextImgOpacity.value = 0
        preImgOpacity.value = 0
      }
    } else {
      if (direction === 1) {
        nextImgOpacity.value = 0
        preImgOpacity.value = 0
      } else {
        preImgOpacity.value = 1
        nextImgOpacity.value = 0
      }
    }
    setTimeout(() => {
      imgAnimation.value = false
      nextImgOpacity.value = 0
      preImgOpacity.value = 0
      activeImage.value = index
    }, 350)
  }

  function sortData(data: TrackItem[]) {
    const arr = data.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    return arr
  }

  const imageClick = (url: string) => {
    emit('imageClick', url)
  }

  onMounted(() => {
    loadingImage()
  })
</script>

<style lang="scss" scoped>
  .painted-scroll {
    .img {
      height: 400px;
      .img-sheel {
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: scroll;
        position: relative;
        &::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Edge */
        }
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
        .next-img,
        .pre-img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          &.animation {
            transition: opacity 0.3s;
          }
        }
      }
    }
  }
</style>
