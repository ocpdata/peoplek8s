# Entidad ETAPAS DE VENTA

## Sistema CRM - Proceso de Ventas con Etapas y Preguntas de Calificación

---

## 📝 Descripción de la Entidad

La entidad **ETAPAS DE VENTA** representa el proceso estructurado que siguen las oportunidades desde el contacto inicial hasta el cierre (ganado/perdido/abandonado). Cada etapa tiene preguntas de calificación que deben responderse adecuadamente para avanzar a la siguiente etapa.

### Características Principales:

- Proceso lineal de ventas con etapas secuenciales
- Cada etapa tiene preguntas de calificación obligatorias
- Las oportunidades avanzan respondiendo correctamente las preguntas
- Todas las oportunidades inician en "Contacto Inicial"
- El objetivo es llegar a "Ganado"
- Puede perderse o abandonarse en cualquier etapa
- Usa notación **camelCase** en todos los campos

---

## 🏗️ Diagrama ER - Módulo ETAPAS DE VENTA

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                    ETAPAS DE VENTA Y PREGUNTAS DE CALIFICACIÓN                       │
└──────────────────────────────────────────────────────────────────────────────────────┘


    ┌──────────────────────────────────────────────────────────────┐
    │                        etapasVenta                           │
    ├──────────────────────────────────────────────────────────────┤
    │ PK  idEtapaVenta                                             │
    │     nombre                                                   │
    │     descripcion                                              │
    │     orden                                                    │
    │     probabilidad                                             │
    │     esEtapaFinal                                             │
    │     colorHex                                                 │
    │ FK  idEstadoRegistro                                         │
    └──────┬───────────────────────────────────────────────────────┘
           │
           │ 1
           │
           │ M
           │
    ┌──────▼───────────────────────────────────────────────────────┐
    │                    preguntasEtapa                            │
    ├──────────────────────────────────────────────────────────────┤
    │ PK  idPregunta                                               │
    │ FK  idEtapaVenta                                             │
    │     textoPregunta                                            │
    │     descripcionPregunta                                      │
    │     tipoPregunta (Si/No, Texto, Opción Múltiple, Fecha)     │
    │     esObligatoria                                            │
    │     orden                                                    │
    │ FK  idEstadoRegistro                                         │
    └──────┬───────────────────────────────────────────────────────┘
           │
           │ 1
           │
           │ M
           │
    ┌──────▼───────────────────────────────────────────────────────┐
    │                 respuestasOportunidad                        │
    ├──────────────────────────────────────────────────────────────┤
    │ PK  idRespuesta                                              │
    │ FK  idOportunidad                                            │
    │ FK  idPregunta                                               │
    │     respuestaSiNo                                            │
    │     respuestaTexto                                           │
    │     respuestaOpcion                                          │
    │     respuestaFecha                                           │
    │     esRespuestaAdecuada                                      │
    │ FK  idUsuarioRespuesta (usuarios)                            │
    │     fechaRespuesta                                           │
    └──────────────────────────────────────────────────────────────┘
           │
           │ M
           │
           │ 1
           │
    ┌──────▼───────────────────────────────────────────────────────┐
    │                     oportunidades                            │
    ├──────────────────────────────────────────────────────────────┤
    │ PK  idOportunidad                                            │
    │ FK  idCuenta                                                 │
    │ FK  idEtapaVenta (etapa actual)                              │
    │     nombreOportunidad                                        │
    │     montoEstimado                                            │
    │     fechaCierre                                              │
    │     fechaCreacion                                            │
    └──────────────────────────────────────────────────────────────┘


    HISTORIAL DE CAMBIOS DE ETAPA:

    ┌──────────────────────────────────────────────────────────────┐
    │                 historialEtapasOportunidad                   │
    ├──────────────────────────────────────────────────────────────┤
    │ PK  idHistorial                                              │
    │ FK  idOportunidad                                            │
    │ FK  idEtapaAnterior                                          │
    │ FK  idEtapaNueva                                             │
    │ FK  idUsuario (quien movió)                                  │
    │     fechaCambio                                              │
    │     comentarios                                              │
    └──────────────────────────────────────────────────────────────┘


    CATÁLOGO DE ETAPAS (orden del proceso):

    ┌──────────────────────────────────────────────────────────────┐
    │  Orden │ Etapa                         │ Prob. │ Final       │
    ├──────────────────────────────────────────────────────────────┤
    │   1    │ Contacto Inicial              │  10%  │ No          │
    │   2    │ Identificación de Oportunidad │  20%  │ No          │
    │   3    │ Desarrollo                    │  40%  │ No          │
    │   4    │ Cotización                    │  60%  │ No          │
    │   5    │ Demostración                  │  70%  │ No          │
    │   6    │ Negociación                   │  80%  │ No          │
    │   7    │ Waiting                       │  85%  │ No          │
    │   8    │ Ganado                        │ 100%  │ Sí          │
    │   9    │ Perdido                       │   0%  │ Sí          │
    │   10   │ Abandonado                    │   0%  │ Sí          │
    └──────────────────────────────────────────────────────────────┘


    EJEMPLO DE PREGUNTAS POR ETAPA:

    CONTACTO INICIAL:
    • ¿Se identificó la persona de contacto correcta?
    • ¿Se validó que existe un presupuesto?
    • ¿Se identificó un problema/necesidad?

    IDENTIFICACIÓN DE OPORTUNIDAD:
    • ¿Se documentó la necesidad del cliente?
    • ¿Se identificaron los tomadores de decisión?
    • ¿Se definió el timeline del proyecto?

    DESARROLLO:
    • ¿Se elaboró una solución preliminar?
    • ¿Se validó técnicamente con el cliente?
    • ¿Se identificaron los competidores?

    COTIZACIÓN:
    • ¿Se envió cotización formal?
    • ¿El cliente validó el alcance?
    • ¿Se acordó el proceso de evaluación?

    DEMOSTRACIÓN:
    • ¿Se realizó demostración/prueba de concepto?
    • ¿Se validaron los requerimientos técnicos?
    • ¿El cliente mostró satisfacción con la solución?

    NEGOCIACIÓN:
    • ¿Se negociaron términos y condiciones?
    • ¿Se acordó pricing final?
    • ¿Se identificaron obstáculos pendientes?

    WAITING:
    • ¿Se están esperando aprobaciones internas del cliente?
    • ¿Se tiene fecha estimada de decisión?
    • ¿Se mantiene comunicación activa?


    RELACIONES CON OTRAS ENTIDADES:

    etapasVenta (1) ──────► (M) preguntasEtapa
    etapasVenta (1) ◄───── (M) oportunidades (etapa actual)
    preguntasEtapa (1) ────► (M) respuestasOportunidad
    oportunidades (1) ─────► (M) respuestasOportunidad
    oportunidades (1) ─────► (M) historialEtapasOportunidad
