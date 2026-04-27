<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import TrainingProvider from "../providers/TrainingProvider";
import type {ITraining} from "../interfaces/ITraining";

const provider = TrainingProvider.instance

const trainings = ref<ITraining[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref("")
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

const hasTrainings = computed(() => trainings.value.length > 0)
const hasMorePages = computed(() => currentPage.value < totalPages.value)

async function fetchTrainings(page: number = 1) {
  const isFirstPage = page === 1

  if (isFirstPage) {
    loading.value = true
    error.value = ""
  } else {
    loadingMore.value = true
  }

  try {
    const result = await provider.paginate({
      page,
      limit: 24,
      orderBy: "publishedAt",
      order: "desc",
    })

    const items = result.items || []

    trainings.value = isFirstPage
      ? items
      : [...trainings.value, ...items]

    currentPage.value = result.page || page
    totalItems.value = result.total || items.length
    totalPages.value = Math.max(
      1,
      Math.ceil((result.total || items.length) / (result.limit || 24))
    )
  } catch (err) {
    console.error("Error loading trainings:", err)
    error.value = "No fue posible cargar los entrenamientos disponibles en este momento."
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function loadMore() {
  if (!hasMorePages.value || loading.value || loadingMore.value) {
    return
  }

  await fetchTrainings(currentPage.value + 1)
}

function formatDate(date?: Date) {
  if (!date) return ""

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

function getSlideCount(training: ITraining) {
  return (training.slides || []).filter((slide) => slide.enabled !== false).length
}

function getQuizCount(training: ITraining) {
  return (training.slides || []).reduce((count, slide) => {
    return count + (slide.quiz?.length || 0)
  }, 0)
}

function getTrainingTags(training: ITraining) {
  return training.tags || []
}

onMounted(() => {
  void fetchTrainings()
})
</script>

<template>
  <v-container fluid class="training-gallery px-0">
    <section class="gallery-hero">
      <v-container class="py-10 py-md-14">
        <div class="hero-shell">
          <div class="hero-copy">
            <v-chip
              color="primary"
              variant="flat"
              size="small"
              class="mb-4"
            >
              Biblioteca de trainings
            </v-chip>

            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              Navegá entrenamientos completos para presentar, aprender o adaptar
            </h1>

            <p class="text-body-1 text-md-h6 mb-6 hero-support-text">
              Encontrá capacitaciones con slides, materiales y cuestionarios listas para abrir en modo presentación.
            </p>

            <div class="hero-stats">
              <div class="hero-stat-card">
                <div class="text-h5 font-weight-bold">{{ totalItems || trainings.length }}</div>
                <div class="text-body-2 hero-support-text">Trainings detectados</div>
              </div>

              <div class="hero-stat-card">
                <div class="text-h5 font-weight-bold">{{ currentPage }}</div>
                <div class="text-body-2 hero-support-text">Página actual</div>
              </div>

              <div class="hero-stat-card">
                <div class="text-h5 font-weight-bold">{{ totalPages }}</div>
                <div class="text-body-2 hero-support-text">Páginas totales</div>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <v-container class="py-8 py-md-10">
      <v-skeleton-loader
        v-if="loading"
        type="image, article, actions"
        class="mb-6"
      />

      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        border="start"
      >
        {{ error }}
      </v-alert>

      <template v-else-if="hasTrainings">
        <div class="d-flex flex-column flex-md-row align-md-end justify-space-between mb-6 ga-3">
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">Galería de trainings</h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ trainings.length }} cargados de {{ totalItems }} disponibles
            </p>
          </div>

          <v-btn
            v-if="hasMorePages"
            color="primary"
            variant="outlined"
            :loading="loadingMore"
            @click="loadMore"
          >
            Cargar más
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="training in trainings"
            :key="training._id"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="catalog-card h-100"
              elevation="0"
              :to="{ name: 'TrainingPage', params: { trainingId: training.slug || training._id } }"
            >
              <v-card-text class="catalog-card-content pa-6">
                <div class="d-flex flex-wrap ga-2 mb-4">
                  <v-chip
                    size="small"
                    color="primary"
                    variant="flat"
                  >
                    {{ training.category || "Training" }}
                  </v-chip>

                  <v-chip
                    v-if="training.status"
                    size="small"
                    variant="tonal"
                  >
                    {{ training.status }}
                  </v-chip>
                </div>

                <div class="d-flex align-center justify-space-between ga-3 mb-3">
                  <div class="text-overline text-medium-emphasis">
                    {{ formatDate(training.publishedAt || training.updatedAt || training.createdAt) || "Sin fecha publicada" }}
                  </div>

                  <v-chip size="small" variant="outlined">
                    {{ getSlideCount(training) }} slides
                  </v-chip>
                </div>

                <h3 class="text-h6 font-weight-bold mb-3">
                  {{ training.name }}
                </h3>

                <p class="text-body-2 text-medium-emphasis mb-4 catalog-description">
                  {{ training.description || "Entrenamiento listo para explorar, presentar y adaptar según el contexto de formación." }}
                </p>

                <div class="d-flex flex-wrap ga-2 mb-4">
                  <v-chip size="small" variant="outlined">
                    {{ getQuizCount(training) }} preguntas
                  </v-chip>

                  <v-chip
                    v-if="training.isPublic"
                    size="small"
                    color="success"
                    variant="tonal"
                  >
                    Público
                  </v-chip>
                </div>

                <div
                  v-if="getTrainingTags(training).length"
                  class="d-flex flex-wrap ga-2"
                >
                  <v-chip
                    v-for="tag in getTrainingTags(training)"
                    :key="tag"
                    size="small"
                    variant="outlined"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-actions class="px-6 pb-6 pt-0">
                <v-btn
                  color="primary"
                  variant="flat"
                  block
                >
                  Ver training
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div
          v-if="hasMorePages"
          class="d-flex justify-center mt-8"
        >
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            :loading="loadingMore"
            @click="loadMore"
          >
            Cargar página {{ currentPage + 1 }} de {{ totalPages }}
          </v-btn>
        </div>
      </template>

      <v-alert
        v-else
        type="info"
        variant="tonal"
      >
        No hay trainings disponibles para mostrar.
      </v-alert>
    </v-container>
  </v-container>
</template>

<style scoped>
.training-gallery {
  min-height: 100%;
}

.gallery-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(var(--v-theme-primary), 0.24), transparent 32%),
    linear-gradient(135deg, rgba(10, 17, 30, 0.98), rgba(20, 31, 47, 0.94));
  color: rgba(255, 255, 255, 0.96);
}

.gallery-hero::after {
  content: "";
  position: absolute;
  inset: auto -100px -120px auto;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  filter: blur(8px);
}

.hero-shell {
  position: relative;
  z-index: 1;
}

.hero-copy {
  max-width: 960px;
}

.hero-support-text {
  color: rgba(255, 255, 255, 0.82);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.hero-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

.catalog-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background:
    linear-gradient(180deg, rgba(var(--v-theme-surface), 1), rgba(var(--v-theme-surface), 0.95));
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.catalog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.24);
}

.catalog-card-content {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.catalog-description {
  min-height: 4.5em;
}
</style>
