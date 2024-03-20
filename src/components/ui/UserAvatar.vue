<template>
  <v-container
      fluid
      style="height: 50px"
  >
    <v-row>
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
}
</script>
