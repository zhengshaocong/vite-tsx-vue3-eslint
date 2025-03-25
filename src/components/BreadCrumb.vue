<template>
  <div class="breadcrumb" :class="{ animation: animation }">
    <nav aria-label="breadcrumb" class="nav">
      <ul class="nav-list">
        <li v-for="(item, index) in breadcrumbItems" :key="index" @click="navigateTo(index)">
          {{ item.title }}
        </li>
      </ul>
    </nav>
    <div class="title">
      {{ activeTitle }}
    </div>
    <div class="content">
      <ul>
        <li
          v-for="index in 4"
          :key="index"
          class="li-item"
          :class="{ hide: !activeArray[index - 1] }"
          @click="goPage(activeArray[index - 1].path)"
        >
          <template v-if="activeArray[index - 1]">
            <div class="li-title">
              {{ activeArray[index - 1].title }}
            </div>
            <div class="li-text">
              {{ activeArray[index - 1].explain }}
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type { PropType } from 'vue'
  import type { Navigation, NavigationItem } from '@/types/navigation-class'

  export default defineComponent({
    name: 'BreadCrumb',
    props: {
      items: {
        type: Array as PropType<Navigation[]>,
        required: true
      },
      active: {
        type: Number,
        required: true,
        default: 0
      }
    },
    setup(props, { emit }) {
      const animation = ref(true)

      //动画函数
      let animationFun: number = 0

      const navigateTo = (index: number) => {
        if (props.active !== index) {
          animation.value = false
          clearTimeout(animationFun)
          animationFun = setTimeout(() => {
            emit('update:active', index)
            animation.value = true
          }, 600)
        }
      }

      const activeArray = computed<NavigationItem[]>(() => {
        return props.items[props.active].data
      })

      const activeTitle = computed<string>(() => {
        return props.items[props.active].title
      })

      const router = useRouter()

      const goPage = (path: string) => {
        if (path) router.push({ path })
      }

      return {
        breadcrumbItems: props.items,
        navigateTo,
        activeArray,
        activeTitle,
        animation,
        goPage
      }
    }
  })
</script>

<style scoped lang="scss">
  @mixin transitionStart {
    opacity: 1 !important;
    transform: translate(0) !important;
  }
  .breadcrumb {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;

    &.animation {
      .title {
        @include transitionStart;
      }
      li {
        @include transitionStart;
      }
    }

    .nav {
      display: flex;
      flex-direction: row-reverse;
      .nav-list {
        display: flex;
        padding: 20px 50px;
        font-size: 23px;
        color: #fff;
        li {
          width: 200px;
          padding: 20px 0;
          margin-right: 15px;
          cursor: pointer;
          text-align: center;
          &:hover {
            background-color: #83d3ff;
          }
        }
      }
    }
    .title {
      opacity: 0;
      transition:
        opacity 0.3s ease-in-out,
        transform 0.3s ease-in-out;
      transform: translate(-20px, 0);
      font-size: 50px;
      padding-left: 200px;
      font-weight: 600;
      color: #fff;
      position: relative;
      display: inline-block;
    }
    .content {
      background-color: #fff;
      height: 250px;
      position: relative;
      ul {
        display: flex;
        justify-content: space-between;
        height: 300px;
        padding: 0px 200px;
        position: relative;
        top: -125px;
        .li-item {
          opacity: 0;
          transform: translate(0px, 20px);
          width: 225px;
          padding: 20px 25px;
          cursor: pointer;
          text-align: center;
          background-color: #fff;
          box-shadow: 4px 8px 15px #909090;
          border-radius: 5px;
          &.hide {
            opacity: 0 !important;
          }
          @for $i from 1 through 4 {
            &:nth-child(#{$i}) {
              transition:
                opacity 0.3s ease-in-out,
                transform $i * 0.2s ease-in-out;
            }
          }
          .li-title {
            line-height: 44px;
            border-bottom: 1px solid #eee;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 5px;
          }
          .li-text {
            font-size: 15px;
            padding: 11px 20px;
            line-height: 25px;
            text-align: left;
            color: #999;
          }
        }
      }
    }
  }
</style>
