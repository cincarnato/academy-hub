<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import ConceptCatalogProvider from "../providers/ConceptCatalogProvider";
import type {IConceptCatalog} from "../interfaces/IConceptCatalog";

interface Props {
  catalogId: string
}

const props = defineProps<Props>()
const provider = ConceptCatalogProvider.instance

const loading = ref(false)
const error = ref("")
const catalog = ref<IConceptCatalog | null>(null)

const concepts = computed(() => catalog.value?.concepts || [])
const stats = computed(() => [
  {label: "Conceptos", value: concepts.value.length},
  {label: "Con utilidad", value: concepts.value.filter((concept) => Boolean(concept.utility?.trim())).length},
  {label: "Con ejemplo", value: concepts.value.filter((concept) => Boolean(concept.example?.trim())).length},
])

const updatedAtText = computed(() => formatDate(catalog.value?.updatedAt || catalog.value?.createdAt))

async function loadCatalog() {
  if (!props.catalogId) {
    catalog.value = null
    error.value = "No se recibió un identificador de catálogo."
    return
  }

  loading.value = true
  error.value = ""

  try {
    catalog.value = await provider.findById(props.catalogId)
  } catch (err) {
    console.error("Error loading concept catalog:", err)
    catalog.value = null
    error.value = "No fue posible cargar este catálogo de conceptos en este momento."
  } finally {
    loading.value = false
  }
}

function formatDate(date?: Date) {
  if (!date) return ""

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

onMounted(() => {
  void loadCatalog()
})

watch(() => props.catalogId, () => {
  void loadCatalog()
})
</script>

<template>
  <v-container fluid class="concept-catalog-page px-0">
    <section class="concept-hero">
      <v-container class="py-10 py-md-14">
        <v-skeleton-loader
          v-if="loading"
          type="article, actions"
          class="hero-skeleton"
        />

        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          border="start"
          class="mx-auto"
          max-width="960"
        >
          {{ error }}
        </v-alert>

        <template v-else-if="catalog">
          <v-row align="stretch" class="ga-0">
            <v-col cols="12">
              <div class="hero-copy">
                <div class="d-flex flex-wrap align-center ga-3 mb-5">
                  <v-chip color="secondary" variant="flat" size="small">
                    Catálogo conceptual
                  </v-chip>

                  <v-chip variant="outlined" size="small">
                    {{ catalog.slug }}
                  </v-chip>

                  <span v-if="updatedAtText" class="text-body-2 hero-meta-text">
                    Actualizado el {{ updatedAtText }}
                  </span>
                </div>

                <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
                  {{ catalog.title }}
                </h1>

                <p class="text-body-1 text-md-h6 mb-6 hero-description hero-support-text">
                  {{ catalog.descripcion || "Un catálogo diseñado para ordenar ideas, fijar conceptos clave y bajar teoría a ejemplos concretos." }}
                </p>

                <div class="d-flex flex-wrap ga-3">
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="stat-card"
                  >
                    <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
                    <div class="text-body-2 hero-support-text">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </section>

    <v-container
      v-if="catalog && !loading && !error"
      class="py-8 py-md-10"
    >
      <div class="mb-6">
        <h2 class="text-h5 font-weight-bold mb-1">Desarrollo de conceptos</h2>
        <p class="text-body-2 text-medium-emphasis">
          {{ concepts.length }} concepto<span v-if="concepts.length !== 1">s</span> para revisar, estudiar o reutilizar en sesiones de formación.
        </p>
      </div>

      <v-row v-if="concepts.length">
        <v-col
          v-for="(concept, index) in concepts"
          :key="`${concept.name}-${index}`"
          cols="12"
        >
          <v-card class="concept-card" elevation="0">
            <v-card-text class="pa-6 pa-md-7">
              <div class="concept-card-shell">
                <div class="concept-card-rail">
                  <div class="concept-index">
                    {{ index + 1 }}
                  </div>
                </div>

                <div class="concept-card-content">
                  <div class="mb-5">
                    <div class="text-overline text-medium-emphasis mb-2">Concepto</div>
                    <h3 class="text-h5 text-md-h4 font-weight-bold mb-0">{{ concept.name }}</h3>
                  </div>

                  <div v-if="concept.explanation" class="concept-section concept-section-featured mb-4">
                    <div class="text-overline text-medium-emphasis mb-2">Explicación</div>
                    <p class="text-body-1 mb-0 concept-text">{{ concept.explanation }}</p>
                  </div>

                  <div
                    v-if="concept.utility || concept.example"
                    class="concept-support-grid"
                  >
                    <div
                      v-if="concept.utility"
                      class="concept-section"
                    >
                      <div class="text-overline text-medium-emphasis mb-2">Utilidad</div>
                      <p class="text-body-2 mb-0 concept-text">{{ concept.utility }}</p>
                    </div>

                    <div
                      v-if="concept.example"
                      class="concept-section"
                    >
                      <div class="text-overline text-medium-emphasis mb-2">Ejemplo</div>
                      <p class="text-body-2 mb-0 concept-text">{{ concept.example }}</p>
                    </div>
                  </div>

                  <div
                    v-else-if="!concept.explanation"
                    class="text-body-2 text-medium-emphasis"
                  >
                    Este concepto todavía no tiene desarrollo cargado.
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-alert
        v-else
        type="info"
        variant="tonal"
        border="start"
      >
        Este catálogo no tiene conceptos cargados todavía.
      </v-alert>
    </v-container>
  </v-container>
</template>

<style scoped>
.concept-catalog-page {
  min-height: 100%;
  background:
    linear-gradient(180deg, rgba(245, 248, 247, 1) 0%, rgba(255, 255, 255, 1) 240px);
}

.concept-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.28), transparent 30%),
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 24%),
    linear-gradient(145deg, #0f172a, #11352f 58%, #163c4a);
  color: rgba(255, 255, 255, 0.96);
}

.concept-hero::after {
  content: "";
  position: absolute;
  inset: auto auto -140px -80px;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  filter: blur(10px);
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.hero-meta-text {
  color: rgba(255, 255, 255, 0.78);
}

.hero-support-text {
  color: rgba(236, 253, 245, 0.88);
}

.hero-skeleton {
  max-width: 960px;
  margin: 0 auto;
}

.stat-card {
  min-width: 120px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.concept-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 18px;
  font-weight: 700;
  background: rgba(15, 118, 110, 0.1);
  color: rgb(var(--v-theme-secondary));
}

.concept-card {
  border-radius: 28px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background:
    linear-gradient(180deg, rgba(var(--v-theme-surface), 0.98), rgba(var(--v-theme-surface), 0.92));
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
}

.concept-card-shell {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.concept-card-rail {
  display: flex;
  justify-content: center;
}

.concept-card-content {
  min-width: 0;
}

.concept-section {
  height: 100%;
  padding: 20px 22px;
  border-radius: 22px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgba(var(--v-theme-on-surface), 0.025);
}

.concept-section-featured {
  padding: 24px 26px;
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-on-surface), 0.02));
}

.concept-support-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.concept-text {
  white-space: pre-line;
}

@media (max-width: 959px) {
  .concept-card-shell {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .concept-card-rail {
    justify-content: flex-start;
  }
}

@media (max-width: 700px) {
  .concept-support-grid {
    grid-template-columns: 1fr;
  }
}
</style>
