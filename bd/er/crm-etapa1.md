# CRM ETAPA 1 - Diagrama Unificado Completo

## Sistema CRM - Todas las Entidades Integradas

---

## 📝 Descripción

Este diagrama unifica todas las entidades del sistema CRM Etapa 1:
- **USUARIOS**: Personal interno del sistema
- **CUENTAS**: Empresas/organizaciones clientes
- **CONTACTOS**: Personas que trabajan en las cuentas
- **OPORTUNIDADES**: Oportunidades de negocio
- **ETAPAS DE VENTA**: Proceso de calificación con preguntas
- **PROPUESTAS**: Propuestas comerciales con versiones, secciones e items
- **CATÁLOGOS**: Entidades de configuración y soporte

---

## 🏗️ Diagrama ER Unificado - CRM ETAPA 1

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│              SISTEMA CRM COMPLETO - ETAPA 1 - TODAS LAS ENTIDADES                    │
└──────────────────────────────────────────────────────────────────────────────────────┘


═════════════════════════════════════════════════════════════════════════════════════
                              MÓDULO USUARIOS
═════════════════════════════════════════════════════════════════════════════════════

                            ┌──────────────────────────┐
                            │       usuarios           │
                            ├──────────────────────────┤
                            │ PK  idUsuario            │
                            │     nombresUsuario       │
                            │     apellidosUsuario     │
                            │     emailUsuario         │
                            │     avatar               │
                            │ FK  idEstadoRegistro     │
                            │     fechaCreacion        │
                            │     fechaActualizacion   │
                            └──────┬───────────────────┘
                                   │
                                   │ (creador/modificador/vendedores/preventa)
                                   │


═════════════════════════════════════════════════════════════════════════════════════
                        MÓDULO CUENTAS Y CONTACTOS
═════════════════════════════════════════════════════════════════════════════════════

         ┌─────────────────┐        ┌─────────────────┐
         │  tiposCuenta    │        │ sectoresCuenta  │
         ├─────────────────┤        ├─────────────────┤
         │ PK idTipoCuenta │        │ PK idSectorCuenta│
         │    nombre       │        │    nombre        │
         │    descripcion  │        │    descripcion   │
         │ FK idEstadoReg. │        │ FK idEstadoReg.  │
         └────────┬────────┘        └────────┬────────┘
                  │ 1                        │ 1
                  │                          │
                  │ M                        │ M
                  │         ┌────────────────┘
            ┌─────▼─────────▼────────────────────────────┐
            │           cuentas                          │
            ├────────────────────────────────────────────┤
            │ PK  idCuenta                               │
            │     nombreCuenta                           │
            │     razonSocialCuenta                      │
            │     rfcCuenta                              │
            │     webCuenta                              │
            │     descripcionCuenta                      │
            │ FK  idTipoCuenta                           │
            │ FK  idSectorCuenta                         │
            │ FK  idUsuarioCreador      ──────────────┐  │
            │ FK  idUsuarioModificador  ──────────────┤  │ usuarios
            │ FK  idEstadoRegistro                    │  │
            │     fechaCreacion                       │  │
            │     fechaActualizacion                  │  │
            └──────┬──────────────────────────────────┘  │
                   │                                     │
                   │ 1                                   │
                   │                                     │
                   │ M                                   │
                   │                                     │
     ┌─────────────▼──────────────┐                     │
     │       contactos            │                     │
     ├────────────────────────────┤                     │
     │ PK  idContacto             │                     │
     │ FK  idCuenta               │                     │
     │     nombresContacto        │                     │
     │     apellidosContacto      │                     │
     │     emailContacto          │                     │
     │     cargoContacto          │                     │
     │     departamentoContacto   │                     │
     │     rolCompra              │                     │
     │ FK  idJefeContacto ─┐ (auto-ref)                 │
     │ FK  idUsuarioCreador    ───────────────────────────┤
     │ FK  idUsuarioModificador ───────────────────────────┤
     │ FK  idEstadoRegistro       │                     │
     │     fechaCreacion          │                     │
     │     fechaActualizacion     │                     │
     └────────────────────────────┘                     │
                                                        │
    ┌───────────────────────────┐                      │
    │  usuariosCuentas (M:M)    │                      │
    ├───────────────────────────┤                      │
    │ PK  id                    │                      │
    │ FK  idUsuario      ───────────────────────────────┘
    │ FK  idCuenta              │
    │     esPropietario         │
    │     esJefe                │
    │     fechaAsignacion       │
    └───────────────────────────┘


