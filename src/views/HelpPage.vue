<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Test Credentials</v-card-title>
          <v-card-text>
            <p> To facilitate testing of the application, you can use the following sample credentials:</p>
            <ul>
              <li><strong>Username:</strong> bjorn</li>
              <li><strong>Password:</strong> password</li>
            </ul>
            <p>If you'd like to test application return to the homepage, <router-link to="/">click here</router-link>.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Features</v-card-title>
          <v-card-text>
            <!-- Feature List Component -->
            <ul>
              <li><strong>User Authentication:</strong> Users can securely log in and log out of the application to access their personalized workspace.</li>
              <li><strong>Team Creation and Management:</strong> Users can create teams to collaborate with colleagues or organize projects effectively.</li>
              <li><strong>Board Management:</strong> Each team can have multiple boards, serving as visual workspaces similar to Trello boards.</li>
              <li><strong>Card Lists and Cards:</strong> Boards can contain multiple lists, each representing a category or stage of work. Within lists, users can create cards to represent individual tasks or items.</li>
              <li><strong>Interactive Board Operations:</strong> Users can perform various interactive actions on boards, such as moving lists and cards between different positions or categories.</li>
              <li><strong>User Collaboration:</strong> Users can invite others to collaborate on boards, enabling team members to work together seamlessly.</li>
              <li><strong>Card Editing and Attachments:</strong> Users can edit card details, including name, description, and attachments (e.g., files, images). They can also leave comments on cards to provide updates or feedback.</li>
              <li><strong>Activity Tracking:</strong> The application logs and displays user activities, such as creating, moving, editing, or removing cards, providing a comprehensive audit trail of board interactions.</li>
              <li><strong>User Profile Management:</strong> Users can update their information, including name, and upload avatars to personalize their profile.</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Technologies Used</v-card-title>
          <v-card-text>
            <ul>
              <li><strong>Frontend Framework:</strong> Vue.js</li>
              <li><strong>Backend Framework:</strong> Spring Framework</li>
              <li><strong>Service-Based Architecture:</strong> The application architecture is designed with a service-based approach, where functionalities are modularized into separate services (e.g., board-service, card-service).</li>
              <li><strong>Continuous Integration/Continuous Deployment (CI/CD):</strong> CI/CD pipelines are implemented using GitHub Actions to automate the build, test, and deployment processes.</li>
              <li><strong>Message Broker:</strong> RabbitMQ is used as a message broker software that facilitates communication between distributed applications.</li>
              <li><strong>Authorization Server:</strong> Keycloak is used as an open-source identity and access management solution for authentication, authorization, and user management.</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "HelpPage"
}
</script>


<style scoped>

</style>