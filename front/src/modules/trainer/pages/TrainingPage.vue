<script setup lang="ts">
import TrainingView from "../components/TrainingView.vue";

interface Props {
  trainingId: string
}

defineProps<Props>()
</script>

<template>
  <training-view :training-id="trainingId" />
</template>
