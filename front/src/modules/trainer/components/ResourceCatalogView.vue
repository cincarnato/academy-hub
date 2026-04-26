<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import ResourceCatalogProvider from "../providers/ResourceCatalogProvider";
import type {IResourceCatalog} from "../interfaces/IResourceCatalog";

interface Props {
  catalogId: string
}

type CatalogResource = NonNullable<IResourceCatalog["resources"]>[number]

const props = defineProps<Props>()
const provider = ResourceCatalogProvider.instance

const loading = ref(false)
const error = ref("")
const catalog = ref<IResourceCatalog | null>(null)

const activeResources = computed(() => {
  return (catalog.value?.resources || []).filter((resource) => resource.enabled !== false)
})

const featuredResources = computed(() => activeResources.value.slice(0, 3))

const catalogTags = computed(() => catalog.value?.tags || [])

const groupedResources = computed(() => {
  const groups = new Map<string, CatalogResource[]>()

  for (const resource of activeResources.value) {
    const key = resource.category?.trim() || "Recursos destacados"
    const current = groups.get(key) || []
    current.push(resource)
    groups.set(key, current)
  }

  return Array.from(groups.entries()).map(([name, resources]) => ({name, resources}))
})

const stats = computed(() => {
  const resources = activeResources.value
  const creators = new Set(resources.map((resource) => resource.creator).filter(Boolean))
  const companies = new Set(resources.map((resource) => resource.company).filter(Boolean))

  return [
    {label: "Recursos", value: resources.length},
    {label: "Autores", value: creators.size},
    {label: "Empresas", value: companies.size},
  ]
})

const publishedAtText = computed(() => formatDate(catalog.value?.publishedAt))

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
    console.error("Error loading resource catalog:", err)
    catalog.value = null
    error.value = "No fue posible cargar este catálogo en este momento."
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

function getDomainLabel(url?: string) {
  if (!url) return ""

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "")
    return hostname
  } catch {
    return url
  }
}

function getResourceTags(resource: CatalogResource) {
  return resource.tags || []
}

onMounted(() => {
  void loadCatalog()
})

watch(() => props.catalogId, () => {
  void loadCatalog()
})
</script>

