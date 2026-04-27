<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import TrainingProvider from "../providers/TrainingProvider";
import type {
  ITraining,
  ITrainingBase,
  ITrainingQuizAnswer,
  ITrainingQuizQuestion,
  ITrainingSlide,
} from "../interfaces/ITraining";

interface Props {
  trainingId: string
}

type TrainingSlide = ITrainingSlide

const props = defineProps<Props>()
const provider = TrainingProvider.instance

const loading = ref(false)
const saving = ref(false)
const aiLoading = ref<'theme' | 'slide' | 'improve' | 'quiz' | ''>('')
const error = ref("")
const successMessage = ref("")
const aiFeedback = ref("")

const training = ref<ITraining | null>(null)
const selectedSlideIndex = ref(0)
const activeTab = ref<"theme" | "slide" | "improve" | "quiz">("theme")
const improvePreviewTab = ref<"current" | "improved">("current")

const themePrompt = ref("")
const newSlidePrompt = ref("")
const improvePrompt = ref("")
const quizPrompt = ref("")

const slides = computed(() => training.value?.slides || [])
const selectedSlide = computed(() => slides.value[selectedSlideIndex.value] || null)
const slideContentTypeOptions = [
  {title: "Markdown", value: "markdown"},
  {title: "HTML", value: "html"},
]

const themePreview = ref("")
const generatedSlidePreview = ref<TrainingSlide | null>(null)
const improvedSlidePreview = ref<TrainingSlide | null>(null)
const generatedQuizPreview = ref<Array<ITrainingQuizQuestion>>([])

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
    selectedSlideIndex.value = 0
    themePreview.value = training.value?.globalSlideCss || ""
  } catch (err) {
    console.error("Error loading training:", err)
    training.value = null
    error.value = "No fue posible cargar este entrenamiento en este momento."
  } finally {
    loading.value = false
  }
}

function normalizeSlide(slide: Partial<TrainingSlide>): TrainingSlide {
  return {
    title: String(slide.title || "").trim(),
    subtitle: String(slide.subtitle || "").trim(),
    contentType: slide.contentType === "html" ? "html" : "markdown",
    content: String(slide.content || "").trim(),
    speakerNotes: String(slide.speakerNotes || "").trim(),
    quiz: Array.isArray(slide.quiz) ? slide.quiz : [],
    enabled: slide.enabled !== false,
  }
}

function normalizeQuizAnswer(answer: Partial<ITrainingQuizAnswer>): ITrainingQuizAnswer {
  return {
    answer: String(answer.answer || "").trim(),
    points: typeof answer.points === "number" ? answer.points : 0,
    isCorrect: Boolean(answer.isCorrect),
    feedback: String(answer.feedback || "").trim(),
  }
}

function normalizeQuizQuestion(question: Partial<ITrainingQuizQuestion>): ITrainingQuizQuestion {
  const type = String(question.type || "").trim()
  const normalizedType = ["single_choice", "multiple_choice", "open_text"].includes(type)
    ? type
    : "single_choice"

  return {
    question: String(question.question || "").trim(),
    description: String(question.description || "").trim(),
    type: normalizedType,
    answers: Array.isArray(question.answers)
      ? question.answers.map((answer) => normalizeQuizAnswer(answer)).filter((answer) => answer.answer)
      : [],
    required: question.required !== false,
    explanation: String(question.explanation || "").trim(),
  }
}

function normalizeQuiz(quiz: Array<Partial<ITrainingQuizQuestion>> | undefined | null) {
  if (!Array.isArray(quiz)) return []
  return quiz
    .map((question) => normalizeQuizQuestion(question))
    .filter((question) => question.question)
}

function buildUpdatePayload(nextTraining: ITraining): ITrainingBase {
  return {
    name: nextTraining.name,
    slug: nextTraining.slug,
    description: nextTraining.description,
    status: nextTraining.status,
    category: nextTraining.category,
    tags: nextTraining.tags,
    author: nextTraining.author,
    globalSlideCss: nextTraining.globalSlideCss,
    files: nextTraining.files,
    slides: nextTraining.slides,
    primaryColor: nextTraining.primaryColor,
    coverImageUrl: nextTraining.coverImageUrl,
    isPublic: nextTraining.isPublic,
    publishedAt: nextTraining.publishedAt,
    metadata: nextTraining.metadata,
  }
}

