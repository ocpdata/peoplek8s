# Mejoras: Entidad CONTACTOS

## Sistema CRM - Normalización de Contactos y sus Relaciones

---

## 📝 Descripción de la Entidad

La entidad **CONTACTOS** representa a las personas individuales que trabajan en las cuentas (empresas/organizaciones). Esta entidad incluye información detallada sobre cada contacto, su rol en el proceso de compra, relaciones jerárquicas y relaciones de influencia entre contactos.

### Características Principales:

- Cada contacto pertenece a una cuenta (empresa)
- Un contacto puede tener múltiples direcciones y teléfonos
- Los contactos pueden tener relaciones jerárquicas (jefe-subordinado)
- Los contactos pueden tener relaciones de influencia entre sí
- Usa notación **camelCase** en todos los campos

---

## 🏗️ Diagrama ER - Módulo CONTACTOS

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                          CONTACTOS Y RELACIONES                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


                            ┌──────────────────────────┐
                            │       cuentas            │
                            ├──────────────────────────┤
                            │ PK  idCuenta            │
                            │     nombreCuenta         │
                            │     razonSocialCuenta    │
                            │     rfcCuenta            │
                            │     activo               │
                            └──────────┬───────────────┘
                                       │
                                       │ 1
                                       │
                                       │ M
                                       │
    ┌──────────────────────────────────▼────────────────────────────────────┐
    │                          contactos                                    │
    │  ┌─────────────────────────────────────────────────────────────────┐ │
    │  │ PK  idContacto                                                  │ │
    │  │ FK  idCuenta                                                    │ │
    │  │     nombresContacto                                             │ │
    │  │     apellidosContacto                                           │ │
    │  │     emailContacto                                               │ │
    │  │     cargoContacto                                               │ │
    │  │     departamentoContacto                                        │ │
    │  │     rolCompra                                                   │ │
    │  │ FK  idJefeContacto ──┐                                          │ │
    │  │ FK  idContactoInfluye ──┐  AUTO-REFERENCIAS                     │ │
    │  │ FK  idContactoInfluenciado ──┐  (apuntan a contactos)           │ │
    │  │ FK  idUsuarioCreador (usuarios del sistema)                     │ │
    │  │ FK  idUsuarioModificador (usuarios del sistema)                 │ │
    │  │ FK  idEstadoRegistro (estadosRegistro)                          │ │
    │  │     fechaCreacion                                               │ │
    │  │     fechaActualizacion                                          │ │
    │  └─────────────────────────────────────────────────────────────────┘ │
    │         ▲                    ▲                        ▲               │
    └─────────┼────────────────────┼────────────────────────┼───────────────┘
              │                    │                        │
          idJefe                idContacto             idContacto
        (jerarquía)             Influye              Influenciado
              │                    │                        │
              └────────────────────┴────────────────────────┘
                     RELACIONES ENTRE CONTACTOS
                     DE LA MISMA CUENTA


              │                    │
              │ 1                  │ 1
              │                    │
              │ M                  │ M
              │                    │
┌─────────────▼──────┐   ┌────────▼───────────┐
│  direcciones       │   │   telefonos        │
│    (COMPARTIDA)    │   │   (COMPARTIDA)     │
├────────────────────┤   ├────────────────────┤
│ PK idDireccion     │   │ PK idTelefono      │
│ FK idCuenta (NULL) │   │ FK idCuenta (NULL) │
│ FK idContacto(NULL)│   │ FK idContacto(NULL)│
│ FK idUsuario (NULL)│   │ FK idUsuario (NULL)│
│    tipo            │   │    tipo            │
│    direccion       │   │    numero          │
│    ciudad          │   │    extension       │
│    estado          │   │    esPrincipal     │
│    pais            │   │    activo          │
│    codigoPostal    │   └────────────────────┘
│    esPrincipal     │   CHECK: Solo uno de
│    activo          │   los 3 FK no NULL
└────────────────────┘
CHECK: Solo uno de
los 3 FK no NULL


    AUDITORÍA (usuarios del sistema CRM):

    ┌──────────────────────────────────┐
    │      usuarios                    │
    ├──────────────────────────────────┤
    │ PK  idUsuario                    │
    │     nombre                       │
    │     email                        │
    │     activo                       │
    └──────────────────────────────────┘
              ▲
              │
              │ FK: idUsuarioCreador
              │ FK: idUsuarioModificador
              │ (desde contactos)


    ESTADOS DE REGISTRO:

    ┌──────────────────────────────────┐
    │    estadosRegistro               │
    ├──────────────────────────────────┤
    │ PK  idEstadoRegistro             │
    │     nombre                       │
    │     descripcion                  │
    └──────────────────────────────────┘
              ▲
              │
              │ FK: idEstadoRegistro
              │ (desde contactos)
              │
    Valores: 1=Activo, 2=Inactivo, 3=Pendiente
);

