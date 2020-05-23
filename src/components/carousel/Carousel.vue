<template>
  <div class="card-carousel-wrapper">
    <div :disabled="atHeadOfList" @click="moveCarousel(-1)" class="card-carousel--nav__left"></div>
    <div class="card-carousel">
      <div class="card-carousel--overflow-container">
        <div :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}" class="card-carousel-cards">
          <div :key="i" class="card-carousel--card" v-for="(image, i) in data">
            <el-image :src="image" @mouseenter="handelHover(i)" fit="cover" style="width:58px;height:58px;"/>
          </div>
        </div>
      </div>
    </div>
    <div :disabled="atEndOfList" @click="moveCarousel(1)" class="card-carousel--nav__right"></div>
  </div>
</template>

<script>
  export default {
    name: "Carousel",
    props: ['width', 'data'],
    data() {
      return {
        currentOffset: 0,
        windowSize: 5,
        paginationFactor: 70
      }
    },
    computed: {
      atEndOfList() {
        return this.currentOffset <= (this.paginationFactor * -1) * (this.data.length - this.windowSize);
      },
      atHeadOfList() {
        return this.currentOffset === 0;
      }
    },
    methods: {
      moveCarousel(direction) {
        // Find a more elegant way to express the :style. consider using props to make it truly generic
        if (direction === 1 && !this.atEndOfList) {
          this.currentOffset -= this.paginationFactor;
        } else if (direction === -1 && !this.atHeadOfList) {
          this.currentOffset += this.paginationFactor;
        }
      },
      handelHover(i) {
        this.$emit('hover', i);
      }
    }
  }
</script>

<style lang="scss" scoped>
  $vue-navy: #2c3e50;
  $vue-navy-light: #3a5169;
  $vue-teal: #42b883;
  $vue-teal-light: #42b983;
  $gray: #666a73;
  $light-gray: #f8f8f8;


  body {
    background: $light-gray;
    color: $vue-navy;
    font-family: 'Source Sans Pro', sans-serif;
    min-height: 1000px;
  }

  .card-carousel-wrapper {
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0 40px;
    color: $gray;
  }

  .card-carousel {
    display: flex;
    justify-content: center;
    width: 640px;

    &--overflow-container {
      overflow: hidden;
    }

    &--nav__left,
    &--nav__right {
      display: inline-block;
      width: 15px;
      height: 15px;
      padding: 6px;
      box-sizing: border-box;
      border-top: 2px solid $vue-teal;
      border-right: 2px solid $vue-teal;
      cursor: pointer;
      margin: 0 10px;
      transition: transform 150ms linear;

      &[disabled] {
        opacity: 0.2;
        border-color: black;
      }
    }

    &--nav__left {
      transform: rotate(-135deg);

      &:active {
        transform: rotate(-135deg) scale(0.9);
      }
    }

    &--nav__right {
      transform: rotate(45deg);

      &:active {
        transform: rotate(45deg) scale(0.9);
      }
    }
  }

  .card-carousel-cards {
    width: 388px;
    display: flex;
    transition: transform 150ms ease-out;
    transform: translatex(0px);

    .card-carousel--card {
      height: 58px;
      cursor: pointer;
      box-shadow: 0 4px 15px 0 rgba(40, 44, 53, .06), 0 2px 2px 0 rgba(40, 44, 53, .08);
      background-color: #fff;
      border-radius: 4px;
      z-index: 3;
      margin: 0 10px 2px;

      &:first-child {
        margin-left: 10;
      }

      &:last-child {
        margin-right: 0;
      }

      .el-image {
        vertical-align: bottom;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        transition: opacity 150ms linear;
        user-select: none;

        &:hover {
          opacity: 0.5;
        }
      }

      &--footer {
        border-top: 0;
        padding: 7px 15px;

        p {
          padding: 3px 0;
          margin: 0 0 2px;
          font-size: 19px;
          font-weight: 500;
          color: $vue-navy;
          user-select: none;

          &:nth-of-type(2) {
            font-size: 12px;
            font-weight: 300;
            padding: 6px;
            background: rgba(40, 44, 53, .06);
            display: inline-block;
            position: relative;
            margin-left: 4px;
            color: $gray;

            &:before {
              content: "";
              float: left;
              position: absolute;
              top: 0;
              left: -12px;
              width: 0;
              height: 0;
              border-color: transparent rgba(40, 44, 53, .06) transparent transparent;
              border-style: solid;
              border-width: 12px 12px 12px 0;
            }

            &:after {
              content: "";
              position: absolute;
              top: 10px;
              left: -1px;
              float: left;
              width: 4px;
              height: 4px;
              border-radius: 2px;
              background: white;
              box-shadow: -0px -0px 0px #004977;
            }
          }
        }
      }
    }
  }

  h1 {
    font-size: 3.6em;
    font-weight: 100;
    text-align: center;
    margin-bottom: 0;
    color: $vue-teal;
  }
</style>