<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {ITrainingQuizQuestion} from "../interfaces/ITraining";

interface Props {
  questions?: Array<ITrainingQuizQuestion>
  quizKey: string
  initiallyOpen?: boolean
  title?: string
  subtitle?: string
  startLabel?: string
  hideActivator?: boolean
  compact?: boolean
}

type QuestionStatus = "idle" | "correct" | "incorrect" | "unavailable"

const props = withDefaults(defineProps<Props>(), {
  questions: () => [],
  initiallyOpen: false,
  title: "Quiz del slide",
  subtitle: "",
  startLabel: "Iniciar quiz",
  hideActivator: false,
  compact: false,
})

const isOpen = ref(props.initiallyOpen)
const openTextAnswers = ref<Record<number, string>>({})
const selectedAnswers = ref<Record<number, Array<number>>>({})
const checkedQuestions = ref<Record<number, QuestionStatus>>({})
const feedbackMessages = ref<Record<number, string>>({})
const explanationVisible = ref<Record<number, boolean>>({})

const questionCountLabel = computed(() => {
  const count = props.questions.length
  return `${count} pregunta${count === 1 ? "" : "s"}`
})

watch(() => props.quizKey, () => {
  isOpen.value = props.initiallyOpen
  openTextAnswers.value = {}
  selectedAnswers.value = {}
  checkedQuestions.value = {}
  feedbackMessages.value = {}
  explanationVisible.value = {}
})

watch(() => props.initiallyOpen, (nextValue) => {
  isOpen.value = nextValue
})

function getSelectedAnswers(quizIndex: number) {
  return selectedAnswers.value[quizIndex] || []
}

function setSingleAnswer(quizIndex: number, answerIndex: number | null) {
  selectedAnswers.value[quizIndex] = answerIndex === null ? [] : [answerIndex]
  checkedQuestions.value[quizIndex] = "idle"
  feedbackMessages.value[quizIndex] = ""
}

function toggleMultipleAnswer(quizIndex: number, answerIndex: number, checked: boolean | null) {
  const current = new Set(selectedAnswers.value[quizIndex] || [])

  if (checked) current.add(answerIndex)
  else current.delete(answerIndex)

  selectedAnswers.value[quizIndex] = Array.from(current)
  checkedQuestions.value[quizIndex] = "idle"
  feedbackMessages.value[quizIndex] = ""
}

function getOpenTextAnswer(quizIndex: number) {
  return openTextAnswers.value[quizIndex] || ""
}

