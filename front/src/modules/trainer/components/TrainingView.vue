<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import TrainingProvider from "../providers/TrainingProvider";
import type {ITraining} from "../interfaces/ITraining";
import TrainingQuizPanel from "./TrainingQuizPanel.vue";

interface Props {
  trainingId: string
}

type TrainingSlide = NonNullable<ITraining["slides"]>[number]

const props = defineProps<Props>()
const provider = TrainingProvider.instance

const loading = ref(false)
const error = ref("")
const training = ref<ITraining | null>(null)
const activeSlideIndex = ref(0)
const isPresentationOpen = ref(false)
const showPresentationQuiz = ref(false)

const slides = computed(() => {
  return (training.value?.slides || []).filter((slide) => slide.enabled !== false)
})
const globalSlideCss = computed(() => String(training.value?.globalSlideCss || "").trim())

const activeSlide = computed(() => slides.value[activeSlideIndex.value] || null)
const activeQuiz = computed(() => activeSlide.value?.quiz || [])
const activeQuizKey = computed(() => `${props.trainingId}-${activeSlideIndex.value}`)
const activePresentationQuizKey = computed(() => `${activeQuizKey.value}-presentation`)
const canGoPrev = computed(() => activeSlideIndex.value > 0)
const canGoNext = computed(() => activeSlideIndex.value < slides.value.length - 1)
const totalSlides = computed(() => slides.value.length)

async function loadTraining() {
  if (!props.trainingId) {
    training.value = null
    error.value = "No se recibió un identificador de entrenamiento."
    return
  }

  loading.value = true
  error.value = ""

  try {
    training.value = await provider.findByIdOrSlug(props.trainingId)
    activeSlideIndex.value = 0
    showPresentationQuiz.value = false
  } catch (err) {
    console.error("Error loading training:", err)
    training.value = null
    error.value = "No fue posible cargar este entrenamiento en este momento."
  } finally {
    loading.value = false
  }
}

function goToSlide(index: number) {
  if (index < 0 || index >= slides.value.length) return
  activeSlideIndex.value = index
}

function goToPrevSlide() {
  if (!canGoPrev.value) return
  goToSlide(activeSlideIndex.value - 1)
}

function goToNextSlide() {
  if (!canGoNext.value) return
  goToSlide(activeSlideIndex.value + 1)
}

function openPresentationMode() {
  if (!activeSlide.value) return
  isPresentationOpen.value = true
}

function closePresentationMode() {
  isPresentationOpen.value = false
  showPresentationQuiz.value = false
}

function renderSlideContent(slide: TrainingSlide) {
  return slide.content || ""
}

function shouldRenderAsHtml(slide: TrainingSlide) {
  const normalizedContentType = String(slide.contentType || "").trim().toLowerCase()
  if (normalizedContentType === "html") return true

  const content = renderSlideContent(slide).trim()
  return /<\/?[a-z][\w-]*(\s[^>]*)?>/i.test(content)
}

function hasQuiz(slide: TrainingSlide | null) {
  return Boolean(slide?.quiz?.length)
}

function getFileLabel(filepath?: string) {
  if (!filepath) return "Archivo"
  return filepath.split("/").pop() || filepath
}

watch(() => props.trainingId, () => {
  void loadTraining()
})

watch(activeSlideIndex, () => {
  showPresentationQuiz.value = false
})

onMounted(() => {
  void loadTraining()
})
</script>