async function persistTraining(nextTraining: ITraining, success: string) {
  saving.value = true
  error.value = ""

  try {
    training.value = await provider.update(nextTraining._id, buildUpdatePayload(nextTraining))
    successMessage.value = success
    themePreview.value = training.value?.globalSlideCss || ""
  } catch (err) {
    console.error("Error saving training:", err)
    error.value = "No fue posible guardar los cambios del entrenamiento."
  } finally {
    saving.value = false
  }
}

async function handleGenerateTheme() {
  if (!training.value) return
  if (!themePrompt.value.trim()) {
    error.value = "Ingresá un prompt para generar el theme."
    return
  }

  aiLoading.value = "theme"
  error.value = ""
  successMessage.value = ""

  try {
    const response = await provider.generateThemeFromPrompt(training.value, themePrompt.value.trim())
    const css = String(response.output?.globalSlideCss || "").trim()

    if (!css) {
      error.value = "La IA no devolvió un theme CSS utilizable."
      return
    }

    aiFeedback.value = String(response.output?.rationale || "")
    themePreview.value = css

    await persistTraining({
      ...training.value,
      globalSlideCss: css,
    }, "Theme CSS generado y guardado.")
  } catch (err) {
    console.error("Error generating theme:", err)
    error.value = "No fue posible generar el theme con IA."
  } finally {
    aiLoading.value = ""
  }
}

async function handleGenerateSlide() {
  if (!training.value) return
  if (!newSlidePrompt.value.trim()) {
    error.value = "Ingresá un prompt para generar una nueva slide."
    return
  }

  aiLoading.value = "slide"
  error.value = ""
  successMessage.value = ""

  try {
    const response = await provider.generateSlideFromPrompt(training.value, newSlidePrompt.value.trim())
    const nextSlide = normalizeSlide(response.output?.slide || {})

    if (!nextSlide.title || !nextSlide.content) {
      error.value = "La IA devolvió una slide incompleta."
      return
    }

    aiFeedback.value = String(response.output?.rationale || "")
    generatedSlidePreview.value = nextSlide

    const nextSlides = [...slides.value, nextSlide]
    await persistTraining({
      ...training.value,
      slides: nextSlides,
    }, "Nueva slide generada y agregada al entrenamiento.")

    selectedSlideIndex.value = Math.max(0, nextSlides.length - 1)
  } catch (err) {
    console.error("Error generating slide:", err)
    error.value = "No fue posible generar una nueva slide con IA."
  } finally {
    aiLoading.value = ""
  }
}

async function handleImproveSlide() {
  if (!training.value || !selectedSlide.value) return
  if (!improvePrompt.value.trim()) {
    error.value = "Ingresá un prompt para mejorar la slide seleccionada."
    return
  }

  aiLoading.value = "improve"
  error.value = ""
  successMessage.value = ""

  try {
    const response = await provider.improveSlideFromPrompt(
      training.value,
      selectedSlide.value,
      improvePrompt.value.trim(),
    )
    const nextSlide = normalizeSlide(response.output?.slide || {})

    if (!nextSlide.title || !nextSlide.content) {
      error.value = "La IA devolvió una mejora inválida para la slide."
      return
    }

    aiFeedback.value = String(response.output?.rationale || "")
    improvedSlidePreview.value = nextSlide

    const nextSlides = slides.value.map((slide, index) => (
      index === selectedSlideIndex.value
        ? {...slide, ...nextSlide}
        : slide
    ))

    await persistTraining({
      ...training.value,
      slides: nextSlides,
    }, "Slide mejorada y guardada.")
  } catch (err) {
    console.error("Error improving slide:", err)
    error.value = "No fue posible mejorar la slide con IA."
  } finally {
    aiLoading.value = ""
  }
}