<template>
  <v-container fluid class="resource-catalog-page px-0">
    <section class="catalog-hero">
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
            <v-col cols="12" md="7">
              <div class="hero-copy">
                <div class="d-flex flex-wrap align-center ga-3 mb-5">
                  <v-chip
                    color="primary"
                    variant="flat"
                    size="small"
                  >
                    {{ catalog.category || "Catálogo curado" }}
                  </v-chip>

                  <v-chip
                    v-if="catalog.status"
                    variant="outlined"
                    size="small"
                  >
                    {{ catalog.status }}
                  </v-chip>

                  <span v-if="publishedAtText" class="text-body-2 hero-meta-text">
                    Publicado el {{ publishedAtText }}
                  </span>
                </div>

                <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
                  {{ catalog.name }}
                </h1>

                <p class="text-body-1 text-md-h6 mb-6 hero-description hero-support-text">
                  {{ catalog.description || "Una selección profesional de recursos listos para explorar." }}
                </p>

                <div class="d-flex flex-wrap ga-3 mb-8">
                  <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="stat-card"
                  >
                    <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
                    <div class="text-body-2 hero-support-text">{{ stat.label }}</div>
                  </div>
                </div>

                <div v-if="catalogTags.length" class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="tag in catalogTags"
                    :key="tag"
                    size="small"
                    variant="tonal"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="5">
              <v-card class="hero-panel" elevation="0">
                <v-img
                  v-if="catalog.coverImageUrl"
                  :src="catalog.coverImageUrl"
                  height="220"
                  cover
                  class="hero-image"
                />

                <v-card-text class="pa-6">
                  <div class="text-overline mb-2">Selección inicial</div>
                  <div class="text-h6 font-weight-bold mb-4">
                    Recursos destacados
                  </div>

                  <div class="d-flex flex-column ga-3">
                    <div
                      v-for="resource in featuredResources"
                      :key="`${resource.name}-${resource.url}`"
                      class="featured-item"
                    >
                      <div class="d-flex align-start ga-3">
                        <v-avatar rounded="lg" size="48" class="featured-avatar">
                          <v-img
                            v-if="resource.logoUrl || resource.imageUrl"
                            :src="resource.logoUrl || resource.imageUrl"
                            cover
                          />
                          <span v-else class="text-subtitle-2 font-weight-bold">
                            {{ resource.name.slice(0, 1).toUpperCase() }}
                          </span>
                        </v-avatar>

                        <div class="flex-grow-1">
                          <div class="text-subtitle-1 font-weight-medium">{{ resource.name }}</div>
                          <div class="text-body-2 hero-support-text">
                            {{ resource.company || resource.creator || getDomainLabel(resource.url) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </section>

    <v-container
      v-if="catalog && !loading && !error"
      class="py-8 py-md-10"
    >
      <div
        v-for="group in groupedResources"
        :key="group.name"
        class="mb-10"
      >
        <div class="d-flex flex-column flex-md-row align-md-end justify-space-between mb-5 ga-2">
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">{{ group.name }}</h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ group.resources.length }} recurso<span v-if="group.resources.length !== 1">s</span> seleccionados
            </p>
          </div>
        </div>

        <v-row>
          <v-col
            v-for="resource in group.resources"
            :key="`${group.name}-${resource.name}-${resource.url}`"
            cols="12"
            sm="6"
            xl="4"
          >
            <v-card class="resource-card h-100" elevation="0">
              <v-card-text class="pa-6 d-flex flex-column h-100">
                <div class="d-flex align-start ga-4 mb-4">
                  <v-avatar rounded="xl" size="56" class="resource-avatar">
                    <v-img
                      v-if="resource.logoUrl || resource.imageUrl"
                      :src="resource.logoUrl || resource.imageUrl"
                      cover
                    />
                    <span v-else class="text-h6 font-weight-bold">
                      {{ resource.name.slice(0, 1).toUpperCase() }}
                    </span>
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-h6 font-weight-bold mb-1">{{ resource.name }}</div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ resource.company || resource.creator || "Recurso recomendado" }}
                    </div>
                  </div>
                </div>

                <p class="text-body-2 text-medium-emphasis mb-4 flex-grow-1">
                  {{ resource.description || "Acceso directo al recurso para incorporarlo a tu stack de trabajo." }}
                </p>

                <div class="d-flex flex-wrap ga-2 mb-4">
                  <v-chip
                    v-if="resource.category"
                    size="small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ resource.category }}
                  </v-chip>

                  <v-chip
                    v-for="tag in getResourceTags(resource)"
                    :key="tag"
                    size="small"
                    variant="outlined"
                  >
                    {{ tag }}
                  </v-chip>
                </div>

                <div class="d-flex align-center justify-space-between ga-3 mt-auto">
                  <span class="text-body-2 text-medium-emphasis">
                    {{ getDomainLabel(resource.url) }}
                  </span>

                  <v-btn
                    :href="resource.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                    variant="flat"
                  >
                    Abrir recurso
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-container>
</template>

<style scoped>
.resource-catalog-page {
  min-height: 100%;
}

.catalog-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(var(--v-theme-primary), 0.22), transparent 34%),
    linear-gradient(135deg, rgba(12, 18, 32, 0.96), rgba(26, 36, 56, 0.92));
  color: rgba(255, 255, 255, 0.96);
}

.catalog-hero::after {
  content: "";
  position: absolute;
  inset: auto -8% -120px auto;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  filter: blur(6px);
}

.hero-copy,
.hero-panel {
  position: relative;
  z-index: 1;
}

.hero-description {
  max-width: 58ch;
}

.hero-meta-text {
  color: rgba(255, 255, 255, 0.78);
}

.hero-support-text {
  color: rgba(255, 255, 255, 0.82);
}

.hero-panel {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  border-radius: 28px;
  overflow: hidden;
}

.hero-image {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-skeleton {
  max-width: 960px;
  margin: 0 auto;
}

.stat-card {
  min-width: 110px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.featured-item {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.featured-avatar,
.resource-avatar {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}

.resource-card {
  border-radius: 24px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background:
    linear-gradient(180deg, rgba(var(--v-theme-surface), 1), rgba(var(--v-theme-surface), 0.94));
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.24);
}
</style>