-- Datos iniciales
INSERT INTO estadosRegistro (nombre, descripcion) VALUES
('Activo', 'Registro activo y disponible'),
('Inactivo', 'Registro inactivo o eliminado'),
('Pendiente', 'Registro pendiente de validación o activación');
```

### Tabla contactos

```sql
CREATE TABLE contactos (
    idContacto INT PRIMARY KEY AUTO_INCREMENT,
    idCuenta INT NOT NULL,
    nombresContacto VARCHAR(100) NOT NULL,
    apellidosContacto VARCHAR(100) NOT NULL,
    emailContacto VARCHAR(100),
    cargoContacto VARCHAR(100),
    departamentoContacto VARCHAR(100),
    rolCompra VARCHAR(100),
    idJefeContacto INT NULL,
    idContactoInfluye INT NULL,
    idContactoInfluenciado INT NULL,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idJefeContacto) REFERENCES contactos(idContacto) ON DELETE SET NULL,
    FOREIGN KEY (idContactoInfluye) REFERENCES contactos(idContacto) ON DELETE SET NULL,
    FOREIGN KEY (idContactoInfluenciado) REFERENCES contactos(idContacto) ON DELETE SET NULL,
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),

    INDEX idx_cuenta (idCuenta),
    INDEX idx_jefe (idJefeContacto),
    INDEX idx_email (emailContacto),
    INDEX idx_rol_compra (rolCompra),
    INDEX idx_estado (idEstadoRegistro)
);
```

---

## 📊 Campos Detallados

### Campos de Identificación

| Campo      | Tipo     | Descripción                         |
| ---------- | -------- | ----------------------------------- |
| idContacto | INT (PK) | Identificador único del contacto    |
| idCuenta   | INT (FK) | Cuenta (empresa) a la que pertenece |

### Campos de Información Personal

| Campo             | Tipo         | Descripción              |
| ----------------- | ------------ | ------------------------ |
| nombresContacto   | VARCHAR(100) | Nombre(s) del contacto   |
| apellidosContacto | VARCHAR(100) | Apellido(s) del contacto |
| emailContacto     | VARCHAR(100) | Correo electrónico       |

### Campos de Información Laboral

| Campo                | Tipo         | Descripción                   |
| -------------------- | ------------ | ----------------------------- |
| cargoContacto        | VARCHAR(100) | Puesto o cargo en la empresa  |
| departamentoContacto | VARCHAR(100) | Departamento al que pertenece |
| rolCompra            | VARCHAR(100) | Rol en el proceso de compra   |

### Campos de Relaciones

| Campo                  | Tipo     | Descripción                                  |
| ---------------------- | -------- | -------------------------------------------- |
| idJefeContacto         | INT (FK) | Jefe directo del contacto (jerárquico)       |
| idContactoInfluye      | INT (FK) | Contacto que ejerce influencia sobre este    |
| idContactoInfluenciado | INT (FK) | Contacto sobre el que este ejerce influencia |

### Campos de Control

| Campo                | Tipo      | Descripción                                     |
| -------------------- | --------- | ----------------------------------------------- |
| idUsuarioCreador     | INT (FK)  | Usuario que creó el registro                    |
| idUsuarioModificador | INT (FK)  | Usuario que modificó por última vez             |
| idEstadoRegistro     | INT (FK)  | Estado del registro (Activo/Inactivo/Pendiente) |
| fechaCreacion        | TIMESTAMP | Fecha de creación del registro                  |
| fechaActualizacion   | TIMESTAMP | Fecha de última modificación                    |

---

## 📊 Relaciones con Otras Entidades

### 1. **cuentas → contactos** - **1:M** (Obligatorio)

- **Descripción**: Una cuenta (empresa) puede tener múltiples contactos
- **Cardinalidad**: Un contacto pertenece a una y solo una cuenta
- **Campo FK**: `idCuenta` en contactos
- **Eliminación**: CASCADE - Al eliminar una cuenta, se eliminan sus contactos
- **Regla de Negocio**: Cada contacto debe estar asociado a una cuenta

### 2. **contactos → contactos (idJefeContacto)** - **1:M** (Auto-referencia)

- **Descripción**: Relación jerárquica entre contactos
- **Cardinalidad**: Un contacto puede tener un jefe, y un jefe puede supervisar múltiples contactos
- **Campo FK**: `idJefeContacto` en contactos
- **Eliminación**: SET NULL - Al eliminar un jefe, se mantienen los subordinados
- **Regla de Negocio**: Usado para mapear la estructura organizacional de la cuenta

### 3. **contactos → contactos (Influencia)** - **M:M** (Auto-referencia)

- **Descripción**: Relación de influencia entre contactos
- **Cardinalidad**: Un contacto puede influir en múltiples contactos y ser influenciado por múltiples contactos
- **Campos FK**:
  - `idContactoInfluye`: Contacto que ejerce influencia
  - `idContactoInfluenciado`: Contacto que recibe influencia
- **Eliminación**: SET NULL - Al eliminar un contacto, se mantienen los demás
- **Regla de Negocio**: Útil para mapear el poder de decisión y las relaciones de influencia en ventas complejas

### 4. **contactos → direcciones** - **1:M**

- **Descripción**: Un contacto puede tener múltiples direcciones
- **Cardinalidad**: Una dirección pertenece a un contacto O a una cuenta (nunca ambos)
- **Campo FK**: `idContacto` en direcciones
- **Eliminación**: CASCADE - Al eliminar un contacto, se eliminan sus direcciones
- **Regla de Negocio**:
  - Puede tener direcciones tipo: "Casa", "Oficina", "Temporal", etc.
  - Solo una dirección puede ser principal (`esPrincipal = TRUE`)

### 5. **contactos → telefonos** - **1:M**

- **Descripción**: Un contacto puede tener múltiples teléfonos
- **Cardinalidad**: Un teléfono pertenece a un contacto O a una cuenta (nunca ambos)
- **Campo FK**: `idContacto` en telefonos
- **Eliminación**: CASCADE - Al eliminar un contacto, se eliminan sus teléfonos
- **Regla de Negocio**:
  - Puede tener teléfonos tipo: "Móvil", "Oficina", "Casa", "Directo", etc.
  - Solo un teléfono puede ser principal (`esPrincipal = TRUE`)

### 6. **usuarios → contactos (Creación)** - **1:M**

- **Descripción**: Seguimiento de auditoría - quién creó el contacto
- **Cardinalidad**: Un usuario del sistema puede crear múltiples contactos
- **Campo FK**: `idUsuarioCreador` en contactos
- **Referencia**: `usuarios(idUsuario)` - Tabla de usuarios del sistema CRM
- **Eliminación**: RESTRICT - No se puede eliminar un usuario si ha creado contactos
- **Regla de Negocio**: Registro de auditoría obligatorio

### 7. **usuarios → contactos (Modificación)** - **1:M**

- **Descripción**: Seguimiento de auditoría - quién modificó por última vez el contacto
- **Cardinalidad**: Un usuario del sistema puede modificar múltiples contactos
- **Campo FK**: `idUsuarioModificador` en contactos
- **Referencia**: `usuarios(idUsuario)` - Tabla de usuarios del sistema CRM
- **Eliminación**: RESTRICT - No se puede eliminar un usuario si ha modificado contactos
- **Regla de Negocio**: Registro de auditoría opcional (NULL permitido)

### 8. **estadosRegistro → contactos** - **1:M**

- **Descripción**: Control del estado del registro del contacto
- **Cardinalidad**: Un estado puede aplicarse a múltiples contactos
- **Campo FK**: `idEstadoRegistro` en contactos
- **Referencia**: `estadosRegistro(idEstadoRegistro)` - Tabla de estados
- **Eliminación**: RESTRICT - No se puede eliminar un estado si hay contactos asociados
- **Regla de Negocio**: Todo contacto debe tener un estado (por defecto: Activo)
- **Estados posibles**:
  - **Activo**: Contacto activo y disponible
  - **Inactivo**: Contacto desactivado o eliminado lógicamente
  - **Pendiente**: Contacto pendiente de validación o activación

---

## 📝 Aclaración Importante sobre Relaciones

**Usuarios del Sistema vs Contactos:**

- **`usuarios`**: Son los usuarios del sistema CRM (vendedores, administradores, etc.) que utilizan la aplicación
- **`contactos`**: Son las personas que trabajan en las cuentas/empresas (clientes potenciales o existentes)

**Relaciones entre Contactos (Auto-referencias):**

- `idJefeContacto` → `contactos(idContacto)`: Un contacto puede reportar a otro contacto de la misma cuenta
- `idContactoInfluye` → `contactos(idContacto)`: Un contacto puede influir sobre otro contacto
- `idContactoInfluenciado` → `contactos(idContacto)`: Un contacto puede ser influenciado por otro contacto

**Relaciones con Usuarios del Sistema:**

- `idUsuarioCreador` → `usuarios(idUsuario)`: Usuario del sistema que creó el registro del contacto
- `idUsuarioModificador` → `usuarios(idUsuario)`: Usuario del sistema que modificó el registro del contacto

---

## 📌 Roles en el Proceso de Compra

El campo `rolCompra` puede contener valores como:

- **Decisor**: Toma la decisión final de compra
- **Influenciador**: Influye en la decisión pero no la toma
- **Usuario Final**: Usará el producto/servicio
- **Comprador**: Ejecuta la compra (procurement)
- **Guardián**: Controla el acceso a los decisores
- **Evaluador Técnico**: Evalúa aspectos técnicos
- **Patrocinador**: Apoya internamente el proyecto
- **Bloqueador**: Puede bloquear la compra
- **Prescriptor**: Recomienda la solución

---

## 🔍 Consultas SQL Comunes

### Ver contactos de una cuenta con toda su información

```sql
SELECT
    c.idContacto,
    c.nombresContacto,
    c.apellidosContacto,
    CONCAT(c.nombresContacto, ' ', c.apellidosContacto) as nombreCompleto,
    c.emailContacto,
    c.cargoContacto,
    c.departamentoContacto,
    c.rolCompra,
    ct.nombreCuenta as cuenta,
    jefe.nombresContacto as nombreJefe,
    GROUP_CONCAT(DISTINCT
        CONCAT(t.tipo, ': ', t.numero,
               CASE WHEN t.extension IS NOT NULL
                    THEN CONCAT(' ext. ', t.extension)
                    ELSE '' END)
        SEPARATOR ' | '
    ) as telefonos,
    GROUP_CONCAT(DISTINCT
        CONCAT(d.tipo, ': ', d.direccion, ', ', d.ciudad)
        SEPARATOR ' | '
    ) as direcciones