function setOpenTextAnswer(quizIndex: number, value: string) {
  openTextAnswers.value[quizIndex] = value
  checkedQuestions.value[quizIndex] = "idle"
  feedbackMessages.value[quizIndex] = ""
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function verifyQuestion(question: ITrainingQuizQuestion, quizIndex: number) {
  const answers = Array.isArray(question.answers) ? question.answers : []
  const correctIndexes = answers
    .map((answer, answerIndex) => answer.isCorrect ? answerIndex : -1)
    .filter((answerIndex) => answerIndex >= 0)

  if (question.type === "open_text") {
    const userAnswer = normalizeText(getOpenTextAnswer(quizIndex))
    const validAnswers = answers
      .filter((answer) => answer.isCorrect && answer.answer)
      .map((answer) => normalizeText(answer.answer))

    if (!validAnswers.length) {
      checkedQuestions.value[quizIndex] = "unavailable"
      feedbackMessages.value[quizIndex] = "Esta pregunta no tiene una respuesta configurada para corrección automática."
      return
    }

    const isCorrect = validAnswers.includes(userAnswer)
    checkedQuestions.value[quizIndex] = isCorrect ? "correct" : "incorrect"
    feedbackMessages.value[quizIndex] = isCorrect
      ? "Respuesta correcta."
      : "La respuesta no coincide con la esperada."
    return
  }

  if (!correctIndexes.length) {
    checkedQuestions.value[quizIndex] = "unavailable"
    feedbackMessages.value[quizIndex] = "Esta pregunta no tiene opciones correctas configuradas para corrección automática."
    return
  }

  const selected = [...getSelectedAnswers(quizIndex)].sort((a, b) => a - b)
  const expected = [...correctIndexes].sort((a, b) => a - b)
  const isCorrect = selected.length === expected.length && selected.every((value, index) => value === expected[index])

  checkedQuestions.value[quizIndex] = isCorrect ? "correct" : "incorrect"
  feedbackMessages.value[quizIndex] = isCorrect
    ? "Respuesta correcta."
    : "La respuesta seleccionada no es correcta."
}

function toggleExplanation(quizIndex: number) {
  explanationVisible.value[quizIndex] = !explanationVisible.value[quizIndex]
}

function getAlertType(status: QuestionStatus) {
  if (status === "correct") return "success"
  if (status === "incorrect") return "error"
  return "info"
}

function getExplanationButtonLabel(quizIndex: number) {
  return explanationVisible.value[quizIndex] ? "Ocultar explicación" : "Ver explicación"
}

function getAnswerLabel(answer: string, answerIndex: number) {
  return `${answerIndex + 1}. ${answer}`
}
</script>

<template>
  <div class="training-quiz-panel">
    <div
      v-if="!hideActivator"
      class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-3 mb-4"
    >
      <div>
        <div class="text-subtitle-1 font-weight-bold">{{ title }}</div>
        <div class="text-body-2 text-medium-emphasis">
          {{ subtitle || questionCountLabel }}
        </div>
      </div>

      <v-btn
        variant="flat"
        color="primary"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? "Ocultar quiz" : startLabel }}
      </v-btn>
    </div>

    <div v-if="isOpen" class="d-flex flex-column ga-4">
      <v-card
        v-for="(question, quizIndex) in questions"
        :key="`${question.question}-${quizIndex}`"
        variant="outlined"
        rounded="xl"
      >
        <v-card-text :class="compact ? 'pa-4' : 'pa-4 pa-md-5'">
          <div class="text-overline mb-2">Pregunta {{ quizIndex + 1 }}</div>
          <div class="text-subtitle-1 font-weight-bold mb-2">
            {{ question.question }}
          </div>
          <p v-if="question.description" class="text-body-2 text-medium-emphasis mb-4">
            {{ question.description }}
          </p>

          <div v-if="question.type === 'single_choice'" class="d-flex flex-column ga-3">
            <v-radio-group
              :model-value="getSelectedAnswers(quizIndex)[0] ?? null"
              color="primary"
              hide-details
              @update:model-value="setSingleAnswer(quizIndex, $event)"
            >
              <v-radio
                v-for="(answer, answerIndex) in question.answers || []"
                :key="`${answer.answer}-${answerIndex}`"
                :label="getAnswerLabel(answer.answer, answerIndex)"
                :value="answerIndex"
              />
            </v-radio-group>
          </div>

          <div v-else-if="question.type === 'multiple_choice'" class="d-flex flex-column ga-2">
            <v-checkbox
              v-for="(answer, answerIndex) in question.answers || []"
              :key="`${answer.answer}-${answerIndex}`"
              :label="getAnswerLabel(answer.answer, answerIndex)"
              :model-value="getSelectedAnswers(quizIndex).includes(answerIndex)"
              color="primary"
              hide-details
              @update:model-value="toggleMultipleAnswer(quizIndex, answerIndex, $event)"
            />
          </div>

          <div v-else>
            <v-textarea
              :model-value="getOpenTextAnswer(quizIndex)"
              label="Tu respuesta"
              variant="outlined"
              rows="4"
              hide-details
              @update:model-value="setOpenTextAnswer(quizIndex, String($event || ''))"
            />
          </div>

          <div class="d-flex flex-wrap ga-3 mt-4">
            <v-btn
              color="primary"
              variant="flat"
              @click="verifyQuestion(question, quizIndex)"
            >
              Verificar respuesta
            </v-btn>

            <v-btn
              v-if="question.explanation"
              variant="tonal"
              @click="toggleExplanation(quizIndex)"
            >
              {{ getExplanationButtonLabel(quizIndex) }}
            </v-btn>
          </div>

          <v-alert
            v-if="checkedQuestions[quizIndex] && feedbackMessages[quizIndex]"
            :type="getAlertType(checkedQuestions[quizIndex])"
            variant="tonal"
            class="mt-4"
          >
            {{ feedbackMessages[quizIndex] }}
          </v-alert>

          <v-alert
            v-if="question.explanation && explanationVisible[quizIndex]"
            type="info"
            variant="tonal"
            class="mt-4"
          >
            {{ question.explanation }}
          </v-alert>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