═════════════════════════════════════════════════════════════════════════════════════
                           MÓDULO OPORTUNIDADES
═════════════════════════════════════════════════════════════════════════════════════

    ┌───────────────────────────────────────────────────────────┐
    │                      oportunidades                        │
    ├───────────────────────────────────────────────────────────┤
    │ PK  idOportunidad                                         │
    │ FK  idCuenta          ─────────────────────► cuentas      │
    │     nombreOportunidad                                     │
    │     descripcionOportunidad                                │
    │     montoEstimado                                         │
    │     fechaCierre                                           │
    │ FK  idContacto        ─────────────────────► contactos    │
    │ FK  idEtapaVenta      ─────────────────────► etapasVenta  │
    │ FK  idLineaNegocio    ─────────────────────► lineasNegocio│
    │ FK  idPreventa        ─────────────────────► usuarios     │
    │ FK  idEstadoRegistro                                      │
    │ FK  idUsuarioCreador  ─────────────────────► usuarios     │
    │ FK  idUsuarioModificador ───────────────────► usuarios    │
    │     fechaCreacion                                         │
    │     fechaActualizacion                                    │
    └──────┬────────────────────┬───────────────────────────────┘
           │                    │
           │ 1                  │ M
           │                    │
           │ M                  │ M
           │                    │
    ┌──────▼─────────────┐      └──────────────┐
    │    propuestas      │                     │
    │                    │           ┌─────────▼──────────────┐
    │ (ver abajo)        │           │ usuariosOportunidades  │
    └────────────────────┘           │    (vendedores M:M)    │
                                     ├────────────────────────┤
                                     │ PK  id                 │
                                     │ FK  idOportunidad      │
                                     │ FK  idUsuario ─────────► usuarios
                                     │     esPrincipal        │
                                     │     fechaAsignacion    │
                                     └────────────────────────┘


═════════════════════════════════════════════════════════════════════════════════════
                      MÓDULO ETAPAS DE VENTA CON PREGUNTAS
═════════════════════════════════════════════════════════════════════════════════════

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
    │ FK  idOportunidad     ──────────────────► oportunidades      │
    │ FK  idPregunta                                               │
    │     respuestaSiNo                                            │
    │     respuestaTexto                                           │
    │     respuestaOpcion                                          │
    │     respuestaFecha                                           │
    │     esRespuestaAdecuada                                      │
    │ FK  idUsuarioRespuesta ──────────────────► usuarios          │
    │     fechaRespuesta                                           │
    └──────────────────────────────────────────────────────────────┘

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


═════════════════════════════════════════════════════════════════════════════════════
                           MÓDULO PROPUESTAS
