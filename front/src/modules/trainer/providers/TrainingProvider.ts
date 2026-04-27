
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {
  ITraining,
  ITrainingBase,
  ITrainingQuizQuestion,
  ITrainingSlide,
} from '../interfaces/ITraining'

type TrainingSlide = ITrainingSlide

interface IAIResponse<T> {
  output: T
  tokens: number
  inputTokens: number
  outputTokens: number
  time: number
}

interface IOpenAIJsonSchema {
  name: string
  schema: object
  strict?: boolean
}

interface IOpenAIResponseFormat {
  type: 'json_schema'
  json_schema: IOpenAIJsonSchema
}

interface ITrainingThemeAIResult {
  globalSlideCss: string
  rationale?: string
}

interface ITrainingSlideAIResult {
  slide: TrainingSlide
  rationale?: string
}

interface ITrainingQuizAIResult {
  quiz: Array<ITrainingQuizQuestion>
  rationale?: string
}

class TrainingProvider extends AbstractCrudRestProvider<ITraining, ITrainingBase, ITrainingBase> {
    
  static singleton: TrainingProvider
    
  constructor() {
   super('/api/trainings')
  }
  
  static get instance() {
    if(!TrainingProvider.singleton){
      TrainingProvider.singleton = new TrainingProvider()
    }
    return TrainingProvider.singleton
  }

  async promptAI<T>(data: {
    systemPrompt: string
    userInput: string
    jsonSchema?: IOpenAIResponseFormat
    operationTitle?: string
    operationGroup?: string
    model?: string
  }) {
    const response = await this.httpClient.post('/api/ai/prompt/generic', data, {
      timeout: 120000
    }) as IAIResponse<T>

    if (typeof response.output === 'string') {
      try {
        response.output = JSON.parse(response.output) as T
      } catch {
        // Preserve raw output when the provider returns plain text.
      }
    }

    return response
  }

