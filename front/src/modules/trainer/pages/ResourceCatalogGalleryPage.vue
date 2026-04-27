<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ResourceCatalogProvider from "../providers/ResourceCatalogProvider";
import type {IResourceCatalog} from "../interfaces/IResourceCatalog";

const provider = ResourceCatalogProvider.instance

const catalogs = ref<IResourceCatalog[]>([])
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
      orderBy: "publishedAt",
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
    console.error("Error loading resource catalogs:", err)
    error.value = "No fue posible cargar los catálogos disponibles en este momento."
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

function getResourceCount(catalog: IResourceCatalog) {
  return (catalog.resources || []).filter((resource) => resource.enabled !== false).length
}

function getCatalogCover(catalog: IResourceCatalog) {
  if (catalog.coverImageUrl) {
    return catalog.coverImageUrl
  }

  const firstResourceWithImage = (catalog.resources || []).find((resource) => {
    return Boolean(resource.imageUrl || resource.logoUrl)
  })

  return firstResourceWithImage?.imageUrl || firstResourceWithImage?.logoUrl || ""
}

function getCatalogTags(catalog: IResourceCatalog) {
  return catalog.tags || []
}

onMounted(() => {
  void fetchCatalogs()
})
</script>

<template>
  <v-container fluid class="resource-catalog-gallery px-0">
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
              Biblioteca de catálogos
            </v-chip>

            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              Explorá catálogos curados para entrenamientos y recursos
            </h1>


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
            <h2 class="text-h5 font-weight-bold mb-1">Galería de catálogos</h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ catalogs.length }} cargados de {{ totalItems }} disponibles
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
            v-for="catalog in catalogs"
            :key="catalog._id"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="catalog-card h-100"
              elevation="0"
              :to="{ name: 'ResourceCatalogPage', params: { catalogId: catalog._id } }"
            >
              <div class="catalog-cover">
                <v-img
                  v-if="getCatalogCover(catalog)"
                  :src="getCatalogCover(catalog)"
                  cover
                  height="220"
                />

                <div
                  v-else
                  class="catalog-cover-fallback"
                >
                  <span>{{ catalog.name.slice(0, 1).toUpperCase() }}</span>
                </div>

                <div class="catalog-cover-overlay">
                  <v-chip
                    size="small"
                    color="primary"
                    variant="flat"
                  >
                    {{ catalog.category || "Catálogo" }}
                  </v-chip>

                  <v-chip
                    v-if="catalog.status"
                    size="small"
                    variant="tonal"
                  >
                    {{ catalog.status }}
                  </v-chip>
                </div>
              </div>

              <v-card-text class="pa-6">
                <div class="d-flex align-center justify-space-between ga-3 mb-3">
                  <div class="text-overline text-medium-emphasis">
                    {{ formatDate(catalog.publishedAt || catalog.createdAt) || "Sin fecha publicada" }}
                  </div>

                  <v-chip size="small" variant="outlined">
                    {{ getResourceCount(catalog) }} recursos
                  </v-chip>
                </div>

                <h3 class="text-h6 font-weight-bold mb-3">
                  {{ catalog.name }}
                </h3>

                <p class="text-body-2 text-medium-emphasis mb-4 catalog-description">
                  {{ catalog.description || "Colección curada de recursos lista para explorar." }}
                </p>

                <div
                  v-if="getCatalogTags(catalog).length"
                  class="d-flex flex-wrap ga-2"
                >
                  <v-chip
                    v-for="tag in getCatalogTags(catalog)"
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
        No hay catálogos disponibles para mostrar.
      </v-alert>
    </v-container>
  </v-container>
</template>

<style scoped>
.resource-catalog-gallery {
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

.catalog-cover {
  position: relative;
  min-height: 220px;
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.24), rgba(12, 18, 32, 0.88));
}

.catalog-cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  font-size: 64px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}

.catalog-cover-overlay {
  position: absolute;
  inset: 16px 16px auto 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.catalog-description {
  min-height: 4.5em;
}
</style>