═════════════════════════════════════════════════════════════════════════════════════

    ┌──────────▼────────────────────────────┐
    │          propuestas                   │
    ├───────────────────────────────────────┤
    │ PK  idPropuesta                       │
    │ FK  idOportunidad                     │
    │ FK  idEstadoRegistro                  │
    │ FK  idUsuarioCreador ─────────────────► usuarios
    │ FK  idUsuarioModificador ─────────────► usuarios
    │     fechaCreacion                     │
    │     fechaActualizacion                │
    └──────┬────────────┬───────────────────┘
           │            │
           │ 1          │ M
           │            │
           │ 1..M       │ M
           │            │
    ┌──────▼──────────────────────┐  ┌──────▼─────────────────┐
    │  versionesPropuesta         │  │  usuariosPropuestas    │
    ├─────────────────────────────┤  │  (vendedores)          │
    │ PK  idVersion               │  ├────────────────────────┤
    │ FK  idPropuesta             │  │ PK  id                 │
    │     nombrePropuesta         │  │ FK  idPropuesta        │
    │     numeroVersion           │  │ FK  idUsuario ─────────► usuarios
    │     fechaVersion            │  │     esPrincipal        │
    │     introduccion            │  │     fechaAsignacion    │
    │ FK  idMoneda                │  └────────────────────────┘
    │ FK  idValidez               │
    │ FK  idCondicionesPago       │
    │ FK  idTiempoEntrega         │
    │ FK  idGarantia              │
    │ FK  idContacto ────────────────────────► contactos
    │ FK  idPreventa ─────────────────────────► usuarios
    │ FK  idEstadoPropuesta       │
    │ FK  idEstadoRegistro        │
    │     notasComerciales        │
    │     notasInternas           │
    │     esActual                │
    │ FK  idUsuarioCreador ───────────────────► usuarios
    │ FK  idUsuarioModificador ───────────────► usuarios
    │     fechaCreacion           │
    │     fechaActualizacion      │
    └──────┬──────────────────────┘
           │
           │ 1
           │
           │ M
           │
    ┌──────▼──────────────────────┐
    │  seccionesPropuesta         │
    ├─────────────────────────────┤
    │ PK  idSeccion               │
    │ FK  idVersion               │
    │     tituloSeccion           │
    │ FK  idVisibilidadSeccion    │
    │ FK  idEstadoRegistro        │
    │     orden                   │
    └──────┬──────────────────────┘
           │
           │ 1
           │
           │ M
           │
    ┌──────▼──────────────────────┐
    │  itemsPropuesta             │
    ├─────────────────────────────┤
    │ PK  idItem                  │
    │ FK  idSeccion               │
    │ FK  idFabricante ──────────────────► fabricantes
    │ FK  idTipoProducto ───────────► tiposProductos
    │     codigoItem              │        (búsqueda en catalogoItems)
    │     descripcionItem         │
    │     cantidad                │
    │     precioListaUnitario     │
    │     descuentoFabricante     │
    │     importacion             │
    │     margen                  │
    │     descuentoFinal          │
    │     resaltado               │
    │     escondido               │
    │     filaTexto               │
    │     sinPrecio               │
    │     perteneceFormula        │
    │ FK  idEstadoRegistro        │
    │     orden                   │
    └─────────────────────────────┘


═════════════════════════════════════════════════════════════════════════════════════
                      TABLAS CATÁLOGO Y COMPARTIDAS
═════════════════════════════════════════════════════════════════════════════════════

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  estadosRegistro         │      │  estadosPropuesta        │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idEstadoRegistro      │      │ PK idEstadoPropuesta     │
    │    nombre                │      │    nombre                │
    │    descripcion           │      │    descripcion           │
    └──────────────────────────┘      │    orden                 │
    Estados: Activo, Inactivo,        │ FK idEstadoRegistro      │
             Pendiente                └──────────────────────────┘
                                      Estados: Borrador, En aprobación,
                                              Aprobada, Rechazada, Enviada,
                                              Ganada, Aceptada, Perdida,
                                              No vigente, Abandonada

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  tiposProductos          │      │  fabricantes             │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idTipoProducto        │      │ PK idFabricante          │
    │ UK nombre                │      │ UK nombre                │
    │    descripcion           │      │    descripcion           │
    │ FK idEstadoRegistro      │      │ FK idEstadoRegistro      │
    └──────────────────────────┘      └──────────┬───────────────┘
    Tipos: Producto,                  Ej: "F5 Productos"
           Servicio,                      "F5 Servicios"
           Renovación                     "F5 Renovaciones"
                                          "AccessQuality Servicios"
                                                   │
                                                   │ 1
                                                   │
                                                   │ M
                                                   │
                                       ┌───────────▼──────────────┐
                                       │  catalogoItems           │
                                       ├──────────────────────────┤
                                       │ PK idCatalogoItem        │
                                       │ FK idFabricante          │
                                       │ UK codigo (con Fabricante)│
                                       │    nombre                │
                                       │    descripcion           │
                                       │    precioLista           │
                                       │ FK idEstadoRegistro      │
                                       │ UNIQUE (idFabricante,    │
                                       │         codigo)          │
                                       └──────────────────────────┘
                                       Código NO es único global,
                                       solo único por fabricante

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  lineasNegocio           │      │  tiposMoneda             │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idLineaNegocio        │      │ PK idMoneda              │
    │    nombre                │      │    nombre                │
    │    nombreCorto           │      │    codigo                │
    │    descripcion           │      │    simbolo               │
    │ FK idEstadoRegistro      │      │ FK idEstadoRegistro      │
    └──────────────────────────┘      └──────────────────────────┘
    Líneas: F5 DCS, F5 Nginx,        Ej: USD, MXN, EUR
            F5 tradicional, F5 renovaciones,
            Bluecat DDI, Bluecat Edge,
            Servicios

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  opcionesValidez         │      │  condicionesPago         │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idValidez             │      │ PK idCondicionesPago     │
    │    nombre                │      │    nombre                │
    │    descripcion           │      │    descripcion           │
    │    dias                  │      │ FK idEstadoRegistro      │
    │ FK idEstadoRegistro      │      └──────────────────────────┘
    └──────────────────────────┘      Ej: 50% anticipo,
    Ej: 30 días, 60 días, 90 días         50% contra entrega


    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  tiemposEntrega          │      │  opcionesGarantia        │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idTiempoEntrega       │      │ PK idGarantia            │
    │    nombre                │      │    nombre                │
    │    descripcion           │      │    descripcion           │
    │    dias                  │      │    meses                 │
    │ FK idEstadoRegistro      │      │ FK idEstadoRegistro      │
    └──────────────────────────┘      └──────────────────────────┘
    Ej: 5 días, 10 días, 15 días      Ej: 6 meses, 12 meses, 24 meses


    ┌──────────────────────────┐
    │  visibilidadesSeccion    │
    ├──────────────────────────┤
    │ PK idVisibilidadSeccion  │
    │    nombre                │
    │    descripcion           │
    │ FK idEstadoRegistro      │
    └──────────────────────────┘
    Visibilidad: Incluir, Ocultar, Opcional


    ┌────────────────────────────┐         ┌────────────────────────────┐
    │      direcciones           │         │       telefonos            │
    │      (COMPARTIDA)          │         │      (COMPARTIDA)          │
    ├────────────────────────────┤         ├────────────────────────────┤
    │ PK  idDireccion            │         │ PK  idTelefono             │
    │ FK  idCuenta    (NULL)     │         │ FK  idCuenta    (NULL)     │
    │ FK  idContacto  (NULL)     │         │ FK  idContacto  (NULL)     │
    │ FK  idUsuario   (NULL)     │         │ FK  idUsuario   (NULL)     │
    │     tipo                   │         │     tipo                   │
    │     direccion              │         │     numero                 │
    │     ciudad                 │         │     extension              │
    │     estado                 │         │     esPrincipal            │
    │     pais                   │         │     activo                 │
    │     codigoPostal           │         └────────────────────────────┘
    │     esPrincipal            │         CHECK: Solo uno de los 3 FK
    │     activo                 │         debe tener valor (no NULL)
    └────────────────────────────┘
    CHECK: Solo uno de los 3 FK
    debe tener valor (no NULL)