FROM contactos c
JOIN cuentas ct ON c.idCuenta = ct.idCuenta
LEFT JOIN contactos jefe ON c.idJefeContacto = jefe.idContacto
LEFT JOIN telefonos t ON c.idContacto = t.idContacto AND t.activo = TRUE
LEFT JOIN direcciones d ON c.idContacto = d.idContacto AND d.activo = TRUE
WHERE c.idCuenta = ?
  AND c.idEstadoRegistro = 1 -- Activo
GROUP BY c.idContacto;
```

### Ver contacto con información principal

```sql
SELECT
    c.idContacto,
    c.nombresContacto,
    c.apellidosContacto,
    CONCAT(c.nombresContacto, ' ', c.apellidosContacto) as nombreCompleto,
    c.emailContacto,
    c.cargoContacto,
    c.departamentoContacto,
    c.rolCompra,
    ct.nombreCuenta as cuenta,
    jefe.nombresContacto as nombreJefe,
    t.numero as telefonoPrincipal,
    t.tipo as tipoTelefono,
    d.direccion as direccionPrincipal,
    d.ciudad,
    d.estado,
    d.pais
FROM contactos c
JOIN cuentas ct ON c.idCuenta = ct.idCuenta
LEFT JOIN contactos jefe ON c.idJefeContacto = jefe.idContacto
LEFT JOIN telefonos t ON c.idContacto = t.idContacto
    AND t.esPrincipal = TRUE
    AND t.activo = TRUE
