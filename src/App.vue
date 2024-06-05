<template>
  <v-app>
    <page-header />
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

  data() {
    return {
      isHelpPage: false // Initially, it's not a help page
    };
  },
  watch: {
    // Watch for route changes
    $route(to, from) {
      // Check if the route is for the help page
      this.isHelpPage = to.name === 'help';
    }
  }
}
</script>