═════════════════════════════════════════════════════════════════════════════════════
                        RESUMEN DE RELACIONES
═════════════════════════════════════════════════════════════════════════════════════

FLUJO PRINCIPAL:
    cuentas (1) ──► (M) contactos
    cuentas (1) ──► (M) oportunidades
    oportunidades (M) ──► (1) etapasVenta
    oportunidades (1) ──► (M) propuestas
    propuestas (1) ──► (1..M) versionesPropuesta [mínimo 1 versión obligatoria]
    versionesPropuesta (1) ──► (M) seccionesPropuesta
    seccionesPropuesta (1) ──► (M) itemsPropuesta

USUARIOS Y AUDITORÍA:
    • usuarios (1) ──► (M) cuentas (como creador/modificador)
    • usuarios (1) ──► (M) contactos (como creador/modificador)
    • usuarios (1) ──► (M) oportunidades (como creador/modificador/preventa)
    • usuarios (1) ──► (M) propuestas (como creador/modificador)
    • usuarios (1) ──► (M) versionesPropuesta (como preventa/creador/modificador)
    • usuarios (M) ◄──► (M) cuentas (usuariosCuentas - vendedores compartidos)
    • usuarios (M) ◄──► (M) oportunidades (usuariosOportunidades - vendedores)
    • usuarios (M) ◄──► (M) propuestas (usuariosPropuestas - vendedores)
    • usuarios (1) ──► (M) direcciones (opcional)
    • usuarios (1) ──► (M) telefonos (opcional)

CATÁLOGOS DE CUENTAS:
    • cuentas (M) ──► (1) tiposCuenta
    • cuentas (M) ──► (1) sectoresCuenta
    • cuentas (M) ──► (1) estadosRegistro
    • cuentas (1) ──► (M) direcciones
    • cuentas (1) ──► (M) telefonos