async function handleGenerateQuiz() {
  if (!training.value || !selectedSlide.value) return
  if (!quizPrompt.value.trim()) {
    error.value = "Ingresá un prompt para generar el quiz de la slide seleccionada."
    return
  }

  aiLoading.value = "quiz"
  error.value = ""
  successMessage.value = ""

  try {
    const response = await provider.generateQuizFromPrompt(
      training.value,
      selectedSlide.value,
      quizPrompt.value.trim(),
    )
    const nextQuiz = normalizeQuiz(response.output?.quiz)

    if (!nextQuiz.length) {
      error.value = "La IA no devolvió preguntas válidas para el quiz."
      return
    }

    aiFeedback.value = String(response.output?.rationale || "")
    generatedQuizPreview.value = nextQuiz

    const nextSlides = slides.value.map((slide, index) => (
      index === selectedSlideIndex.value
        ? {...slide, quiz: nextQuiz}
        : slide
    ))

    await persistTraining({
      ...training.value,
      slides: nextSlides,
    }, "Quiz generado y guardado en la slide seleccionada.")
  } catch (err) {
    console.error("Error generating quiz:", err)
    error.value = "No fue posible generar el quiz con IA."
  } finally {
    aiLoading.value = ""
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function buildSlidePreviewHtml(slide: TrainingSlide | null) {
  if (!slide) return ""

  const themeCss = String(training.value?.globalSlideCss || "").trim()
  const styleTag = themeCss ? `<style>${themeCss}</style>` : ""

  const body = slide.contentType === "html"
    ? String(slide.content || "")
    : `<article class="slide-preview-markdown">${escapeHtml(String(slide.content || "")).replaceAll("\n", "<br>")}</article>`

  return `${styleTag}<div class="slide-preview-scope">${body}</div>`
}

async function handleChangeSelectedSlideContentType(contentType: "markdown" | "html" | null) {
  if (!training.value || !selectedSlide.value) return
  if (contentType !== "markdown" && contentType !== "html") return
  if (selectedSlide.value.contentType === contentType) return

  const nextSlides = slides.value.map((slide, index) => (
    index === selectedSlideIndex.value
      ? {...slide, contentType}
      : slide
  ))

  if (improvedSlidePreview.value) {
    improvedSlidePreview.value = {
      ...improvedSlidePreview.value,
      contentType,
    }
  }

  await persistTraining({
    ...training.value,
    slides: nextSlides,
  }, `Content type actualizado a ${contentType}.`)
}

watch(() => props.trainingId, () => {
  void loadTraining()
})

watch(selectedSlideIndex, () => {
  improvedSlidePreview.value = null
  generatedQuizPreview.value = []
  successMessage.value = ""
  error.value = ""
})

onMounted(() => {
  void loadTraining()
})
</script>

<template>
  <v-container fluid class="px-0 training-improve-page">
    <v-container class="py-4 py-md-8">
      <v-skeleton-loader
        v-if="loading"
        type="article, actions, image"
      />

      <v-alert
        v-else-if="error && !training"
        type="error"
        variant="tonal"
        border="start"
      >
        {{ error }}
      </v-alert>

      <template v-else-if="training">
        <div class="d-flex flex-column flex-lg-row align-lg-center justify-space-between ga-4 mb-6">
          <div>
            <div class="d-flex flex-wrap align-center ga-2 mb-2">
              <v-chip size="small" color="primary" variant="flat">
                {{ training.category || "Training" }}
              </v-chip>
              <v-chip size="small" variant="outlined">
                {{ training.status }}
              </v-chip>
            </div>

            <h1 class="text-h4 font-weight-bold mb-2">{{ training.name }}</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              {{ training.description || "Usá IA para definir el theme visual y mejorar el contenido de las slides." }}
            </p>
          </div>

          <div class="text-body-2 text-medium-emphasis">
            {{ slides.length }} slide<span v-if="slides.length !== 1">s</span>
          </div>
        </div>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          border="start"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          border="start"
          class="mb-4"
        >
          {{ successMessage }}
        </v-alert>

        <v-row>
          <v-col cols="12" lg="3">
            <v-card rounded="xl" class="mb-4">
              <v-card-item>
                <v-card-title>Slides del training</v-card-title>
                <v-card-subtitle>Seleccioná una para pedir mejoras a la IA.</v-card-subtitle>
              </v-card-item>
              <v-divider />
              <v-list lines="two" class="py-0">
                <v-list-item
                  v-for="(slide, index) in slides"
                  :key="`${slide.title}-${index}`"
                  :active="selectedSlideIndex === index"
                  color="primary"
                  @click="selectedSlideIndex = index"
                >
                  <template #prepend>
                    <v-avatar size="32" color="primary" variant="tonal">
                      {{ index + 1 }}
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ slide.title || `Slide ${index + 1}` }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ slide.subtitle || slide.contentType || "Sin subtítulo" }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="!slides.length">
                  <v-list-item-title>No hay slides todavía.</v-list-item-title>
                  <v-list-item-subtitle>Generá la primera con un prompt.</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>

            <v-card rounded="xl">
              <v-card-item>
                <v-card-title>Estado actual</v-card-title>
              </v-card-item>
              <v-card-text class="text-body-2 text-medium-emphasis">
                <div class="mb-3">
                  CSS global:
                  {{ training.globalSlideCss ? "configurado" : "vacío" }}
                </div>
                <div class="mb-3">
                  Slide seleccionada:
                  {{ selectedSlide?.title || "ninguna" }}
                </div>
                <div class="mb-3">
                  Preguntas en la slide:
                  {{ selectedSlide?.quiz?.length || 0 }}
                </div>
                <div v-if="aiFeedback">
                  Motivo IA: {{ aiFeedback }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="9">
            <v-card rounded="xl" class="overflow-hidden">
              <v-tabs
                v-model="activeTab"
                color="primary"
                bg-color="transparent"
                grow
              >
                <v-tab value="theme">Theme CSS</v-tab>
                <v-tab value="slide">Nueva slide</v-tab>
                <v-tab value="improve">Mejorar slide</v-tab>
                <v-tab value="quiz">Generar quiz</v-tab>
              </v-tabs>

              <v-divider />

              <v-window v-model="activeTab">
                <v-window-item value="theme">
                  <v-card-item>
                    <v-card-title>1. Generar theme CSS</v-card-title>
                    <v-card-subtitle>Se guarda en `globalSlideCss`.</v-card-subtitle>
                  </v-card-item>
                  <v-card-text>
                    <v-textarea
                      v-model="themePrompt"
                      label="Prompt del theme"
                      placeholder="Ej: Tema sobrio corporativo, con tipografía amplia, cards claras y acentos azul petróleo."
                      rows="3"
                      auto-grow
                      variant="outlined"
                    />
                    <div class="d-flex justify-end mb-4">
                      <v-btn
                        color="primary"
                        :loading="aiLoading === 'theme' || saving"
                        @click="handleGenerateTheme"
                      >
                        Generar y guardar theme
                      </v-btn>
                    </div>
                    <v-textarea
                      :model-value="themePreview"
                      label="Preview CSS"
                      rows="12"
                      auto-grow
                      variant="outlined"
                      readonly
                    />
                  </v-card-text>
                </v-window-item>

                <v-window-item value="slide">
                  <v-card-item>
                    <v-card-title>2. Generar nueva slide</v-card-title>
                    <v-card-subtitle>La IA crea contenido y se agrega al training.</v-card-subtitle>
                  </v-card-item>
                  <v-card-text>
                    <v-textarea
                      v-model="newSlidePrompt"
                      label="Prompt de la nueva slide"
                      placeholder="Ej: Crear una slide inicial sobre onboarding comercial con objetivos, tono cercano y estructura visual moderna."
                      rows="3"
                      auto-grow
                      variant="outlined"
                    />
                    <div class="d-flex justify-end mb-4">
                      <v-btn
                        color="primary"
                        variant="flat"
                        :loading="aiLoading === 'slide' || saving"
                        @click="handleGenerateSlide"
                      >
                        Generar slide
                      </v-btn>
                    </div>

                    <v-card
                      v-if="generatedSlidePreview"
                      variant="tonal"
                      color="primary"
                      class="pa-4"
                    >
                      <div class="text-overline mb-2">Última slide generada</div>
                      <div class="d-flex align-center justify-space-between ga-3 mb-3">
                        <div class="text-medium-emphasis">
                          Content type: {{ generatedSlidePreview.contentType }}
                        </div>
                      </div>
                      <div class="text-h6 mb-1">{{ generatedSlidePreview.title }}</div>
                      <div v-if="generatedSlidePreview.subtitle" class="text-body-2 mb-3">
                        {{ generatedSlidePreview.subtitle }}
                      </div>
                      <div
                        v-if="generatedSlidePreview"
                        class="slide-preview-content"
                        v-html="buildSlidePreviewHtml(generatedSlidePreview)"
                      />
                    </v-card>
                  </v-card-text>
                </v-window-item>

                <v-window-item value="improve">
                  <v-card-item>
                    <v-card-title>3. Mejorar slide seleccionada</v-card-title>
                    <v-card-subtitle>La IA puede mejorar contenido, claridad o diseño.</v-card-subtitle>
                  </v-card-item>
                  <v-card-text>
                    <v-textarea
                      v-model="improvePrompt"
                      label="Prompt de mejora"
                      placeholder="Ej: Hacé esta slide más persuasiva, con jerarquía visual clara y bullets más concretos."
                      rows="3"
                      auto-grow
                      variant="outlined"
                      :disabled="!selectedSlide"
                    />
                    <div class="d-flex justify-end mb-4">
                      <v-btn
                        color="primary"
                        variant="outlined"
                        :loading="aiLoading === 'improve' || saving"
                        :disabled="!selectedSlide"
                        @click="handleImproveSlide"
                      >
                        Mejorar slide
                      </v-btn>
                    </div>

                    <v-card variant="outlined" class="fill-height overflow-hidden">
                      <v-tabs
                        v-model="improvePreviewTab"
                        color="primary"
                        bg-color="transparent"
                        grow
                      >
                        <v-tab value="current">Slide actual</v-tab>
                        <v-tab value="improved">Preview mejorada</v-tab>
                      </v-tabs>

                      <v-divider />

                      <v-window v-model="improvePreviewTab">
                        <v-window-item value="current">
                          <v-card-item>
                            <v-card-title class="text-subtitle-1">Slide actual</v-card-title>
                          </v-card-item>
                          <v-card-text v-if="selectedSlide">
                            <div class="d-flex align-center justify-space-between ga-3 mb-3">
                              <v-chip size="small" variant="tonal">
                                {{ selectedSlide.contentType }}
                              </v-chip>
                              <v-select
                                :model-value="selectedSlide.contentType"
                                :items="slideContentTypeOptions"
                                label="Content type"
                                density="compact"
                                variant="outlined"
                                hide-details
                                class="content-type-select"
                                :disabled="saving"
                                @update:model-value="(value) => handleChangeSelectedSlideContentType(value as 'markdown' | 'html' | null)"
                              />
                            </div>
                            <div class="text-h6 mb-1">{{ selectedSlide.title }}</div>
                            <div v-if="selectedSlide.subtitle" class="text-body-2 mb-3">
                              {{ selectedSlide.subtitle }}
                            </div>
                            <div
                              class="slide-preview-content"
                              v-html="buildSlidePreviewHtml(selectedSlide)"
                            />
                          </v-card-text>
                          <v-card-text v-else class="text-medium-emphasis">
                            Seleccioná una slide para ver su contenido actual.
                          </v-card-text>
                        </v-window-item>

                        <v-window-item value="improved">
                          <v-card-item>
                            <v-card-title class="text-subtitle-1">Preview mejorada</v-card-title>
                          </v-card-item>
                          <v-card-text v-if="improvedSlidePreview">
                            <div class="d-flex align-center justify-space-between ga-3 mb-3">
                              <v-chip size="small" variant="tonal">
                                {{ improvedSlidePreview.contentType }}
                              </v-chip>
                              <div class="text-body-2 text-medium-emphasis">
                                Usa el selector de la slide actual para cambiar entre markdown y html.
                              </div>
                            </div>
                            <div class="text-h6 mb-1">{{ improvedSlidePreview.title }}</div>
                            <div v-if="improvedSlidePreview.subtitle" class="text-body-2 mb-3">
                              {{ improvedSlidePreview.subtitle }}
                            </div>
                            <div
                              class="slide-preview-content"
                              v-html="buildSlidePreviewHtml(improvedSlidePreview)"
                            />
                          </v-card-text>
                          <v-card-text v-else class="text-medium-emphasis">
                            La preview aparecerá después de ejecutar la mejora.
                          </v-card-text>
                        </v-window-item>
                      </v-window>
                    </v-card>
                  </v-card-text>
                </v-window-item>

                <v-window-item value="quiz">
                  <v-card-item>
                    <v-card-title>4. Generar quiz para la slide</v-card-title>
                    <v-card-subtitle>La IA crea o reemplaza el `quiz` de la slide seleccionada.</v-card-subtitle>
                  </v-card-item>
                  <v-card-text>
                    <v-textarea
                      v-model="quizPrompt"
                      label="Prompt del quiz"
                      placeholder="Ej: Generá 3 preguntas para validar comprensión, con 2 de opción múltiple y 1 abierta, enfocadas en conceptos clave."
                      rows="3"
                      auto-grow
                      variant="outlined"
                      :disabled="!selectedSlide"
                    />
                    <div class="d-flex justify-end mb-4">
                      <v-btn
                        color="primary"
                        variant="tonal"
                        :loading="aiLoading === 'quiz' || saving"
                        :disabled="!selectedSlide"
                        @click="handleGenerateQuiz"
                      >
                        Generar quiz
                      </v-btn>
                    </div>

                    <v-card variant="outlined" class="pa-4">
                      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-3 mb-4">
                        <div>
                          <div class="text-overline">Slide objetivo</div>
                          <div class="text-h6">{{ selectedSlide?.title || "Ninguna slide seleccionada" }}</div>
                        </div>
                        <v-chip size="small" variant="tonal">
                          {{ generatedQuizPreview.length || selectedSlide?.quiz?.length || 0 }} pregunta<span v-if="(generatedQuizPreview.length || selectedSlide?.quiz?.length || 0) !== 1">s</span>
                        </v-chip>
                      </div>

                      <template v-if="generatedQuizPreview.length">
                        <div class="text-subtitle-1 mb-3">Preview generado</div>
                        <v-expansion-panels variant="accordion">
                          <v-expansion-panel
                            v-for="(question, index) in generatedQuizPreview"
                            :key="`${question.question}-${index}`"
                          >
                            <v-expansion-panel-title>
                              <div class="d-flex flex-column">
                                <span>{{ index + 1 }}. {{ question.question }}</span>
                                <span class="text-caption text-medium-emphasis">{{ question.type }}</span>
                              </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <div v-if="question.description" class="mb-3 text-body-2">
                                {{ question.description }}
                              </div>
                              <v-list v-if="question.answers?.length" density="compact" class="py-0 mb-3">
                                <v-list-item
                                  v-for="(answer, answerIndex) in question.answers"
                                  :key="`${answer.answer}-${answerIndex}`"
                                >
                                  <v-list-item-title>
                                    {{ answer.answer }}
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ answer.isCorrect ? "Correcta" : "Incorrecta" }}
                                    <span v-if="answer.points"> · {{ answer.points }} pts</span>
                                    <span v-if="answer.feedback"> · {{ answer.feedback }}</span>
                                  </v-list-item-subtitle>
                                </v-list-item>
                              </v-list>
                              <div v-if="question.explanation" class="text-body-2 text-medium-emphasis">
                                Explicación: {{ question.explanation }}
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </template>

                      <template v-else-if="selectedSlide?.quiz?.length">
                        <div class="text-subtitle-1 mb-3">Quiz actual</div>
                        <v-expansion-panels variant="accordion">
                          <v-expansion-panel
                            v-for="(question, index) in selectedSlide.quiz"
                            :key="`${question.question}-${index}`"
                          >
                            <v-expansion-panel-title>
                              <div class="d-flex flex-column">
                                <span>{{ index + 1 }}. {{ question.question }}</span>
                                <span class="text-caption text-medium-emphasis">{{ question.type }}</span>
                              </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <div v-if="question.description" class="mb-3 text-body-2">
                                {{ question.description }}
                              </div>
                              <v-list v-if="question.answers?.length" density="compact" class="py-0 mb-3">
                                <v-list-item
                                  v-for="(answer, answerIndex) in question.answers"
                                  :key="`${answer.answer}-${answerIndex}`"
                                >
                                  <v-list-item-title>
                                    {{ answer.answer }}
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ answer.isCorrect ? "Correcta" : "Incorrecta" }}
                                    <span v-if="answer.points"> · {{ answer.points }} pts</span>
                                    <span v-if="answer.feedback"> · {{ answer.feedback }}</span>
                                  </v-list-item-subtitle>
                                </v-list-item>
                              </v-list>
                              <div v-if="question.explanation" class="text-body-2 text-medium-emphasis">
                                Explicación: {{ question.explanation }}
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </template>

                      <div v-else class="text-medium-emphasis">
                        Seleccioná una slide y ejecutá la generación para ver el quiz.
                      </div>
                    </v-card>
                  </v-card-text>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-container>
</template>

<style scoped>
.training-improve-page {
  background:
    radial-gradient(circle at top left, rgba(var(--v-theme-primary), 0.12), transparent 28%),
    linear-gradient(180deg, rgba(244, 248, 252, 1) 0%, rgba(255, 255, 255, 1) 100%);
  min-height: 100%;
}

.slide-preview-content {
  overflow-wrap: anywhere;
}

.slide-preview-content :deep(.slide-preview-scope) {
  overflow-wrap: anywhere;
}

.slide-preview-content :deep(.slide-preview-markdown) {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: inherit;
}

.content-type-select {
  max-width: 180px;
}
</style>
