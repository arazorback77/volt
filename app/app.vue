<template>
  <!-- <div>
    <NuxtRouteAnnouncer />
    <UButton color="error">Button</UButton>
    <VoltButton> VoltButton</VoltButton>
    <VoltAvatar label="P" class="mr-2" size="xlarge" shape="circle"  color="primary"/>
    <VoltSecondaryButton label="Hello World!!!!2222"></VoltSecondaryButton>
    <NuxtWelcome />
  </div> -->
  <UApp>
    <NuxtLoadingIndicator />

    <!-- <NuxtLayout >  -->
    <NuxtLayout name="gof"> 
      <NuxtPage />
    </NuxtLayout>
  </UApp>
 
</template>

   
<script setup lang="ts">
import Button from '@/components/volt/SecondaryButton.vue';
import Avatar from '@/components/volt/Avatar.vue';
// import AvatarGroup from '@/volt/AvatarGroup.vue';

</script>