```

---

## 📋 Reglas de Negocio

### 1. Avance de Etapas

- **Secuencial**: Las oportunidades avanzan una etapa a la vez (no se pueden saltar)
- **Calificación**: Todas las preguntas obligatorias deben responderse adecuadamente
- **Validación**: El sistema verifica que todas las respuestas sean adecuadas antes de permitir el avance
- **Excepción**: Perdido/Abandonado pueden alcanzarse desde cualquier etapa

### 2. Preguntas Obligatorias

- Cada etapa tiene al menos 3 preguntas obligatorias
- Las respuestas adecuadas varían según el tipo de pregunta:
  - **Si/No**: Respuesta "Sí" es adecuada
  - **Texto**: Debe tener contenido (no vacío)
  - **Opción Múltiple**: Se configura qué opciones son adecuadas
  - **Fecha**: Debe tener fecha válida

### 3. Etapas Finales

- **Ganado**: Se cierra la oportunidad exitosamente y se puede generar orden de compra
- **Perdido**: Se perdió ante competencia o el cliente canceló el proyecto
- **Abandonado**: El vendedor decide no continuar persiguiendo la oportunidad
- Una vez en etapa final, no se puede retroceder

### 4. Retroceso de Etapas

- Se permite retroceder a etapas anteriores (excepto desde etapas finales)
- Al retroceder, se mantienen las respuestas previas
- Se registra en el historial el motivo del retroceso

### 5. Historial

- Cada cambio de etapa se registra
- Incluye fecha, usuario y comentarios
- Permite auditar el proceso de cada oportunidad

---

## 💡 Lógica de Validación

### Verificar si puede avanzar de etapa:

```sql
-- Obtener preguntas obligatorias pendientes
SELECT COUNT(*) as preguntasPendientes
FROM preguntasEtapa pe
LEFT JOIN respuestasOportunidad ro
    ON pe.idPregunta = ro.idPregunta
    AND ro.idOportunidad = @idOportunidad
WHERE pe.idEtapaVenta = @etapaActual
  AND pe.esObligatoria = TRUE
  AND pe.idEstadoRegistro = 1  -- Activo
  AND (ro.idRespuesta IS NULL OR ro.esRespuestaAdecuada = FALSE)

