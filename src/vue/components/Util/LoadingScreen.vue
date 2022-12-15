<template>
  <div class="loader-container" :style="loaderContainerStyle">
    <div :class="loaderClass"></div>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      required: false,
      default: '40px',
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    loaderContainerStyle() {
      return `width: ${this.size}; height: ${this.size}`;
    },
    loaderClass() {
      const loaderClass = ['loader'];
      if (this.color !== null) {
        loaderClass.push(this.color);
      }
      return loaderClass.join(' ');
    },
  },
};
</script>
<style lang="scss">

@keyframes spinner {
  to {transform: rotate(360deg);}
}

$loader-size: 100%;
$loader-color: #07d;
.loader-container {
  display: inline-block;
}
.loader {
  position: relative;
  height: $loader-size;
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: $loader-size;
    height: $loader-size;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid $loader-color;
    border-right: 2px solid transparent;
    animation: spinner .6s linear infinite;
  }
  &.white:before {
    border-top-color: white;
  }
  &.black:before {
    border-top-color: black;
  }
  &.gray:before {
    border-top-color: rgb(100,100,100);
  }
}
</style>
