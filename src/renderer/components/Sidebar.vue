<template>
  <div id="sidebar">
    <div class="buttons-container">
      <button v-for="route in routes" :key="route.name"
        :data-active="route.active"
        @click="changeRoute(route)">
        <i :class="`fa fa-${route.icon}`"></i>
      </button>
    </div>
  </div>
</template>

<script>
const methods = {
  changeRoute (route) {
    this.routes.forEach((route) => {
      route.active = false
    })
    this.$router.replace({ name: route.name })
    route.active = true
  }
}
export default {
  methods,
  data () {
    return {
      routes: [
        {
          name: 'clipboard',
          icon: 'paperclip',
          active: true
        }, {
          name: 'settings',
          icon: 'cog'
        }
      ]
    }
  }
}
</script>

<style>

</style>