LEFT JOIN direcciones d ON c.idContacto = d.idContacto
    AND d.esPrincipal = TRUE
    AND d.activo = TRUE
WHERE c.idContacto = ?
  AND c.idEstadoRegistro = 1; -- Activo
```

### Ver jerarquía organizacional de una cuenta

```sql
-- Contactos con sus jefes directos
SELECT
    c.idContacto,
    CONCAT(c.nombresContacto, ' ', c.apellidosContacto) as contacto,
    c.cargoContacto,
    c.departamentoContacto,
    CONCAT(jefe.nombresContacto, ' ', jefe.apellidosContacto) as jefe,
    jefe.cargoContacto as cargoJefe
FROM contactos c
LEFT JOIN contactos jefe ON c.idJefeContacto = jefe.idContacto
WHERE c.idCuenta = ?
  AND c.idEstadoRegistro = 1 -- Activo
ORDER BY c.departamentoContacto, c.cargoContacto;
```

### Ver mapa de influencia entre contactos

```sql
-- Relaciones de influencia
SELECT
    CONCAT(influenciador.nombresContacto, ' ', influenciador.apellidosContacto) as influenciador,
    influenciador.cargoContacto as cargoInfluenciador,
    CONCAT(influenciado.nombresContacto, ' ', influenciado.apellidosContacto) as influenciado,
    influenciado.cargoContacto as cargoInfluenciado
