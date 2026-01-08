# Entidad OPORTUNIDADES

## Sistema CRM - Oportunidades de Negocio

---

## 📝 Descripción de la Entidad

La entidad **OPORTUNIDADES** representa las oportunidades de venta identificadas en las cuentas. Cada oportunidad avanza a través de etapas del proceso de ventas y puede generar múltiples propuestas comerciales.

### Características Principales:

- Una cuenta puede tener múltiples oportunidades
- Una oportunidad puede generar múltiples propuestas
- Cada oportunidad tiene uno o más vendedores asignados (heredados de la cuenta)
- Las oportunidades avanzan por etapas del proceso de ventas
- Se asigna un preventa y un contacto específico
- Control de monto estimado y fecha de cierre
- Clasificación por línea de negocio
- Auditoría completa de creación y modificación
- Usa notación **camelCase** en todos los campos

---

## 🏗️ Diagrama ER - Módulo OPORTUNIDADES

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                            OPORTUNIDADES DE NEGOCIO                                  │
└──────────────────────────────────────────────────────────────────────────────────────┘


                    ┌───────────────────────┐
                    │       cuentas         │
                    ├───────────────────────┤
                    │ PK  idCuenta          │
                    │     nombreCuenta      │
                    │     activo            │
                    └──────────┬────────────┘
                               │
                               │ 1
                               │
                               │ M
                               │
    ┌──────────────────────────▼────────────────────────────────────┐
    │                      oportunidades                            │
    ├───────────────────────────────────────────────────────────────┤
    │ PK  idOportunidad                                             │
    │ FK  idCuenta                                                  │
    │     nombreOportunidad                                         │
    │     montoEstimado                                             │
    │     fechaCierre                                               │
    │ FK  idContacto                                                │
    │ FK  idEtapaVenta                                              │
    │ FK  idLineaNegocio                                            │
    │ FK  idPreventa (usuarios)                                     │
    │ FK  idEstadoRegistro                                          │
    │ FK  idUsuarioCreador (usuarios)                               │
    │ FK  idUsuarioModificador (usuarios)                           │
    │     fechaCreacion                                             │
    │     fechaActualizacion                                        │
    └──────┬────────────────────┬───────────────────────────────────┘
           │                    │
           │ 1                  │ M
           │                    │
           │ M                  │ M
           │                    │
    ┌──────▼─────────────┐      └──────────────┐
    │    propuestas      │                     │
    ├────────────────────┤                     │
    │ PK  idPropuesta    │           ┌─────────▼──────────────┐
    │ FK  idOportunidad  │           │ usuariosOportunidades  │
    │ FK  idEstadoReg.   │           │    (vendedores M:M)    │
    └────────────────────┘           ├────────────────────────┤
                                     │ PK  id                 │
                                     │ FK  idOportunidad      │
                                     │ FK  idUsuario          │
                                     │     esPrincipal        │
                                     │     fechaAsignacion    │
                                     └────────────────────────┘
                                              │
                                              │ M
                                              │
                                              │ 1
                                              │
                                     ┌────────▼────────┐
                                     │    usuarios     │
                                     ├─────────────────┤
                                     │ PK  idUsuario   │
                                     │     nombre      │
                                     └─────────────────┘


    TABLAS CATÁLOGO Y RELACIONES:

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  etapasVenta             │      │  lineasNegocio           │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idEtapaVenta          │      │ PK idLineaNegocio        │
    │    nombre                │      │    nombre                │
    │    descripcion           │      │    nombreCorto           │
    │    orden                 │      │    descripcion           │
    │    probabilidad          │      │ FK idEstadoRegistro      │
    │    esEtapaFinal          │      └──────────────────────────┘
    │    colorHex              │      Líneas de negocio:
    │    colorHex              │      - F5 DCS
    │ FK idEstadoRegistro      │      - F5 Nginx
    └──────────────────────────┘      - F5 tradicional
    Etapas del proceso:               - F5 renovaciones
     1. Contacto Inicial (10%)        - Bluecat DDI
     2. Identificación de             - Bluecat Edge
        Oportunidad (20%)             - Servicios
     3. Desarrollo (40%)
     4. Cotización (60%)
     5. Demostración (70%)
     6. Negociación (80%)
     7. Waiting (85%)
     8. Ganado (100%) [FINAL]
     9. Perdido (0%) [FINAL]
    10. Abandonado (0%) [FINAL]


    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  estadosRegistro         │      │  contactos               │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idEstadoRegistro      │      │ PK idContacto            │
    │    nombre                │      │ FK idCuenta              │
    │    descripcion           │      │    nombres               │
    └──────────────────────────┘      │    apellidos             │
    Estados: Activo, Inactivo,        │    email                 │
             Pendiente                └──────────────────────────┘


    RELACIONES CON OTRAS ENTIDADES:

    oportunidades (M) ──────► (1) cuentas
    oportunidades (M) ──────► (1) contactos
    oportunidades (M) ──────► (1) etapasVenta
    oportunidades (M) ──────► (1) lineasNegocio
    oportunidades (M) ──────► (1) usuarios (preventa)
    oportunidades (M) ──────► (1) usuarios (creador)
    oportunidades (M) ──────► (1) usuarios (modificador)
    oportunidades (M) ──────► (1) estadosRegistro
    oportunidades (M) ◄─────► (M) usuarios (vendedores - usuariosOportunidades)
    oportunidades (1) ──────► (M) propuestas
