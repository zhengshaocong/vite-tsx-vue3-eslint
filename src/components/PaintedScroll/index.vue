<!-- 定位画轴组件 -->
<template>
  <div class="max-w">
    <div class="painted-scroll">
      <ScrollTrack
        :track="scrollData"
        :location="{ width: areaWidth, scrollWidth: areaScrollWidth }"
        @change="changeScroll"
      ></ScrollTrack>
      <div ref="imgSheelRef" class="img">
        <div v-if="imgLoading" ref="imgScrollRef" class="img-sheel">
          <img
            v-for="item in imageList"
            :key="item.time"
            :src="item.url"
            :style="{ width: item.width + 'px' }"
            @click="imageClick(item.url)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import ScrollTrack from './scroll-track.vue'
  import type { ImageType, TrackItem } from './PaintedScroll'

  const imageList = ref<ImageType[]>([])
  const imgSheelRef = ref()
  const imgScrollRef = ref()
  let imgSheelRefWidth = 0
  const imgLoading = ref(false)
  const areaWidth = ref(0)
  const areaScrollWidth = ref(0)
  const emit = defineEmits(['imageClick'])

  const props = withDefaults(defineProps<{ imgList: ImageType[] }>(), {
    imgList: () => []
  })

  const scrollData = ref<TrackItem[]>([])

  watch(
    () => props.imgList,
    () => {
      imageList.value = props.imgList
    },
    {
      immediate: true
    }
  )

  const changeImage = () => {
    const height = (imgSheelRef.value as HTMLDivElement).clientHeight
    imgSheelRefWidth = (imgSheelRef.value as HTMLDivElement).clientWidth
    let loads = 0
    let imgLenfgth = 0
    const arr: TrackItem[] = []
    const length = imageList.value.length
    for (let i = 0; i < length; i++) {
      const item = imageList.value[i]
      const img = new Image()
      img.src = item.url
      img.onload = () => {
        item.width = height * (img.width / img.height)
        arr.push({
          text: item.time,
          width: (item.width / imgSheelRefWidth) * 100
        })
        imgLenfgth += item.width
        loads += 1
        if (loads === length) {
          imgLoading.value = true
          scrollData.value = arr

          areaWidth.value = imgSheelRefWidth
          areaScrollWidth.value = imgLenfgth
        }
      }
      img.onerror = () => {
        console.error('图片预加载失败')
        loads += 1
        if (loads === length) {
          imgLoading.value = true
        }
      }
    }
  }

  const changeScroll = (e: number) => {
    const scroll = imgScrollRef.value.scrollWidth - imgSheelRefWidth
    imgScrollRef.value.scrollLeft = e * scroll
  }

  const imageClick = (url: string) => {
    emit('imageClick', url)
  }

  onMounted(() => {
    changeImage()
  })
</script>

<style lang="scss" scoped>
  .painted-scroll {
    .img {
      height: 200px;
      .img-sheel {
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: scroll;
        &::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Edge */
        }
        img {
          height: 100%;
        }
      }
    }
  }
</style>