FROM contactos c
JOIN contactos influenciador ON c.idContactoInfluye = influenciador.idContacto
JOIN contactos influenciado ON c.idContactoInfluenciado = influenciado.idContacto
WHERE c.idCuenta = ?
  AND c.idEstadoRegistro = 1; -- Activo
```

### Ver contactos por rol en el proceso de compra

```sql
SELECT
    c.rolCompra,
    COUNT(*) as cantidad,
    GROUP_CONCAT(
        CONCAT(c.nombresContacto, ' ', c.apellidosContacto, ' (', c.cargoContacto, ')')
        SEPARATOR ', '
    ) as contactos
FROM contactos c
WHERE c.idCuenta = ?
  AND c.idEstadoRegistro = 1 -- Activo
GROUP BY c.rolCompra
ORDER BY cantidad DESC;
```

### Buscar contactos decisores en todas las cuentas

```sql
SELECT
    ct.nombreCuenta,
    CONCAT(c.nombresContacto, ' ', c.apellidosContacto) as contacto,
    c.cargoContacto,
    c.emailContacto,
    t.numero as telefono
FROM contactos c
JOIN cuentas ct ON c.idCuenta = ct.idCuenta
LEFT JOIN telefonos t ON c.idContacto = t.idContacto
    AND t.esPrincipal = TRUE
WHERE c.rolCompra = 'Decisor'
  AND c.idEstadoRegistro = 1 -- Activo
  AND ct.activo = TRUE