  async generateThemeFromPrompt(training: ITraining, prompt: string) {
    return await this.promptAI<ITrainingThemeAIResult>({
      systemPrompt: [
        'Sos un diseñador experto en presentaciones educativas.',
        'Tu trabajo es generar exclusivamente CSS reutilizable para slides HTML de presentaciones, con estética moderna, profesional, tecnológica y responsive.',
        'Respondé con un objeto JSON válido.',
        'El campo globalSlideCss debe contener sólo CSS plano, sin markdown ni backticks.',
        'Diseñá un theme consistente, elegante, claro, visualmente profesional y apto para presentaciones de IA, software, negocio y capacitación.',
        'El resultado debe ser únicamente CSS reutilizable y general, no CSS para un contenido puntual.',
        'Organizá el CSS por secciones comentadas.',
        'El contenedor principal debe ser .slide.',
        'Todas las clases internas, componentes, variantes y helpers deben comenzar exclusivamente con .slide o .slide-. No uses otros prefijos.',
        'Definí variables CSS en :root usando exclusivamente nombres con prefijo --slide-.',
        'Incluí variables para colores principales, fondos, superficies, textos, bordes, radios, sombras, glow, padding, gaps y fuente.',
        'No uses medidas fijas de ancho o alto para el slide. Usá width: 100%, min-height: 100%, clamp(), grid, flexbox, auto-fit, minmax() y unidades relativas.',
        'El diseño debe adaptarse al contenedor donde se renderice.',
        'Incluí media queries para comportamiento responsive.',
        'No generes estilos globales ni selectores por etiqueta o elementos del DOM, salvo :root para variables.',
        'No uses selectores como html, body, div, span, p, h1, h2, h3, ul, li, img, section, article, table, tr, td, th, pre, code, * o combinaciones que apliquen directo sobre etiquetas.',
        'Todos los estilos deben aplicarse exclusivamente mediante clases CSS o variantes de clases del sistema slide.',
        'Usá modificadores con convención BEM simple, por ejemplo .slide-card--highlight, .slide-title--xl, .slide-grid--3.',
        'Generá componentes UI reutilizables para títulos, textos, cards, paneles, grillas, listas, métricas, timelines, comparaciones, tablas, badges, callouts, bloques de código, recursos, imágenes y separadores.',
        'Como mínimo, debés incluir reglas para estas clases y variantes:',
        '.slide, .slide--center, .slide--stack, .slide--top, .slide--clean, .slide--spotlight, .slide--purple.',
        '.slide-container, .slide-container--wide, .slide-header, .slide-layout, .slide-layout--reverse, .slide-content-grid, .slide-grid, .slide-grid--2, .slide-grid--3, .slide-grid--4, .slide-grid--auto, .slide-grid--cards, .slide-stack, .slide-stack--sm, .slide-stack--lg, .slide-row, .slide-row--between, .slide-wrap, .slide-spacer.',
        '.slide-eyebrow, .slide-title, .slide-title--xl, .slide-title--sm, .slide-title__accent, .slide-title__accent--block, .slide-gradient-text, .slide-subtitle, .slide-description, .slide-lead, .slide-small, .slide-kicker, .slide-highlight.',
        '.slide-card, .slide-card--large, .slide-card--compact, .slide-card--highlight, .slide-card--solid, .slide-card--glow, .slide-card-title, .slide-card-label, .slide-hero-box, .slide-panel.',
        '.slide-icon, .slide-icon--sm, .slide-icon--lg, .slide-icon--soft, .slide-icon--cyan, .slide-icon--green, .slide-number, .slide-number--sm, .slide-number--lg.',
        '.slide-list, .slide-list-item, .slide-feature-grid, .slide-feature.',
        '.slide-pills, .slide-pill, .slide-badge, .slide-badge--cyan, .slide-badge--purple, .slide-badge--green.',
        '.slide-steps, .slide-step, .slide-flow-line.',
        '.slide-callout, .slide-callout-label, .slide-callout-text, .slide-callout-note.',
        '.slide-metrics, .slide-metric, .slide-metric-value, .slide-metric-label.',
        '.slide-timeline, .slide-timeline-item, .slide-timeline-marker, .slide-timeline-content, .slide-timeline-title, .slide-timeline-text.',
        '.slide-comparison, .slide-comparison-item, .slide-comparison-title, .slide-comparison-text.',
        '.slide-quote, .slide-quote-text, .slide-quote-author.',
        '.slide-table-wrap, .slide-table.',
        '.slide-tool-card, .slide-tool-header, .slide-tool-name, .slide-tool-company, .slide-tool-url, .slide-tool-description.',
        '.slide-code, .slide-prompt.',
        '.slide-progress, .slide-progress-bar, .slide-divider, .slide-divider--thick.',
        '.slide-example, .slide-note.',
        '.slide-visual, .slide-image, .slide-orb.',
        'El CSS no debe contaminar ni sobrescribir el estilo general del sitio fuera del contenido de las slides.',
      ].join('\n'),
      userInput: [
        `Training: ${training.name}`,
        training.description ? `Descripción: ${training.description}` : '',
        training.category ? `Categoría: ${training.category}` : '',
        `Prompt del usuario: ${prompt}`,
      ].filter(Boolean).join('\n'),
      jsonSchema: {
        type: 'json_schema',
        json_schema: {
          name: 'training_theme_result',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['globalSlideCss', 'rationale'],
            properties: {
              globalSlideCss: {type: 'string'},
              rationale: {type: 'string'},
            }
          },
        }
      },
      operationTitle: 'training-generate-theme',
      operationGroup: 'training-improve',
    })
  }

  async generateSlideFromPrompt(training: ITraining, prompt: string) {
    return await this.promptAI<ITrainingSlideAIResult>({
      systemPrompt: [
        'Sos un experto en diseño instruccional y storytelling para capacitaciones.',
        'Generá una única slide lista para usarse.',
        'Respondé con JSON válido.',
        'El contenido debe ser útil, concreto y bien estructurado.',
        'Usá contentType html cuando el diseño requiera marcado, o markdown si alcanza con estructura textual.',
      ].join('\n'),
      userInput: [
        `Training: ${training.name}`,
        training.description ? `Descripción: ${training.description}` : '',
        training.category ? `Categoría: ${training.category}` : '',
        `Cantidad actual de slides: ${(training.slides || []).length}`,
        training.globalSlideCss ? `Tema CSS actual:\n${training.globalSlideCss}` : '',
        `Prompt del usuario: ${prompt}`,
      ].filter(Boolean).join('\n\n'),
      jsonSchema: {
        type: 'json_schema',
        json_schema: {
          name: 'training_slide_result',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['slide', 'rationale'],
            properties: {
              rationale: {type: 'string'},
              slide: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'contentType', 'content', 'subtitle', 'speakerNotes', 'enabled'],
                properties: {
                  title: {type: 'string'},
                  subtitle: {type: 'string'},
                  contentType: {type: 'string', enum: ['html', 'markdown']},
                  content: {type: 'string'},
                  speakerNotes: {type: 'string'},
                  enabled: {type: 'boolean'},
                }
              }
            }
          }
        }
      },
      operationTitle: 'training-generate-slide',
      operationGroup: 'training-improve',
    })
  }

  async improveSlideFromPrompt(training: ITraining, slide: TrainingSlide, prompt: string) {
    return await this.promptAI<ITrainingSlideAIResult>({
      systemPrompt: [
        'Sos un experto en diseño instruccional, copywriting y diseño de slides.',
        'Debés mejorar una slide existente respetando el objetivo pedagógico.',
        'Respondé con JSON válido.',
        'Podés mejorar contenido, claridad, jerarquía visual y estructura.',
        'No agregues markdown fuera del JSON.',
      ].join('\n'),
      userInput: [
        `Training: ${training.name}`,
        training.description ? `Descripción: ${training.description}` : '',
        training.category ? `Categoría: ${training.category}` : '',
        training.globalSlideCss ? `Tema CSS actual:\n${training.globalSlideCss}` : '',
        `Slide actual:\n${JSON.stringify(slide, null, 2)}`,
        `Pedido del usuario: ${prompt}`,
      ].filter(Boolean).join('\n\n'),
      jsonSchema: {
        type: 'json_schema',
        json_schema: {
          name: 'training_improved_slide_result',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['slide', 'rationale'],
            properties: {
              rationale: {type: 'string'},
              slide: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'contentType', 'content', 'subtitle', 'speakerNotes', 'enabled'],
                properties: {
                  title: {type: 'string'},
                  subtitle: {type: 'string'},
                  contentType: {type: 'string', enum: ['html', 'markdown']},
                  content: {type: 'string'},
                  speakerNotes: {type: 'string'},
                  enabled: {type: 'boolean'},
                }
              }
            }
          }
        }
      },
      operationTitle: 'training-improve-slide',
      operationGroup: 'training-improve',
    })
  }

  async generateQuizFromPrompt(training: ITraining, slide: TrainingSlide, prompt: string) {
    return await this.promptAI<ITrainingQuizAIResult>({
      systemPrompt: [
        'Sos un experto en diseño instruccional y evaluación educativa.',
        'Debés generar un quiz útil para una slide puntual de una capacitación.',
        'Respondé con JSON válido.',
        'El quiz debe evaluar comprensión real del contenido de la slide, sin inventar contexto ajeno.',
        'Generá preguntas claras, concretas y consistentes con el nivel del material.',
        'Podés usar tipos single_choice, multiple_choice y open_text.',
        'Cuando uses single_choice o multiple_choice, incluí answers con al menos una opción correcta.',
        'Cuando uses open_text, no incluyas answers salvo que sea estrictamente necesario.',
        'La explicación debe ayudar a reforzar el aprendizaje.',
        'No agregues markdown fuera del JSON.',
      ].join('\n'),
      userInput: [
        `Training: ${training.name}`,
        training.description ? `Descripción: ${training.description}` : '',
        training.category ? `Categoría: ${training.category}` : '',
        training.globalSlideCss ? `Tema CSS actual:\n${training.globalSlideCss}` : '',
        `Slide seleccionada:\n${JSON.stringify(slide, null, 2)}`,
        `Pedido del usuario: ${prompt}`,
      ].filter(Boolean).join('\n\n'),
      jsonSchema: {
        type: 'json_schema',
        json_schema: {
          name: 'training_quiz_result',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['quiz', 'rationale'],
            properties: {
              rationale: {type: 'string'},
              quiz: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['question', 'description', 'type', 'answers', 'required', 'explanation'],
                  properties: {
                    question: {type: 'string'},
                    description: {type: 'string'},
                    type: {type: 'string', enum: ['single_choice', 'multiple_choice', 'open_text']},
                    answers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['answer', 'points', 'isCorrect', 'feedback'],
                        properties: {
                          answer: {type: 'string'},
                          points: {type: 'number'},
                          isCorrect: {type: 'boolean'},
                          feedback: {type: 'string'},
                        }
                      }
                    },
                    required: {type: 'boolean'},
                    explanation: {type: 'string'},
                  }
                }
              },
            }
          }
        }
      },
      operationTitle: 'training-generate-quiz',
      operationGroup: 'training-improve',
    })
  }

}

export default TrainingProvider
