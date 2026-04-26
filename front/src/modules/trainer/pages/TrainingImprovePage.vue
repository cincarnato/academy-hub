<script setup lang="ts">
import TrainingImprove from "../components/TrainingImprove.vue";

interface Props {
  trainingId: string
}

defineProps<Props>()
</script>

<template>
  <training-improve :training-id="trainingId" />
</template>
