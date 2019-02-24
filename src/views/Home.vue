<template>
  <div id="home">
    <ul class="games">
      <li><router-link to="/scenes?gid=10147">末日围城</router-link></li>
      <li><router-link to="/scenes?gid=1014">梦幻西游</router-link></li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Home extends Vue {

}
</script>
<style lang="scss" scoped>
.games {
  li {
    display: inline-block;
  }
  li + li {
    margin-left: 10px;
  }
  a {
    color: green;
  }
}
</style>