ORDER BY ct.nombreCuenta;
```

---

## 📌 Reglas de Negocio

### ✅ Datos Obligatorios

1. **Campos requeridos**:

   - `idCuenta`: Todo contacto debe pertenecer a una cuenta
   - `nombre`: Obligatorio
   - `apellido`: Obligatorio
   - `idUsuarioCreador`: Para auditoría

2. **Campos opcionales**:
   - `email`: Recomendado pero no obligatorio
   - `cargo`, `departamento`, `rolCompra`: Opcionales
   - `idJefe`: Opcional (no todos los contactos tienen jefe)
   - Campos de influencia: Opcionales

### ✅ Relaciones Jerárquicas

1. Un contacto puede tener **un jefe** (relación 1:1 hacia arriba)
2. Un contacto puede ser **jefe de múltiples contactos** (relación 1:M hacia abajo)
3. Los contactos con `idJefe = NULL` son los de más alto nivel en su organización
4. Al eliminar un jefe, los subordinados permanecen con `idJefe = NULL`

### ✅ Relaciones de Influencia

1. Un contacto puede **influir en múltiples contactos** diferentes
2. Un contacto puede **ser influenciado por múltiples contactos** diferentes
3. Las relaciones de influencia son **independientes** de las relaciones jerárquicas
4. Útil para mapear el **centro de poder** en ventas complejas

### ✅ Direcciones y Teléfonos

1. Un contacto puede tener **múltiples direcciones**
2. Un contacto puede tener **múltiples teléfonos**
3. Solo **una dirección** puede ser principal por contacto
4. Solo **un teléfono** puede ser principal por contacto
5. Al eliminar un contacto, se eliminan sus direcciones y teléfonos (CASCADE)

### ✅ Validaciones

1. El `emailContacto` debe tener formato válido si se proporciona
2. No puede haber **ciclos** en la jerarquía (un contacto no puede ser jefe de sí mismo)
3. Las relaciones de influencia (`idContactoInfluye`, `idContactoInfluenciado`) deben ser entre **contactos** de la misma cuenta
4. El `idJefeContacto` debe apuntar a otro **contacto** de la misma cuenta (no a un usuario del sistema)
5. Los campos `idUsuarioCreador` y `idUsuarioModificador` apuntan a **usuarios del sistema CRM**, no a contactos
6. El `idEstadoRegistro` debe ser un valor válido de la tabla **estadosRegistro**

### ✅ Gestión de Estados

1. Los contactos se marcan con `idEstadoRegistro = 2` (Inactivo) en lugar de eliminarse físicamente
2. Los contactos inactivos se mantienen para **historial** de oportunidades y cotizaciones
3. Solo se muestran contactos activos (`idEstadoRegistro = 1`) en las consultas normales
4. Usar `WHERE idEstadoRegistro = 1` en todas las consultas de usuario
5. Estados disponibles:
   - **Activo** (1): Contacto disponible y operativo
   - **Inactivo** (2): Contacto desactivado o eliminado lógicamente
   - **Pendiente** (3): Contacto pendiente de validación o activación

---

## Vista: Contactos Completos

```sql
CREATE OR REPLACE VIEW vista_contactos_completos AS
SELECT
    c.idContacto,
    c.idCuenta,
    ct.nombreCuenta as cuenta,
    c.nombresContacto,
    c.apellidosContacto,
    CONCAT(c.nombresContacto, ' ', c.apellidosContacto) as nombreCompleto,
    c.emailContacto,
    c.cargoContacto,
    c.departamentoContacto,
    c.rolCompra,
    CONCAT(jefe.nombresContacto, ' ', jefe.apellidosContacto) as nombreJefe,
    jefe.cargoContacto as cargoJefe,
    tp.numero as telefonoPrincipal,
    tp.tipo as tipoTelefono,
    dp.direccion as direccionPrincipal,
    dp.ciudad,
    dp.estado,
    dp.pais,
    u.nombre as nombreCreador,
    um.nombre as nombreModificador,
    c.fechaCreacion,
    c.fechaActualizacion
FROM contactos c
JOIN cuentas ct ON c.idCuenta = ct.idCuenta
LEFT JOIN contactos jefe ON c.idJefeContacto = jefe.idContacto
LEFT JOIN telefonos tp ON c.idContacto = tp.idContacto
    AND tp.esPrincipal = TRUE
    AND tp.activo = TRUE
LEFT JOIN direcciones dp ON c.idContacto = dp.idContacto
    AND dp.esPrincipal = TRUE
    AND dp.activo = TRUE