CATÁLOGOS DE CONTACTOS:
    • contactos (M) ──► (1) cuentas
    • contactos (M) ──► (1) contactos (idJefeContacto - auto-referencia)
    • contactos (M) ──► (1) estadosRegistro
    • contactos (1) ──► (M) direcciones
    • contactos (1) ──► (M) telefonos

CATÁLOGOS DE OPORTUNIDADES:
    • oportunidades (M) ──► (1) cuentas
    • oportunidades (M) ──► (1) contactos (contacto principal)
    • oportunidades (M) ──► (1) etapasVenta
    • oportunidades (M) ──► (1) lineasNegocio
    • oportunidades (M) ──► (1) estadosRegistro
    • oportunidades (M) ──► (1) usuarios (preventa)

PROCESO DE ETAPAS DE VENTA:
    • etapasVenta (1) ──► (M) preguntasEtapa
    • preguntasEtapa (1) ──► (M) respuestasOportunidad
    • oportunidades (1) ──► (M) respuestasOportunidad
    • oportunidades (1) ──► (M) historialEtapasOportunidad

CATÁLOGOS DE PROPUESTAS:
    • versionesPropuesta (M) ──► (1) tiposMoneda
    • versionesPropuesta (M) ──► (1) opcionesValidez
    • versionesPropuesta (M) ──► (1) condicionesPago
    • versionesPropuesta (M) ──► (1) tiemposEntrega
    • versionesPropuesta (M) ──► (1) opcionesGarantia
    • versionesPropuesta (M) ──► (1) estadosPropuesta
    • versionesPropuesta (M) ──► (1) contactos (contacto de la versión)
    • seccionesPropuesta (M) ──► (1) visibilidadesSeccion
    • seccionesPropuesta (M) ──► (1) estadosRegistro
    • itemsPropuesta (M) ──► (1) fabricantes
    • itemsPropuesta (M) ──► (1) tiposProductos
    • fabricantes (1) ──► (M) catalogoItems

ESTADOS:
    • estadosRegistro ◄── (M) usuarios, cuentas, contactos, oportunidades, 
                               propuestas, versionesPropuesta, seccionesPropuesta, 
                               itemsPropuesta, fabricantes, catalogoItems, 
                               tiposCuenta, sectoresCuenta, lineasNegocio,
                               etapasVenta, preguntasEtapa, estadosPropuesta,
                               tiposMoneda, opcionesValidez, condicionesPago,
                               tiemposEntrega, opcionesGarantia, visibilidadesSeccion,
                               tiposProductos
```

---

## 📊 Módulos del Sistema

### 1. USUARIOS
- Usuarios internos del sistema CRM
- Tienen roles y permisos
- Crean y modifican todos los registros
- Participan como vendedores y preventas

### 2. CUENTAS Y CONTACTOS
- **Cuentas**: Empresas/organizaciones clientes
- **Contactos**: Personas que trabajan en las cuentas
- Clasificación por tipo y sector
- Jerarquías de contactos (jefe-subordinado)
- Múltiples usuarios pueden compartir una cuenta

### 3. OPORTUNIDADES
- Generadas desde cuentas
- Clasificadas por línea de negocio
- Avanzan por etapas del proceso de ventas
- Múltiples vendedores asignados
- Generan propuestas comerciales

### 4. ETAPAS DE VENTA
- Proceso estructurado de 10 etapas
- Cada etapa tiene preguntas de calificación
- Validación mediante respuestas adecuadas
- Historial completo de cambios
- Etapas finales: Ganado, Perdido, Abandonado

### 5. PROPUESTAS
- Generadas desde oportunidades
- Múltiples versiones por propuesta (mínimo 1)
- Estructura: propuesta → versión → sección → item
- Items referencian catalogoItems mediante fabricante + código
- Control de estados y versionado

---

## 🔑 Entidades Compartidas

### DIRECCIONES y TELEFONOS
- Compartidas por usuarios, cuentas y contactos
- CHECK constraint: solo uno de los 3 FK puede tener valor

### ESTADOSREGISTRO
- Usada por casi todas las entidades
- Estados: Activo, Inactivo, Pendiente

---

## 📦 Catálogos Principales

### Cuentas:
- **tiposCuenta**: Potencial, Cliente, Fabricante, etc.
- **sectoresCuenta**: Sectores industriales

### Oportunidades:
- **etapasVenta**: 10 etapas con preguntas de calificación
- **lineasNegocio**: F5 DCS, F5 Nginx, F5 tradicional, F5 renovaciones, Bluecat DDI, Bluecat Edge, Servicios
- **preguntasEtapa**: Preguntas de calificación por etapa
- **respuestasOportunidad**: Respuestas a preguntas
- **historialEtapasOportunidad**: Auditoría de cambios de etapa

### Propuestas:
- **estadosPropuesta**: Estados del ciclo de propuesta
- **fabricantes**: Fabricantes/proveedores
- **catalogoItems**: Items (productos/servicios/renovaciones) por fabricante
- **tiposMoneda**: USD, MXN, EUR
- **opcionesValidez**: Vigencia de propuestas (30, 60, 90 días)
- **condicionesPago**: Términos de pago
- **tiemposEntrega**: Plazos de entrega (5, 10, 15 días)
- **opcionesGarantia**: Periodos de garantía (6, 12, 24 meses)
- **visibilidadesSeccion**: Control de visibilidad (Incluir, Ocultar, Opcional)

---

## 💡 Características Clave

1. **Normalización**: Datos compartidos en tablas independientes
2. **Auditoría Completa**: Todos los registros tienen creador/modificador y fechas
3. **Versionado**: Propuestas con múltiples versiones
4. **Proceso Estructurado**: Etapas con preguntas de calificación
5. **Flexibilidad**: Catálogos configurables
6. **Integridad**: FK constraints y CHECK constraints
7. **Escalabilidad**: catalogoItems soporta millones de registros
8. **Trazabilidad**: Historial de cambios de etapas
9. **camelCase**: Notación consistente en toda la base de datos

---

## 🔄 Flujo Completo del Proceso de Ventas

```
1. CUENTA creada
   ↓
