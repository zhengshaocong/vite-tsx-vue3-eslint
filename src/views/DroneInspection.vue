<!-- 无人机巡检 -->
<template>
  <div class="max-w">
    <PaintedScroll :img-list="imageList" @imageClick="imageClick"></PaintedScroll>
    <el-image-viewer
      v-if="showPreview"
      :url-list="[showImg]"
      show-progress
      :initial-index="0"
      @close="showPreview = false"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'

  const showImg = ref('')
  const showPreview = ref(false)

  const imageClick = (url: string) => {
    showImg.value = url
    showPreview.value = true
  }

  const imageList = ref<
    {
      time: string
      url: string
      height?: number
      width?: number
    }[]
  >([
    {
      time: '2023-01-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      time: '2023-01-02',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },
    {
      time: '2023-01-02',
      url: ' https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    },
    {
      time: '2023-01-02',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-2.jpg'
    },
    {
      time: '2023-01-09',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-3.jpg'
    },
    {
      time: '2023-01-09',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/illustration/illustration-10.webp'
    },
    {
      time: '2023-01-09',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-1.webp'
    },
    {
      time: '2023-01-09',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-2.webp'
    },
    {
      time: '2023-01-09',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-3.webp'
    }
  ])
</script>

<style lang="scss" scoped></style>
