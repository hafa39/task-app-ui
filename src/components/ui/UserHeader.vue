<template>
  <v-container
      style="height: 50px"

  >
    <v-row justify="end">
      <v-menu
          min-width="100px"
          rounded
      >
        <template v-slot:activator="{ props }">
          <v-btn
              icon
              v-bind="props"
          >
            <v-avatar
                color="brown"
                size="small"
            >
              <span class="">{{ user.shortName}}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar
                  color="brown"
              >
                <span class="">{{ user.shortName }}</span>
              </v-avatar>
              <p>{{ user.fullName }}</p>
              <!--<p class="text-caption mt-1">
                {{ user.email }}
              </p>-->

              <!--<v-divider class="my-3"></v-divider>
              <v-btn
                  rounded
                  variant="text"
              >
                Edit Account
              </v-btn>-->
              <v-divider class="my-3"></v-divider>
              <v-btn
                  rounded
                  variant="text"
                  v-on:click="logout"
              >
                Logout
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>
  </v-container>
</template>
<script>
export default {

  props :{
    user : {
      type: Object,
      required: true
    }
  },
  data: () => ({

  }),

  methods:{
    logout(){
      this.$emit("logout")
    }
  }
}
</script>