2. CONTACTOS añadidos a la cuenta
   ↓
3. OPORTUNIDAD identificada en la cuenta
   ↓
4. Oportunidad avanza por ETAPAS DE VENTA
   - Responde preguntas de calificación en cada etapa
   - Historial registra todos los movimientos
   ↓
5. PROPUESTA generada desde la oportunidad
   ↓
6. VERSIONES de propuesta creadas
   - Múltiples versiones (v1, v2, v3...)
   - Una versión marcada como actual
   ↓
7. SECCIONES añadidas a la versión
   - Con control de visibilidad
   ↓
8. ITEMS añadidos a secciones
   - Referencias a catalogoItems por fabricante + código
   - Cálculos de precios, descuentos, márgenes
   ↓
9. Oportunidad llega a GANADO
   ↓
10. Propuesta se convierte en ORDEN DE COMPRA
```

---

## 📈 Etapas del Proceso de Ventas

1. **Contacto Inicial** (10%) - Primera interacción
2. **Identificación de Oportunidad** (20%) - Calificación inicial
3. **Desarrollo** (40%) - Análisis de necesidades
4. **Cotización** (60%) - Propuesta económica
5. **Demostración** (70%) - Prueba de concepto
6. **Negociación** (80%) - Ajustes y términos
7. **Waiting** (85%) - Esperando aprobaciones
8. **Ganado** (100%) - Cierre exitoso [FINAL]
9. **Perdido** (0%) - No se ganó [FINAL]
10. **Abandonado** (0%) - Descartado [FINAL]

---

## 🎯 Entidades Principales por Módulo

**Total de entidades: 30**

### Módulo Core (8):
1. usuarios
2. cuentas
3. contactos
4. oportunidades
5. propuestas
6. versionesPropuesta
7. seccionesPropuesta
8. itemsPropuesta

### Módulo Relaciones M:M (3):
9. usuariosCuentas
10. usuariosOportunidades
11. usuariosPropuestas

### Módulo Etapas de Venta (4):
12. etapasVenta
13. preguntasEtapa
14. respuestasOportunidad
15. historialEtapasOportunidad

### Módulo Compartido (2):
16. direcciones
17. telefonos

### Catálogos de Configuración (14):
18. estadosRegistro
19. estadosPropuesta
20. tiposCuenta
21. sectoresCuenta
22. lineasNegocio
23. tiposProductos
24. fabricantes
25. catalogoItems
26. tiposMoneda
27. opcionesValidez
28. condicionesPago
29. tiemposEntrega
30. opcionesGarantia
31. visibilidadesSeccion

Total: 8 + 3 + 4 + 2 + 14 = 31 entidades

---
