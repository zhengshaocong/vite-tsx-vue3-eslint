<!-- 无人机巡检 -->
<template>
  <div class="max-w">
    <GradualChangeScroll :img-list="imageList" @imageClick="imageClick"></GradualChangeScroll>
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
      date: string
      url: string
      height?: number
      width?: number
    }[]
  >([
    // 1月（4条）
    {
      date: '2023-01-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      date: '2023-01-10',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },
    {
      date: '2023-01-20',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    },
    {
      date: '2023-01-30',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-2.jpg'
    },
    {
      date: '2023-01-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      date: '2023-01-10',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },
    {
      date: '2023-01-20',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    },
    {
      date: '2023-01-30',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-2.jpg'
    },

    // 2月（3条）
    {
      date: '2023-02-01',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-3.jpg'
    },
    {
      date: '2023-02-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/illustration/illustration-10.webp'
    },
    {
      date: '2023-02-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-1.webp'
    },

    // 3月（3条）
    {
      date: '2023-03-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-2.webp'
    },
    {
      date: '2023-03-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-3.webp'
    },
    {
      date: '2023-03-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      date: '2023-03-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-3.webp'
    },
    {
      date: '2023-03-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },

    // 4月（3条）
    {
      date: '2023-04-01',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },
    {
      date: '2023-04-10',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    },
    {
      date: '2023-04-20',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-2.jpg'
    },

    // 5月（3条）
    {
      date: '2023-05-01',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-3.jpg'
    },
    {
      date: '2023-05-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/illustration/illustration-10.webp'
    },
    {
      date: '2023-05-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-1.webp'
    },

    // 6月（4条）
    {
      date: '2023-06-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-2.webp'
    },
    {
      date: '2023-06-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-3.webp'
    },
    {
      date: '2023-06-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      date: '2023-06-30',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },
    {
      date: '2023-05-01',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-3.jpg'
    },
    {
      date: '2023-05-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/illustration/illustration-10.webp'
    },

    // 7月（3条）
    {
      date: '2023-07-01',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    },
    {
      date: '2023-07-10',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-2.jpg'
    },
    {
      date: '2023-07-20',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-3.jpg'
    },

    // 8月（3条）
    {
      date: '2023-08-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/illustration/illustration-10.webp'
    },
    {
      date: '2023-08-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-1.webp'
    },
    {
      date: '2023-08-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-2.webp'
    },

    // 9月（3条）
    {
      date: '2023-09-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-3.webp'
    },
    {
      date: '2023-09-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      date: '2023-09-20',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },

    // 10月（3条）
    {
      date: '2023-10-01',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    },
    {
      date: '2023-10-10',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-2.jpg'
    },
    {
      date: '2023-10-20',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-3.jpg'
    },

    // 11月（3条）
    {
      date: '2023-11-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/illustration/illustration-10.webp'
    },
    {
      date: '2023-11-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-1.webp'
    },
    {
      date: '2023-11-20',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-2.webp'
    },

    // 12月（4条）
    {
      date: '2023-12-01',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/steps/steps-3.webp'
    },
    {
      date: '2023-12-10',
      url: 'https://bootstrapmade.com/content/demo/Arsha/assets/img/bg/bg-8.webp'
    },
    {
      date: '2023-12-20',
      url: 'https://bootstrapmade.com/content/demo/Append/assets/img/hero-bg.jpg'
    },
    {
      date: '2023-12-30',
      url: 'https://bootstrapmade.com/content/demo/Dewi/assets/img/services-1.jpg'
    }
  ])
</script>

<style lang="scss" scoped></style>