<template>
  <v-container fluid class="px-0">
      <v-skeleton-loader
        v-if="loading"
        type="article, image, actions"
        class="mx-auto"
      />

      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        border="start"
        class="mx-auto"
      >
        {{ error }}
      </v-alert>

      <template v-else-if="training">
        <component
          :is="'style'"
          v-if="globalSlideCss"
          type="text/css"
        >
          {{ globalSlideCss }}
        </component>

        <v-card class="mx-auto"  rounded="xl">
          <v-card-item class="pa-4 pa-md-6">
            <div class="d-flex flex-column flex-md-row justify-space-between ga-4">
              <div>
                <div class="d-flex flex-wrap align-center ga-2 mb-3">
                  <v-chip v-if="training.category" size="small" variant="flat" color="primary">
                    {{ training.category }}
                  </v-chip>
                  <v-chip v-if="training.status" size="small" variant="outlined">
                    {{ training.status }}
                  </v-chip>
                </div>

                <h1 class="text-h5 text-md-h3 font-weight-bold mb-2">
                  {{ training.name }}
                </h1>

                <p v-if="training.description" class="text-body-2 text-md-body-1 text-medium-emphasis mb-0">
                  {{ training.description }}
                </p>
              </div>

              <div class="text-body-2 text-medium-emphasis">
                {{ activeSlideIndex + 1 }} / {{ totalSlides }} slides
              </div>
            </div>
          </v-card-item>

          <v-divider />

          <v-card-text class="pa-3 pa-md-4">
            <v-slide-group
              v-model="activeSlideIndex"
              selected-class="slide-chip-active"
              show-arrows
              center-active
            >
              <v-slide-group-item
                v-for="(slide, index) in slides"
                :key="`${slide.title}-${index}`"
                v-slot="{ toggle }"
                :value="index"
              >
                <v-btn
                  :variant="activeSlideIndex === index ? 'flat' : 'text'"
                  :color="activeSlideIndex === index ? 'primary' : undefined"
                  rounded="pill"
                  class="mr-2 text-none slide-chip-btn"
                  :class="{'slide-chip-btn--active': activeSlideIndex === index}"
                  @click="toggle(); goToSlide(index)"
                >
                  <span class="slide-chip-index mr-2">{{ index + 1 }}</span>
                  <span class="text-truncate">{{ slide.title || `Slide ${index + 1}` }}</span>
                </v-btn>
              </v-slide-group-item>
            </v-slide-group>
          </v-card-text>

          <v-divider />

          <template v-if="activeSlide">
            <v-card-text class="pa-3 pa-md-6">
              <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-3 mb-4">
                <v-btn
                  prepend-icon="mdi-presentation"
                  color="primary"
                  variant="flat"
                  @click="openPresentationMode"
                >
                  Modo presentación
                </v-btn>

                <div class="d-none d-md-flex align-center ga-3">
                  <v-btn
                    icon="mdi-chevron-left"
                    variant="tonal"
                    :disabled="!canGoPrev"
                    @click="goToPrevSlide"
                  />

                  <v-btn
                    icon="mdi-chevron-right"
                    variant="tonal"
                    :disabled="!canGoNext"
                    @click="goToNextSlide"
                  />
                </div>
              </div>

              <v-card variant="outlined" rounded="xl">
                <v-card-text class="pa-4 pa-md-6">
                  <div class="mb-4">
                    <div class="text-overline">Slide {{ activeSlideIndex + 1 }}</div>
                    <h2 class="text-h6 text-md-h5 font-weight-bold mb-1">
                      {{ activeSlide.title || `Slide ${activeSlideIndex + 1}` }}
                    </h2>
                    <p v-if="activeSlide.subtitle" class="text-body-2 text-md-body-1 text-medium-emphasis mb-0">
                      {{ activeSlide.subtitle }}
                    </p>
                  </div>

                  <div
                    v-if="shouldRenderAsHtml(activeSlide)"
                    class="slide-body slide-body-html"
                    v-html="renderSlideContent(activeSlide)"
                  />

                  <div
                    v-else
                    class="slide-body slide-body-markdown"
                  >
                    {{ renderSlideContent(activeSlide) }}
                  </div>

                  <div
                    v-if="activeSlide.files?.length"
                    class="mt-6"
                  >
                    <div class="text-subtitle-2 font-weight-medium mb-3">Material adjunto</div>
                    <v-row dense>
                      <v-col
                        v-for="file in activeSlide.files"
                        :key="file.url"
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-card variant="outlined" class="h-100">
                          <v-card-text class="pa-4">
                            <div class="text-body-2 font-weight-medium mb-1">
                              {{ file.filename || getFileLabel(file.filepath) }}
                            </div>
                            <div class="text-caption text-medium-emphasis mb-3">
                              {{ file.mimetype || "Archivo" }}
                            </div>
                            <v-btn
                              :href="file.url"
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              variant="tonal"
                            >
                              Abrir archivo
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>

                  <div
                    v-if="hasQuiz(activeSlide)"
                    class="mt-8"
                  >
                    <v-divider class="mb-4" />
                    <TrainingQuizPanel
                      :questions="activeQuiz"
                      :quiz-key="activeQuizKey"
                    />
                  </div>
                </v-card-text>
              </v-card>

              <div class="d-flex d-md-none align-center justify-space-between ga-3 mt-4">
                <v-btn
                  prepend-icon="mdi-chevron-left"
                  variant="tonal"
                  :disabled="!canGoPrev"
                  @click="goToPrevSlide"
                >
                  Anterior
                </v-btn>

                <v-btn
                  append-icon="mdi-chevron-right"
                  variant="tonal"
                  :disabled="!canGoNext"
                  @click="goToNextSlide"
                >
                  Siguiente
                </v-btn>
              </div>
            </v-card-text>
          </template>

          <v-alert
            v-else
            type="warning"
            variant="tonal"
            class="ma-4 ma-md-6"
          >
            Este entrenamiento no tiene slides habilitados.
          </v-alert>
        </v-card>

        <v-dialog
          v-model="isPresentationOpen"
          fullscreen
          scrim="black"
          transition="dialog-bottom-transition"
        >
          <v-card v-if="activeSlide" class="presentation-dialog">
            <v-toolbar color="surface" density="comfortable" class="px-2 px-md-4">
              <div class="d-flex flex-column justify-center min-w-0 presentation-toolbar-side">
                <div class="text-subtitle-1 font-weight-bold text-truncate">
                  {{ training.name }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Slide {{ activeSlideIndex + 1 }} de {{ totalSlides }}
                  <span v-if="activeSlide.title" class="text-truncate d-inline-block presentation-toolbar-slide">
                    · {{ activeSlide.title }}
                  </span>
                </div>
              </div>

              <div class="d-flex align-center justify-center ga-2 flex-1-1 presentation-toolbar-center">
                <v-btn
                  icon="mdi-chevron-left"
                  variant="tonal"
                  :disabled="!canGoPrev"
                  @click="goToPrevSlide"
                />
                <v-btn
                  v-if="hasQuiz(activeSlide)"
                  :icon="showPresentationQuiz ? 'mdi-help-circle' : 'mdi-help-circle-outline'"
                  variant="tonal"
                  @click="showPresentationQuiz = !showPresentationQuiz"
                />
                <v-btn
                  icon="mdi-chevron-right"
                  variant="tonal"
                  :disabled="!canGoNext"
                  @click="goToNextSlide"
                />
              </div>

              <div class="d-flex justify-end presentation-toolbar-side">
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  @click="closePresentationMode"
                />
              </div>
            </v-toolbar>

            <v-card-text class="presentation-content pa-0">
              <div
                v-if="showPresentationQuiz && hasQuiz(activeSlide)"
                class="presentation-quiz px-3 px-md-6 pt-3 pb-4"
              >
                <TrainingQuizPanel
                  :questions="activeQuiz"
                  :quiz-key="activePresentationQuizKey"
                  :initially-open="true"
                  :hide-activator="true"
                  :compact="true"
                />
              </div>

              <div class="presentation-slide">
                <div
                  v-if="shouldRenderAsHtml(activeSlide)"
                  class="slide-body slide-body-html presentation-slide-body"
                  v-html="renderSlideContent(activeSlide)"
                />

                <div
                  v-else
                  class="slide-body slide-body-markdown presentation-slide-body"
                >
                  {{ renderSlideContent(activeSlide) }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
  </v-container>
</template>

<style scoped>
.slide-chip-btn {
  border: 1px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.slide-chip-btn--active {
  background: rgba(var(--v-theme-primary), 0.16);
  border-color: rgba(var(--v-theme-primary), 0.45);
  color: rgb(var(--v-theme-primary));
  box-shadow: 0 10px 24px rgba(var(--v-theme-primary), 0.18);
  transform: translateY(-1px);
}

.slide-chip-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  font-weight: 700;
  flex-shrink: 0;
}

.slide-chip-btn--active .slide-chip-index {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.slide-chip-active {
  background: rgba(var(--v-theme-primary), 0.12);
}

.presentation-dialog {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.presentation-toolbar-side {
  flex: 0 1 320px;
  min-width: 0;
}

.presentation-toolbar-center {
  min-width: 0;
}

.presentation-toolbar-slide {
  max-width: min(36vw, 320px);
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.presentation-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  width: 100%;
  padding: 0;
  background:
    radial-gradient(circle at top, rgba(var(--v-theme-primary), 0.08), transparent 36%),
    rgb(var(--v-theme-surface));
}

.presentation-slide {
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: 0;
}

.presentation-quiz {
  width: min(100%, 1080px);
  margin: 0 auto;
}

@media (min-width: 960px) {
  .presentation-content {
    padding: 0 8px 8px;
  }

  .presentation-slide {
    padding: 0 8px 8px;
  }
}

.presentation-slide-body {
  font-size: clamp(1.05rem, 1vw + 0.9rem, 1.5rem);
  line-height: 1.8;
}

.slide-body {
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(15, 23, 42, 0.92);
}

.slide-body-markdown {
  white-space: pre-wrap;
}

.slide-body-html :deep(h1),
.slide-body-html :deep(h2),
.slide-body-html :deep(h3) {
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.slide-body-html :deep(p),
.slide-body-html :deep(ul),
.slide-body-html :deep(ol) {
  margin-bottom: 1rem;
}
</style>
