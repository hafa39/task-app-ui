<template>
  <v-app>
    <page-header />
    <side-navigation />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>


import SideNavigation from "@/components/SideNavigation.vue";
import PageHeader from "@/components/PageHeader.vue";

export default {
  name: 'App',
  components: {SideNavigation, PageHeader},

  data: () => ({
    //
  }),
}
</script>
