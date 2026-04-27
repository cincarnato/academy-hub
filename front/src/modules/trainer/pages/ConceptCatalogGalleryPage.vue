<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ConceptCatalogProvider from "../providers/ConceptCatalogProvider";
import type {IConceptCatalog} from "../interfaces/IConceptCatalog";

const provider = ConceptCatalogProvider.instance

const catalogs = ref<IConceptCatalog[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref("")
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

const hasCatalogs = computed(() => catalogs.value.length > 0)
const hasMorePages = computed(() => currentPage.value < totalPages.value)

async function fetchCatalogs(page: number = 1) {
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
      limit: 50,
      orderBy: "updatedAt",
      order: "desc",
    })

    const items = result.items || []

    catalogs.value = isFirstPage
      ? items
      : [...catalogs.value, ...items]

    currentPage.value = result.page || page
    totalItems.value = result.total || items.length
    totalPages.value = Math.max(
      1,
      Math.ceil((result.total || items.length) / (result.limit || 50))
    )
  } catch (err) {
    console.error("Error loading concept catalogs:", err)
    error.value = "No fue posible cargar los catálogos conceptuales disponibles en este momento."
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function loadMore() {
  if (!hasMorePages.value || loading.value || loadingMore.value) {
    return
  }

  await fetchCatalogs(currentPage.value + 1)
}

function formatDate(date?: Date) {
  if (!date) return ""

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

function getConceptCount(catalog: IConceptCatalog) {
  return (catalog.concepts || []).length
}

onMounted(() => {
  void fetchCatalogs()
})
</script>

<template>
  <v-container fluid class="concept-catalog-gallery px-0">
    <section class="gallery-hero">
      <v-container class="py-10 py-md-14">
        <div class="hero-shell">
          <div class="hero-copy">
            <v-chip
              color="secondary"
              variant="flat"
              size="small"
              class="mb-4"
            >
              Biblioteca conceptual
            </v-chip>

            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              Explorá catálogos de conceptos listos para estudiar y reutilizar
            </h1>

            <p class="text-body-1 text-md-h6 mb-6 hero-support-text">
              Accedé a marcos teóricos, definiciones prácticas y ejemplos para entrenamientos, talleres y sesiones de aprendizaje.
            </p>

            <div class="hero-stats">
              <div class="hero-stat-card">
                <div class="text-h5 font-weight-bold">{{ totalItems || catalogs.length }}</div>
                <div class="text-body-2 hero-support-text">Catálogos detectados</div>
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

      <template v-else-if="hasCatalogs">
        <div class="d-flex flex-column flex-md-row align-md-end justify-space-between mb-6 ga-3">
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">Galería conceptual</h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ catalogs.length }} cargados de {{ totalItems }} disponibles
            </p>
          </div>

          <v-btn
            v-if="hasMorePages"
            color="secondary"
            variant="outlined"
            :loading="loadingMore"
            @click="loadMore"
          >
            Cargar más
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="catalog in catalogs"
            :key="catalog._id"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="catalog-card h-100"
              elevation="0"
              :to="{ name: 'ConceptCatalogPage', params: { catalogId: catalog.slug || catalog._id } }"
            >
              <v-card-text class="catalog-card-content pa-6">
                <div class="d-flex flex-wrap ga-2 mb-4">
                  <v-chip
                    size="small"
                    color="secondary"
                    variant="flat"
                  >
                    Catálogo conceptual
                  </v-chip>

                  <v-chip
                    v-if="catalog.slug"
                    size="small"
                    variant="tonal"
                  >
                    {{ catalog.slug }}
                  </v-chip>
                </div>

                <div class="d-flex align-center justify-space-between ga-3 mb-3">
                  <div class="text-overline text-medium-emphasis">
                    {{ formatDate(catalog.updatedAt || catalog.createdAt) || "Sin fecha disponible" }}
                  </div>

                  <v-chip size="small" variant="outlined">
                    {{ getConceptCount(catalog) }} conceptos
                  </v-chip>
                </div>

                <h3 class="text-h6 font-weight-bold mb-3">
                  {{ catalog.title }}
                </h3>

                <p class="text-body-2 text-medium-emphasis mb-4 catalog-description">
                  {{ catalog.descripcion || "Colección de conceptos explicados para ordenar teoría, utilidad y ejemplos de aplicación." }}
                </p>
              </v-card-text>

              <v-card-actions class="px-6 pb-6 pt-0">
                <v-btn
                  color="secondary"
                  variant="flat"
                  block
                >
                  Ver catálogo
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
            color="secondary"
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
        No hay catálogos conceptuales disponibles para mostrar.
      </v-alert>
    </v-container>
  </v-container>
</template>

<style scoped>
.concept-catalog-gallery {
  min-height: 100%;
}

.gallery-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.26), transparent 30%),
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 24%),
    linear-gradient(145deg, #0f172a, #11352f 58%, #163c4a);
  color: rgba(255, 255, 255, 0.96);
}

.gallery-hero::after {
  content: "";
  position: absolute;
  inset: auto auto -140px -80px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  filter: blur(10px);
}

.hero-shell {
  position: relative;
  z-index: 1;
}

.hero-copy {
  max-width: 960px;
}

.hero-support-text {
  color: rgba(236, 253, 245, 0.88);
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
  border-color: rgba(var(--v-theme-secondary), 0.24);
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