-- Si preguntasPendientes = 0, puede avanzar
```

### Calcular progreso de etapa:

```sql
-- Porcentaje de preguntas respondidas adecuadamente
SELECT
    COUNT(CASE WHEN ro.esRespuestaAdecuada = TRUE THEN 1 END) * 100.0 / COUNT(*) as porcentajeCompletado
FROM preguntasEtapa pe
LEFT JOIN respuestasOportunidad ro
    ON pe.idPregunta = ro.idPregunta
    AND ro.idOportunidad = @idOportunidad
WHERE pe.idEtapaVenta = @etapaActual
  AND pe.idEstadoRegistro = 1  -- Activo
```

---

## 🔄 Flujo del Proceso de Ventas

```
                    ┌──────────────────┐
                    │ Contacto Inicial │ (Etapa 1)
                    └────────┬─────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ Identificación de Oportunidad│ (Etapa 2)
              └──────────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Desarrollo    │ (Etapa 3)
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Cotización    │ (Etapa 4)
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Demostración   │ (Etapa 5)
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Negociación   │ (Etapa 6)
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │    Waiting     │ (Etapa 7)
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │    GANADO      │ (Etapa 8 - FINAL)
                    └────────────────┘

    Desde cualquier etapa puede ir a:

    ┌────────────────┐              ┌────────────────┐
    │    PERDIDO     │              │   ABANDONADO   │
    └────────────────┘              └────────────────┘
    (Etapa 9 - FINAL)               (Etapa 10 - FINAL)
```

---

## 📊 Campos Calculados

### 1. Días en Etapa Actual

```sql
DATEDIFF(NOW(),
    (SELECT fechaCambio FROM historialEtapasOportunidad
     WHERE idOportunidad = o.idOportunidad
       AND idEtapaNueva = o.idEtapaVenta
     ORDER BY fechaCambio DESC LIMIT 1)
) as diasEnEtapa
```

### 2. Porcentaje de Avance en Pipeline

```sql
(etapa.orden * 100.0) /
    (SELECT MAX(orden) FROM etapasVenta WHERE esEtapaFinal = FALSE)
as porcentajeAvance
```

### 3. Velocidad del Ciclo de Venta

```sql
-- Días promedio por etapa
AVG(DATEDIFF(h2.fechaCambio, h1.fechaCambio)) as diasPromedioEtapa
FROM historialEtapasOportunidad h1
JOIN historialEtapasOportunidad h2
    ON h1.idOportunidad = h2.idOportunidad
    AND h2.orden = h1.orden + 1
```

---

## 🎯 Casos de Uso

### 1. Calificación de Oportunidades

- Asegurar que cada oportunidad cumple criterios antes de avanzar
- Reducir tiempo perdido en oportunidades no calificadas
- Estandarizar el proceso de ventas

### 2. Pipeline Saludable

- Identificar oportunidades estancadas (muchos días en misma etapa)
- Ver qué etapas tienen más cuellos de botella
- Pronosticar mejor basado en etapa y respuestas

### 3. Coaching y Entrenamiento

- Revisar respuestas para entrenar al equipo
- Identificar patrones de éxito/fracaso
- Replicar mejores prácticas

### 4. Mejora Continua

- Analizar en qué etapas se pierden más oportunidades
- Optimizar preguntas basado en correlación con éxito
- Ajustar probabilidades por etapa

---

## 📈 Métricas Clave

### Por Etapa:

- Número de oportunidades activas
- Tiempo promedio en la etapa
- Tasa de conversión a siguiente etapa
- Valor total del pipeline

### Por Pregunta:

- % de respuestas adecuadas
- Correlación con oportunidades ganadas
- Preguntas más problemáticas

### Por Vendedor:

- Velocidad de avance entre etapas
- Calidad de calificación (% respuestas adecuadas)
- Tasa de conversión por etapa

---

## 🔐 Índices Recomendados

```sql
-- Para búsquedas de preguntas por etapa
INDEX idx_preguntas_etapa (idEtapaVenta, orden, activo)

-- Para respuestas de una oportunidad
INDEX idx_respuestas_oportunidad (idOportunidad, idPregunta)

-- Para historial de una oportunidad
INDEX idx_historial_oportunidad (idOportunidad, fechaCambio DESC)

-- Para análisis de etapas
INDEX idx_oportunidades_etapa (idEtapaVenta, fechaCreacion)
```

---