```

---

## 📋 Reglas de Negocio

### 1. Creación de Oportunidades

- Solo los vendedores asignados a la cuenta pueden crear oportunidades
- Al crear una oportunidad, se heredan los vendedores de la cuenta
- Debe especificarse un contacto de la cuenta

### 2. Vendedores Asignados

- Los vendedores de la oportunidad provienen de usuariosCuentas
- Pueden agregarse/removerse vendedores durante el ciclo de vida
- Debe haber al menos un vendedor principal

### 3. Etapas de Venta

- Las oportunidades avanzan secuencialmente por las etapas
- Cada etapa tiene una probabilidad de cierre asociada
- "Ganada" y "Perdida" son etapas terminales
- Solo oportunidades activas pueden cambiar de etapa

### 4. Propuestas

- Una oportunidad puede tener múltiples propuestas (versiones)
- Las propuestas se generan cuando la oportunidad está en etapa "Propuesta Enviada" o posterior
- Cada propuesta hereda información de la oportunidad

### 5. Líneas de Negocio

- Clasifican el tipo de solución/producto que se vende
- Ayudan en reportes y análisis de pipeline

### 6. Preventa

- Usuario especializado que apoya técnicamente la oportunidad
- Opcional en etapas tempranas, requerido para "Propuesta Enviada"

---

## 💡 Campos Calculados y Métricas

### Monto Ponderado

```
montoPonderado = montoEstimado * etapa.probabilidad
```

### Días en Etapa Actual

```
diasEnEtapa = HOY - fechaUltimaActualizacionEtapa
```

### Tiempo del Ciclo de Venta

```
tiempoTotal = fechaCierre - fechaCreacion
```

---

## 🔄 Flujo del Proceso

```
1. PROSPECTO
   ↓ Calificación inicial
2. CALIFICADO
   ↓ Análisis de necesidad
3. NECESIDAD IDENTIFICADA
   ↓ Elaboración de propuesta
4. PROPUESTA ENVIADA
   ↓ Presentación y ajustes
5. NEGOCIACIÓN
   ↓ Cierre o rechazo
6. GANADA / PERDIDA / ABANDONADA
```

---

## 📊 Índices Recomendados

```sql
-- Para búsquedas por cuenta
INDEX idx_oportunidades_cuenta (idCuenta, idEstadoRegistro)

-- Para pipeline por etapa
INDEX idx_oportunidades_etapa (idEtapaVenta, fechaCierre)

-- Para reportes por vendedor
INDEX idx_usuarios_oportunidades (idUsuario, fechaAsignacion)

-- Para búsquedas por fecha de cierre
INDEX idx_oportunidades_fecha (fechaCierre, idEtapaVenta)

-- Para búsquedas por línea de negocio
INDEX idx_oportunidades_linea (idLineaNegocio, idEtapaVenta)
```

---

## 🎯 Casos de Uso

### 1. Pipeline de Ventas

- Visualizar todas las oportunidades agrupadas por etapa
- Calcular monto total y monto ponderado por etapa
- Identificar oportunidades estancadas

### 2. Pronóstico de Ventas

- Proyectar ingresos por mes basado en fechaCierre y probabilidad
- Analizar tendencias por línea de negocio
- Comparar pipeline actual vs periodos anteriores

### 3. Gestión de Vendedores

- Asignar oportunidades entre el equipo
- Medir desempeño por vendedor (tasa de conversión, monto cerrado)
- Balancear carga de trabajo

### 4. Seguimiento de Cuentas

- Ver todas las oportunidades de una cuenta
- Identificar patrones de compra
- Planificar estrategias de cross-sell/up-sell

---
