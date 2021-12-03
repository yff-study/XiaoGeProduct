<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }

</script>

<style lang="scss">
  #app,
  html,
  body {
    margin: 0;
    color: #1E1847;
    padding: 0;
    width: 100vw;
    font-family: "MFYANSONG_NONCOMMERCIAL-REGULAR","Lucida Grande", Helvetica, Arial, Verdana, "Microsoft YaHei", sans-serif;
  }
  a { text-decoration: none;}
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

</style>