LEFT JOIN usuarios u ON c.idUsuarioCreador = u.idUsuario
LEFT JOIN usuarios um ON c.idUsuarioModificador = um.idUsuario
WHERE c.idEstadoRegistro = 1; -- Solo contactos activos
```

---

## 📈 Mejores Prácticas

### 1. Gestión de Relaciones

- **Mapear la jerarquía completa**: Identificar quién reporta a quién
- **Identificar al centro de poder**: Usar relaciones de influencia para estrategia de ventas
- **Actualizar regularmente**: Las organizaciones cambian, mantener actualizado

### 2. Roles en el Proceso de Compra

- **Identificar múltiples roles**: Un contacto puede tener varios roles
- **Priorizar decisores e influenciadores**: Foco en quienes toman decisiones
- **No ignorar bloqueadores**: Pueden detener el proceso de venta

### 3. Información de Contacto

- **Mantener múltiples vías**: Varios teléfonos y direcciones
- **Marcar principal claramente**: Facilita la comunicación rápida
- **Verificar regularidad**: Validar que los datos de contacto sean actuales

### 4. Auditoría y Seguimiento

- **Registrar quién crea**: `idUsuarioCreador` para responsabilidad (apunta a usuarios del sistema)
- **Registrar quién modifica**: `idUsuarioModificador` para trazabilidad (apunta a usuarios del sistema)
- **Control de estados**: Usar `idEstadoRegistro` para gestión de ciclo de vida (Activo/Inactivo/Pendiente)
- **Soft delete**: Mantener historial con `idEstadoRegistro = 2` (Inactivo)
- **Timestamps automáticos**: `fechaCreacion` y `fechaActualizacion`
- **Distinción clara**: Usuarios del sistema (CRM) vs contactos (clientes)

### 5. Gestión de Estados

- **Activo (1)**: Usar por defecto para contactos operativos
- **Inactivo (2)**: Para contactos que ya no son relevantes pero se mantienen en historial
- **Pendiente (3)**: Para contactos que requieren validación antes de activarse
- **Filtrar siempre**: Incluir `WHERE idEstadoRegistro = 1` en consultas normales

---

## 📋 Resumen

### Características Clave de CONTACTOS:

- ✅ **Relación obligatoria** con cuentas (1:M)
- ✅ **Auto-referencias** para jerarquía (`idJefeContacto`) e influencia (`idContactoInfluye`, `idContactoInfluenciado`) que apuntan a otros contactos
- ✅ **Múltiples direcciones y teléfonos** por contacto
- ✅ **Roles en proceso de compra** para estrategia de ventas
- ✅ **Gestión de estados** con tabla `estadosRegistro` (Activo/Inactivo/Pendiente)
- ✅ **Soft delete** mediante estados en lugar de eliminación física
- ✅ **Auditoría completa** con `idUsuarioCreador` e `idUsuarioModificador` (usuarios del sistema CRM) y timestamps
- ✅ **Notación camelCase** consistente en todos los campos
- ✅ **Campos con sufijo "Contacto"** para mayor claridad

### Relaciones:

| Relación                            | Tipo | Descripción                                     |
| ----------------------------------- | ---- | ----------------------------------------------- |
| cuentas → contactos                 | 1:M  | Una cuenta tiene múltiples contactos            |
| contactos → contactos (jerarquía)   | 1:M  | Jerarquía organizacional (jefe-subordinado)     |
| contactos ↔ contactos (influencia)  | M:M  | Relaciones de influencia entre contactos        |
| contactos → direcciones             | 1:M  | Múltiples direcciones por contacto              |
| contactos → telefonos               | 1:M  | Múltiples teléfonos por contacto                |
| usuarios → contactos (creación)     | 1:M  | Auditoría: usuario del sistema que creó         |
| usuarios → contactos (modificación) | 1:M  | Auditoría: usuario del sistema que modificó     |
| estadosRegistro → contactos         | 1:M  | Estado del registro (Activo/Inactivo/Pendiente) |

### Campos Principales:

| Campo                  | Tipo         | Descripción                                             |
| ---------------------- | ------------ | ------------------------------------------------------- |
| idContacto             | INT (PK)     | Identificador único                                     |
| idCuenta               | INT (FK)     | Cuenta a la que pertenece                               |
| nombresContacto        | VARCHAR(100) | Nombre(s) del contacto                                  |
| apellidosContacto      | VARCHAR(100) | Apellido(s) del contacto                                |
| emailContacto          | VARCHAR(100) | Correo electrónico                                      |
| cargoContacto          | VARCHAR(100) | Puesto en la empresa                                    |
| departamentoContacto   | VARCHAR(100) | Departamento                                            |
| rolCompra              | VARCHAR(100) | Rol en proceso de compra                                |
| idJefeContacto         | INT (FK)     | Jefe directo → contactos(idContacto)                    |
| idContactoInfluye      | INT (FK)     | Contacto influyente → contactos(idContacto)             |
| idContactoInfluenciado | INT (FK)     | Contacto influenciado → contactos(idContacto)           |
| idUsuarioCreador       | INT (FK)     | Usuario del sistema que creó → usuarios(idUsuario)      |
| idUsuarioModificador   | INT (FK)     | Usuario del sistema que modificó → usuarios(idUsuario)  |
| idEstadoRegistro       | INT (FK)     | Estado del registro → estadosRegistro(idEstadoRegistro) |

### Distinción Importante:

**Relaciones a CONTACTOS (otras personas en cuentas/empresas):**

- `idJefeContacto` → `contactos(idContacto)` - Jefe directo
- `idContactoInfluye` → `contactos(idContacto)` - Contacto que influye
- `idContactoInfluenciado` → `contactos(idContacto)` - Contacto influenciado

**Relaciones a USUARIOS (del sistema CRM):**

- `idUsuarioCreador` → `usuarios(idUsuario)` - Vendedor/admin que creó el registro
- `idUsuarioModificador` → `usuarios(idUsuario)` - Vendedor/admin que modificó el registro

### Casos de Uso Principales:

1. Gestión de contactos por cuenta
2. Mapeo de estructura organizacional
3. Identificación de centro de poder e influencia
4. Estrategia de ventas por rol en proceso de compra
5. Historial de relaciones y comunicaciones
