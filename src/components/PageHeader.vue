<template>
  <v-app-bar
      color="teal"
      density="compact"
      :elevation="10"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Task App</v-app-bar-title>

<!--    <template v-slot:append>-->
<!--      <v-btn icon="mdi-dots-vertical"></v-btn>-->
<!--    </template>-->
  </v-app-bar>
</template>

<script>
export default {
name: "PageHeader",

  data(){
    return {
    }
  },

  methods:{

  }
}
</script>

<style scoped>

</style>
