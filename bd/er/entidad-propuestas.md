# Entidad PROPUESTAS

## Sistema CRM - Propuestas Comerciales y sus Versiones

---

## 📝 Descripción de la Entidad

La entidad **PROPUESTAS** representa las propuestas comerciales generadas a partir de oportunidades de negocio. Cada propuesta puede tener múltiples versiones, y cada versión está compuesta por secciones que contienen items específicos.

### Características Principales:

- Una oportunidad puede generar múltiples propuestas
- Cada propuesta puede tener múltiples versiones
- Cada versión se compone de secciones e items
- Múltiples vendedores pueden trabajar en una propuesta
- Se asigna un preventa y un contacto específico
- Control de estados del proceso de venta
- Auditoría completa de creación y modificación
- Usa notación **camelCase** en todos los campos

---

## 🏗️ Diagrama ER - Módulo PROPUESTAS

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                    PROPUESTAS, VERSIONES, SECCIONES E ITEMS                          │
└──────────────────────────────────────────────────────────────────────────────────────┘


    ┌───────────────────────┐
    │   oportunidades       │
    ├───────────────────────┤
    │ PK  idOportunidad     │
    │     nombreOportunidad │
    │     estado            │
    └──────────┬────────────┘
               │
               │ 1
               │
               │ M
               │
    ┌──────────▼────────────────────────────┐
    │          propuestas                   │
    ├───────────────────────────────────────┤
    │ PK  idPropuesta                       │
    │ FK  idOportunidad                     │
    │ FK  idEstadoRegistro                  │
    └──────┬────────────┬───────────────────┘
           │            │
           │ 1          │ M
           │            │
           │ M          │ M
           │            │
    ┌──────▼──────────────────────┐  ┌──────▼─────────────────┐
    │  versionesPropuesta         │  │  usuariosPropuestas    │
    ├─────────────────────────────┤  │  (vendedores)          │
    │ PK  idVersion               │  ├────────────────────────┤
    │ FK  idPropuesta             │  │ PK  id                 │
    │     nombrePropuesta         │  │ FK  idPropuesta        │
    │     numeroVersion           │  │ FK  idUsuario          │
    │     fechaVersion            │  │     esPrincipal        │
    │     introduccion            │  │     fechaAsignacion    │
    │ FK  idMoneda                │  └────────────────────────┘
    │ FK  idValidez               │
    │ FK  idCondicionesPago       │
    │ FK  idTiempoEntrega         │
    │ FK  idGarantia              │
    │ FK  idContacto              │
    │ FK  idPreventa              │
    │ FK  idEstadoPropuesta       │
    │ FK  idEstadoRegistro        │
    │     notasComerciales        │
    │     notasInternas           │
    │     esActual                │
    │ FK  idUsuarioCreador        │
    │ FK  idUsuarioModificador    │
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
    │ FK  idFabricante            │
    │ FK  idTipoProducto          │
    │     codigoItem              │
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
    └──────────────────────────────┘
    Búsqueda: idFabricante + codigoItem
    en catalogoItems


    TABLAS CATÁLOGO Y RELACIONES:

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
    │  estadosPropuesta        │      │  estadosRegistro         │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idEstadoPropuesta     │      │ PK idEstadoRegistro      │
    │    nombre                │      │    nombre                │
    │    descripcion           │      │    descripcion           │
    │    orden                 │      └──────────────────────────┘
    └──────────────────────────┘      Estados: 1=Activo
    Estados de propuesta:                       2=Inactivo
    - Borrador                                  3=Pendiente
    - En aprobación
    - Aprobada
    - Rechazada                 ┌──────────────────────────┐
    - Enviada                   │  visibilidadesSeccion    │
    - Ganada                    ├──────────────────────────┤
    - Aceptada                  │ PK idVisibilidadSeccion  │
    - Perdida                   │    nombre                │
    - No vigente                │    descripcion           │
    - Abandonada                └──────────────────────────┘
                                Visibilidad:
                                1=Incluir
                                2=Ocultar
                                3=Opcional

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  tiposMoneda             │      │  opcionesValidez         │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idMoneda              │      │ PK idValidez             │
    │    nombre                │      │    nombre                │
    │    codigo                │      │    descripcion           │
    │    simbolo               │      │    dias                  │
    └──────────────────────────┘      └──────────────────────────┘
    Ej: USD, MXN, EUR                 Ej: 30 días, 60 días, 90 días

    ┌──────────────────────────┐      ┌──────────────────────────┐
    │  condicionesPago         │      │  tiemposEntrega          │
    ├──────────────────────────┤      ├──────────────────────────┤
    │ PK idCondicionesPago     │      │ PK idTiempoEntrega       │
    │    nombre                │      │    nombre                │
    │    descripcion           │      │    descripcion           │
    └──────────────────────────┘      │    dias                  │
    Ej: 50% anticipo, 50% contra      └──────────────────────────┘
        entrega, Pago inmediato       Ej: 5 días, 10 días, 15 días

    ┌──────────────────────────┐
    │  opcionesGarantia        │
    ├──────────────────────────┤
    │ PK idGarantia            │
    │    nombre                │
    │    descripcion           │
    │    meses                 │
    └──────────────────────────┘
    Ej: 6 meses, 12 meses, 24 meses


    RELACIONES CON OTRAS ENTIDADES:

    oportunidades (1) ──────► (M) propuestas
    propuestas (1) ─────────► (1..M) versionesPropuesta  [mínimo 1 versión obligatoria]
    versionesPropuesta (1) ─► (M) seccionesPropuesta
    seccionesPropuesta (1) ─► (M) itemsPropuesta
    propuestas (M) ◄────────► (M) usuarios (vendedores - usuariosPropuestas)
    versionesPropuesta (M) ─► (1) usuarios (preventa)
    versionesPropuesta (M) ─► (1) contactos
    versionesPropuesta (M) ─► (1) estadosPropuesta
    versionesPropuesta (M) ─► (1) usuarios (creador)
    versionesPropuesta (M) ─► (1) usuarios (modificador)
    versionesPropuesta (M) ─► (1) estadosRegistro
    versionesPropuesta (M) ─► (1) tiposMoneda
    versionesPropuesta (M) ─► (1) opcionesValidez
    versionesPropuesta (M) ─► (1) condicionesPago
    versionesPropuesta (M) ─► (1) tiemposEntrega
    versionesPropuesta (M) ─► (1) opcionesGarantia
    seccionesPropuesta (M) ─► (1) visibilidadesSeccion
    seccionesPropuesta (M) ─► (1) estadosRegistro
    itemsPropuesta (M) ─► (1) fabricantes
    fabricantes (1) ─► (M) catalogoItems
```
