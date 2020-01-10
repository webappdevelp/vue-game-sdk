<template>
  <div class="monster" :class="`monster${day}`">
    <span
      >第<i>{{ day }}</i
      >天</span
    >
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Monster extends Vue {
  @Prop({
    type: Number,
    default: 1
  })
  private day!: number;

  @Prop({
    type: Boolean,
    default: false
  })
  private active!: boolean;
}
</script>
<style lang="scss">
.monster {
  position: absolute;
  z-index: 5;
  padding-top: 0.35em;
  color: #c0d0e8;
  min-width: 0.27em;
  background: url('../../../assets/games/1019/monster.png') top center no-repeat;
  background-size: contain;
  box-sizing: border-box;
  &.active {
    background-image: url('../../../assets/games/1019/monster-active.png');
  }
  span {
    position: absolute;
    bottom: -1.2em;
    left: -0.2em;
    right: 0;
    font-size: 0.1em;
    text-align: center;
    white-space: nowrap;
  }
  &1 {
    top: 0.29em;
    left: 0.44em;
  }
  &2 {
    top: 0.13em;
    left: 0.91em;
  }
  &3 {
    top: 0;
    left: 1.5em;
  }
  &4 {
    top: 0.05em;
    right: 1.44em;
  }
  &5 {
    z-index: 1;
    top: 0.1em;
    right: 0.22em;
    width: 0.965em;
    height: 0.795em;
    background-image: url('../../../assets/games/1019/h5.png');
    &.active {
      background-image: url('../../../assets/games/1019/h5a.png');
    }
    span {
      display: none;
    }
  }
  &9 {
    top: 0.76em;
    left: 1em;
  }
  &8 {
    top: 0.68em;
    left: 1.6em;
  }
  &7 {
    top: 0.76em;
    right: 1.32em;
  }
  &6 {
    top: 0.76em;
    right: 0.78em;
  }
  &10 {
    z-index: 1;
    top: 1.18em;
    left: 0;
    width: 1.07em;
    height: 0.93em;
    background-image: url('../../../assets/games/1019/h10.png');
    &.active {
      background-image: url('../../../assets/games/1019/h10a.png');
    }
    span {
      display: none;
    }
  }
  &11 {
    top: 1.6em;
    left: 1.11em;
  }
  &12 {
    top: 1.5em;
    left: 1.66em;
  }
  &13 {
    top: 1.42em;
    right: 1.26em;
  }
  &14 {
    top: 1.36em;
    right: 0.71em;
  }
  &15 {
    z-index: 1;
    top: 1.52em;
    right: 0;
    width: 0.915em;
    height: 0.995em;
    background-image: url('../../../assets/games/1019/h15.png');
    &.active {
      background-image: url('../../../assets/games/1019/h15a.png');
    }
    span {
      display: none;
    }
  }
  &19 {
    top: 2.56em;
    left: 1.43em;
  }
  &18 {
    top: 2.62em;
    right: 1.48em;
  }
  &17 {
    top: 2.55em;
    right: 0.96em;
  }
  &16 {
    top: 2.38em;
    right: 0.54em;
  }
  &20 {
    z-index: 1;
    top: 2.07em;
    left: 0;
    width: 1.24em;
    height: 1.08em;
    background-image: url('../../../assets/games/1019/h20.png');
    &.active {
      background-image: url('../../../assets/games/1019/h20a.png');
    }
    span {
      display: none;
    }
  }
  &21 {
    top: 3.28em;
    left: 0.36em;
  }
  &22 {
    top: 3.44em;
    left: 0.82em;
  }
  &23 {
    top: 3.5em;
    left: 1.38em;
  }
  &24 {
    top: 3.46em;
    left: 2em;
  }
  &25 {
    z-index: 1;
    top: 2.85em;
    right: 0;
    width: 1.125em;
    height: 1.35em;
    background-image: url('../../../assets/games/1019/h25.png');
    &.active {
      background-image: url('../../../assets/games/1019/h25a.png');
    }
    span {
      display: none;
    }
  }
  &26 {
    top: 4.08em;
    right: 0.05em;
    span {
      left: -0.3em;
    }
  }
  &27 {
    top: 4.6em;
    right: 0.26em;
  }
  &28 {
    top: 4.82em;
    right: 0.78em;
    &.last {
      z-index: 1;
      top: 4.1em;
      left: 1em;
      width: 1.915em;
      height: 1.51em;
      background-image: url('../../../assets/games/1019/h28.png');
      &.active {
        background-image: url('../../../assets/games/1019/h28a.png');
      }
      span {
        display: none;
      }
    }
  }
  &29 {
    top: 4.9em;
    right: 1.34em;
    &.last {
      z-index: 1;
      top: 4.1em;
      left: .5em;
      width: 1.915em;
      height: 1.51em;
      background-image: url('../../../assets/games/1019/h29.png');
      &.active {
        background-image: url('../../../assets/games/1019/h29a.png');
      }
      span {
        display: none;
      }
    }
  }
  &30 {
    top: 4.9em;
    right: 1.9em;
    &.last {
      z-index: 1;
      top: 4em;
      left: 0;
      width: 1.915em;
      height: 1.51em;
      background-image: url('../../../assets/games/1019/h30.png');
      &.active {
        background-image: url('../../../assets/games/1019/h30a.png');
      }
      span {
        display: none;
      }
    }
  }
  &31 {
    z-index: 1;
    top: 4em;
    left: -0.5em;
    width: 1.915em;
    height: 1.51em;
    background-image: url('../../../assets/games/1019/h31.png');
    &.active {
      background-image: url('../../../assets/games/1019/h31a.png');
    }
    span {
      display: none;
    }
  }
}
</style>
