# Entidad USUARIOS

## Sistema CRM - Usuarios del Sistema

---

## 📝 Descripción de la Entidad

La entidad **USUARIOS** representa a las personas que utilizan el sistema CRM (vendedores, administradores, gerentes, etc.). Estos son los usuarios internos de la aplicación, no los contactos de las cuentas/clientes.

### Características Principales:

- Representa a los usuarios internos del sistema CRM
- Cada usuario tiene información personal, de contacto y acceso
- Los usuarios pueden tener roles y permisos
- Los usuarios son quienes crean y modifican registros en el sistema
- Usa notación **camelCase** en todos los campos

---

## 🏗️ Diagrama ER - Módulo USUARIOS

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              USUARIOS DEL SISTEMA                                    │
└──────────────────────────────────────────────────────────────────────────────────────┘


    ┌────────────────────────────────────────────┐
    │              usuarios                      │
    ├────────────────────────────────────────────┤
    │ PK  idUsuario                              │
    │     nombresUsuario                         │
    │     apellidosUsuario                       │
    │     emailUsuario                           │
    │     password                               │
    │     avatar                                 │
    │ FK  idEstadoRegistro                       │
    │     fechaCreacion                          │
    │     fechaActualizacion                     │
    └────────────────────────────────────────────┘
                         │
                         │ 1
                         │
                         │ M
                         │
                         ▼
         ┌───────────────────────────────────────┐
         │      estadosRegistro                  │
         ├───────────────────────────────────────┤
         │ PK  idEstadoRegistro                  │
         │     nombre (Activo/Inactivo/Pendiente)│
         │     descripcion                       │
         └───────────────────────────────────────┘


    TABLAS COMPARTIDAS (por cuentas, contactos y usuarios):

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


    RELACIONES CON OTRAS ENTIDADES:

    usuarios (1) ──────► (M) cuentas (como creador)
    usuarios (1) ──────► (M) cuentas (como modificador)
    usuarios (1) ──────► (M) contactos (como creador)
    usuarios (1) ──────► (M) contactos (como modificador)
    usuarios (M) ◄────► (M) cuentas (usuariosCuentas - compartidas)
```

---

## 📋 Definición de las Tablas

### Tabla estadosRegistro

```sql
CREATE TABLE estadosRegistro (
    idEstadoRegistro INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),

    INDEX idx_nombre (nombre)
);

-- Datos iniciales
INSERT INTO estadosRegistro (nombre, descripcion) VALUES
('Activo', 'Registro activo y disponible'),
('Inactivo', 'Registro inactivo o eliminado'),
('Pendiente', 'Registro pendiente de validación o activación');
```

### Tabla usuarios

```sql
CREATE TABLE usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombresUsuario VARCHAR(100) NOT NULL,
    apellidosUsuario VARCHAR(100) NOT NULL,
    emailUsuario VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),

    INDEX idx_email (emailUsuario),
    INDEX idx_estado (idEstadoRegistro),
    INDEX idx_nombres (nombresUsuario, apellidosUsuario)
);
```

**Nota sobre teléfonos y direcciones:**
Los usuarios utilizan las mismas tablas compartidas `telefonos` y `direcciones` que usan cuentas y contactos.
Para asociar teléfonos y direcciones a usuarios, estas tablas tienen un campo `idUsuario` (ver definición completa en entidad-cuentas.md).

### Tabla telefonos (Compartida - ver entidad-cuentas.md)

```sql
-- Esta tabla es compartida por cuentas, contactos y usuarios
CREATE TABLE telefonos (
    idTelefono INT PRIMARY KEY AUTO_INCREMENT,
    idCuenta INT NULL,
    idContacto INT NULL,
    idUsuario INT NULL,
    tipo VARCHAR(50),
    numero VARCHAR(20) NOT NULL,
    extension VARCHAR(10),
    esPrincipal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_telefono_pertenencia CHECK (
        (idCuenta IS NOT NULL AND idContacto IS NULL AND idUsuario IS NULL) OR
        (idCuenta IS NULL AND idContacto IS NOT NULL AND idUsuario IS NULL) OR
        (idCuenta IS NULL AND idContacto IS NULL AND idUsuario IS NOT NULL)
    ),
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idContacto) REFERENCES contactos(idContacto) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,

    INDEX idx_cuenta (idCuenta),
    INDEX idx_contacto (idContacto),
    INDEX idx_usuario (idUsuario),
    INDEX idx_tipo (tipo)
);
```

### Tabla direcciones (Compartida - ver entidad-cuentas.md)

```sql
-- Esta tabla es compartida por cuentas, contactos y usuarios
CREATE TABLE direcciones (
    idDireccion INT PRIMARY KEY AUTO_INCREMENT,
    idCuenta INT NULL,
    idContacto INT NULL,
    idUsuario INT NULL,
    tipo VARCHAR(50),
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL DEFAULT 'México',
    codigoPostal VARCHAR(10),
    esPrincipal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_direccion_pertenencia CHECK (
        (idCuenta IS NOT NULL AND idContacto IS NULL AND idUsuario IS NULL) OR
        (idCuenta IS NULL AND idContacto IS NOT NULL AND idUsuario IS NULL) OR
        (idCuenta IS NULL AND idContacto IS NULL AND idUsuario IS NOT NULL)
    ),
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idContacto) REFERENCES contactos(idContacto) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,

    INDEX idx_cuenta (idCuenta),
    INDEX idx_contacto (idContacto),
    INDEX idx_usuario (idUsuario),
    INDEX idx_ciudad (ciudad),
    INDEX idx_estado (estado)
);
```

---

## 📊 Campos Detallados

### Campos de Identificación

| Campo     | Tipo     | Descripción                     |
| --------- | -------- | ------------------------------- |
| idUsuario | INT (PK) | Identificador único del usuario |

### Campos de Información Personal

| Campo            | Tipo         | Descripción                    |
| ---------------- | ------------ | ------------------------------ |
| nombresUsuario   | VARCHAR(100) | Nombre(s) del usuario          |
| apellidosUsuario | VARCHAR(100) | Apellido(s) del usuario        |
| emailUsuario     | VARCHAR(100) | Correo electrónico (único)     |
| password         | VARCHAR(255) | Contraseña (hash bcrypt/argon) |
| avatar           | VARCHAR(255) | URL o ruta de imagen de perfil |

### Campos de Control

| Campo              | Tipo      | Descripción                                     |
| ------------------ | --------- | ----------------------------------------------- |
| idEstadoRegistro   | INT (FK)  | Estado del registro (Activo/Inactivo/Pendiente) |
| fechaCreacion      | TIMESTAMP | Fecha de creación del registro                  |
| fechaActualizacion | TIMESTAMP | Fecha de última modificación                    |

**Nota sobre Contacto**: Los usuarios tienen teléfonos y direcciones asociadas a través de las tablas compartidas `telefonos` y `direcciones` (relación 1:M por `idUsuario`).

---

## 📊 Relaciones con Otras Entidades

### 1. **usuarios → telefonos** - **1:M**

- **Descripción**: Un usuario puede tener múltiples teléfonos asociados
- **Cardinalidad**: Cada teléfono pertenece a un solo usuario (o cuenta o contacto)
- **Campo FK**: `idUsuario` en telefonos
- **Referencia**: `usuarios(idUsuario)` → `telefonos(idUsuario)`
- **Eliminación**: CASCADE - Al eliminar el usuario, se eliminan sus teléfonos
- **Regla de Negocio**: La tabla telefonos es compartida entre cuentas, contactos y usuarios (CHECK constraint)
- **Nota**: Usar `esPrincipal = TRUE` para marcar el teléfono principal

### 2. **usuarios → direcciones** - **1:M**

- **Descripción**: Un usuario puede tener múltiples direcciones asociadas
- **Cardinalidad**: Cada dirección pertenece a un solo usuario (o cuenta o contacto)
- **Campo FK**: `idUsuario` en direcciones
- **Referencia**: `usuarios(idUsuario)` → `direcciones(idUsuario)`
- **Eliminación**: CASCADE - Al eliminar el usuario, se eliminan sus direcciones
- **Regla de Negocio**: La tabla direcciones es compartida entre cuentas, contactos y usuarios (CHECK constraint)
- **Nota**: Usar `esPrincipal = TRUE` para marcar la dirección principal

### 3. **estadosRegistro → usuarios** - **1:M**

- **Descripción**: Control del estado del registro del usuario
- **Cardinalidad**: Un estado puede aplicarse a múltiples usuarios
- **Campo FK**: `idEstadoRegistro` en usuarios
- **Referencia**: `estadosRegistro(idEstadoRegistro)` - Tabla de estados
- **Eliminación**: RESTRICT - No se puede eliminar un estado si hay usuarios asociados
- **Regla de Negocio**: Todo usuario debe tener un estado (por defecto: Activo)
- **Estados posibles**:
  - **Activo** (1): Usuario activo y disponible
  - **Inactivo** (2): Usuario desactivado o eliminado lógicamente
  - **Pendiente** (3): Usuario pendiente de validación o activación

### 4. **usuarios → cuentas (creación)** - **1:M**

- **Descripción**: Auditoría - usuarios que crean cuentas
- **Cardinalidad**: Un usuario puede crear múltiples cuentas
- **Campo FK**: `idUsuarioCreador` en cuentas
- **Eliminación**: RESTRICT - No se puede eliminar un usuario si ha creado cuentas

### 5. **usuarios → cuentas (modificación)** - **1:M**

- **Descripción**: Auditoría - usuarios que modifican cuentas
- **Cardinalidad**: Un usuario puede modificar múltiples cuentas
- **Campo FK**: `idUsuarioModificador` en cuentas
- **Eliminación**: RESTRICT - No se puede eliminar un usuario si ha modificado cuentas

### 6. **usuarios → contactos (creación)** - **1:M**

- **Descripción**: Auditoría - usuarios que crean contactos
- **Cardinalidad**: Un usuario puede crear múltiples contactos
- **Campo FK**: `idUsuarioCreador` en contactos
- **Eliminación**: RESTRICT - No se puede eliminar un usuario si ha creado contactos

### 7. **usuarios → contactos (modificación)** - **1:M**

- **Descripción**: Auditoría - usuarios que modifican contactos
- **Cardinalidad**: Un usuario puede modificar múltiples contactos
- **Campo FK**: `idUsuarioModificador` en contactos
- **Eliminación**: RESTRICT - No se puede eliminar un usuario si ha modificado contactos

### 8. **usuarios ↔ cuentas (compartir)** - **M:M**

- **Descripción**: Cuentas compartidas entre usuarios (equipos de ventas)
- **Cardinalidad**: Un usuario puede tener acceso a múltiples cuentas y una cuenta puede ser compartida con múltiples usuarios
- **Tabla intermedia**: `usuariosCuentas`
- **Atributos adicionales**: `esPropietario`, `esJefe`, `fechaAsignacion`

---

## 📝 Aclaración Importante

**Usuarios del Sistema vs Contactos:**

- **`usuarios`**: Son los usuarios del sistema CRM (vendedores, administradores, etc.) que utilizan la aplicación internamente
- **`contactos`**: Son las personas que trabajan en las cuentas/empresas (clientes potenciales o existentes)

**Diferencia clave:**

- Los **usuarios** acceden al sistema CRM y gestionan información
- Los **contactos** son gestionados por los usuarios y representan clientes

---

## 🔍 Consultas SQL Comunes

### Ver todos los usuarios activos

```sql
SELECT
    u.idUsuario,
    CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) as nombreCompleto,
    u.emailUsuario,
    u.avatar,
    t.numero as telefono,
    d.ciudad,
    d.estado,
    er.nombre as estado
FROM usuarios u
LEFT JOIN telefonos t ON t.idUsuario = u.idUsuario AND t.esPrincipal = TRUE
LEFT JOIN direcciones d ON d.idUsuario = u.idUsuario AND d.esPrincipal = TRUE
JOIN estadosRegistro er ON u.idEstadoRegistro = er.idEstadoRegistro
WHERE u.idEstadoRegistro = 1 -- Activo
ORDER BY u.apellidosUsuario, u.nombresUsuario;
```

### Ver usuario por email

```sql
SELECT
    u.*,
    CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) as nombreCompleto,
    t.numero as telefono,
    t.tipo as tipoTelefono,
    d.direccion,
    d.ciudad,
    d.estado,
    d.pais,
    er.nombre as estadoRegistro
FROM usuarios u
LEFT JOIN telefonos t ON t.idUsuario = u.idUsuario AND t.esPrincipal = TRUE
LEFT JOIN direcciones d ON d.idUsuario = u.idUsuario AND d.esPrincipal = TRUE
JOIN estadosRegistro er ON u.idEstadoRegistro = er.idEstadoRegistro
WHERE u.emailUsuario = ?;
```

### Ver actividad de un usuario (cuentas creadas)

```sql
SELECT
    CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) as usuario,
    COUNT(DISTINCT c.idCuenta) as cuentasCreadas,
    COUNT(DISTINCT co.idContacto) as contactosCreados,
    u.fechaCreacion as fechaRegistro
FROM usuarios u
LEFT JOIN cuentas c ON u.idUsuario = c.idUsuarioCreador
LEFT JOIN contactos co ON u.idUsuario = co.idUsuarioCreador
WHERE u.idUsuario = ?
GROUP BY u.idUsuario;
```

### Ver usuarios con sus cuentas compartidas

```sql
SELECT
    CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) as usuario,
    c.nombreCuenta,
    uc.esPropietario,
    uc.esJefe,
    uc.fechaAsignacion
FROM usuarios u
JOIN usuariosCuentas uc ON u.idUsuario = uc.idUsuario
JOIN cuentas c ON uc.idCuenta = c.idCuenta
WHERE u.idEstadoRegistro = 1 -- Activo
  AND c.idEstadoRegistro = 1 -- Activo
ORDER BY u.apellidosUsuario, c.nombreCuenta;
```

### Buscar usuarios por nombre

```sql
SELECT
    u.idUsuario,
    CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) as nombreCompleto,
    u.emailUsuario,
    er.nombre as estado
FROM usuarios u
JOIN estadosRegistro er ON u.idEstadoRegistro = er.idEstadoRegistro
WHERE (u.nombresUsuario LIKE ? OR u.apellidosUsuario LIKE ?)
  AND u.idEstadoRegistro = 1 -- Activo
ORDER BY u.apellidosUsuario, u.nombresUsuario;
```

---

## 📌 Reglas de Negocio

### ✅ Datos Obligatorios

1. **Campos requeridos**:

   - `nombresUsuario`: Obligatorio
   - `apellidosUsuario`: Obligatorio
   - `emailUsuario`: Obligatorio y único
   - `idEstadoRegistro`: Obligatorio (por defecto: Activo)

2. **Campos opcionales**:
   - `avatar`: Opcional (URL o ruta a imagen de perfil)
   - `idTelefonoUsuario`: Opcional
   - `idDireccionUsuario`: Opcional

### ✅ Validaciones

1. El `emailUsuario` debe ser único en el sistema
2. El `emailUsuario` debe tener formato de email válido
3. El `idEstadoRegistro` debe ser un valor válido de la tabla **estadosRegistro**
4. El `idTelefonoUsuario` debe existir en la tabla **telefonos** si se proporciona
5. El `idDireccionUsuario` debe existir en la tabla **direcciones** si se proporciona

### ✅ Gestión de Estados

1. Los usuarios se marcan con `idEstadoRegistro = 2` (Inactivo) en lugar de eliminarse físicamente
2. Los usuarios inactivos mantienen su historial de cuentas y contactos creados
3. Solo se muestran usuarios activos (`idEstadoRegistro = 1`) en las consultas normales
4. Usar `WHERE idEstadoRegistro = 1` en todas las consultas de usuario activo
5. Estados disponibles:
   - **Activo** (1): Usuario disponible y operativo
   - **Inactivo** (2): Usuario desactivado o eliminado lógicamente
   - **Pendiente** (3): Usuario pendiente de validación o activación

### ✅ Información de Contacto

1. Un usuario puede tener múltiples teléfonos y direcciones asociados
2. Las tablas `telefonos` y `direcciones` son compartidas entre cuentas, contactos y usuarios
3. Se puede marcar un teléfono y una dirección como principal usando el campo `esPrincipal = TRUE`
4. El CHECK constraint en ambas tablas asegura que cada registro pertenezca exclusivamente a una cuenta, contacto o usuario
5. Los cambios en teléfonos y direcciones no afectan el registro histórico del usuario

### ✅ Auditoría

1. Los usuarios no pueden eliminarse físicamente si han creado o modificado cuentas o contactos
2. Se mantiene el historial de auditoría (quién creó/modificó qué)
3. Los timestamps se actualizan automáticamente

---

## 📊 Vista: Usuarios Completos

```sql
CREATE OR REPLACE VIEW vista_usuarios_completos AS
SELECT
    u.idUsuario,
    u.nombresUsuario,
    u.apellidosUsuario,
    CONCAT(u.nombresUsuario, ' ', u.apellidosUsuario) as nombreCompleto,
    u.emailUsuario,
    u.avatar,
    t.numero as telefonoPrincipal,
    t.tipo as tipoTelefono,
    t.extension,
    d.direccion as direccionCompleta,
    d.ciudad,
    d.estado,
    d.pais,
    d.codigoPostal,
    er.nombre as estadoRegistro,
    er.descripcion as descripcionEstado,
    u.fechaCreacion,
    u.fechaActualizacion
FROM usuarios u
LEFT JOIN telefonos t ON t.idUsuario = u.idUsuario AND t.esPrincipal = TRUE
LEFT JOIN direcciones d ON d.idUsuario = u.idUsuario AND d.esPrincipal = TRUE
JOIN estadosRegistro er ON u.idEstadoRegistro = er.idEstadoRegistro;
```

---

## 📈 Mejores Prácticas

### 1. Gestión de Usuarios

- **Email único**: Cada usuario debe tener un email único para identificación
- **Avatar**: Almacenar URL o ruta relativa, no el archivo en la BD
- **Información de contacto**: Mantener teléfono y dirección actualizados
- **Estados claros**: Usar estados para controlar acceso al sistema

### 2. Seguridad

- **Validar emails**: Verificar formato y existencia antes de registrar
- **No eliminar físicamente**: Usar soft delete para mantener auditoría
- **Controlar acceso**: Usuarios inactivos no deben poder acceder al sistema
- **Auditoría**: Mantener registro de quién creó/modificó qué

### 3. Información de Contacto

- **Teléfono opcional**: No todos los usuarios necesitan teléfono en el sistema
- **Dirección opcional**: Puede no ser necesaria para todos los usuarios
- **Actualización**: Facilitar la actualización de información de contacto

### 4. Gestión de Estados

- **Activo (1)**: Usar por defecto para usuarios operativos
- **Inactivo (2)**: Para usuarios que ya no trabajan pero se mantiene historial
- **Pendiente (3)**: Para usuarios nuevos que requieren validación
- **Filtrar siempre**: Incluir `WHERE idEstadoRegistro = 1` en consultas de usuarios activos

---

## 📋 Resumen

### Características Clave de USUARIOS:

- ✅ **Email único** como identificador principal
- ✅ **Información personal** completa (nombres, apellidos, avatar)
- ✅ **Contacto opcional** (teléfono y dirección)
- ✅ **Gestión de estados** con tabla `estadosRegistro` (Activo/Inactivo/Pendiente)
- ✅ **Soft delete** mediante estados en lugar de eliminación física
- ✅ **Auditoría**: Usuarios son creadores/modificadores de cuentas y contactos
- ✅ **Relación M:M** con cuentas para compartir (usuariosCuentas)
- ✅ **Notación camelCase** consistente en todos los campos
- ✅ **Campos con sufijo "Usuario"** para mayor claridad

### Relaciones:

| Relación                            | Tipo | Descripción                                                  |
| ----------------------------------- | ---- | ------------------------------------------------------------ |
| usuarios → telefonos                | 1:M  | Usuario puede tener múltiples teléfonos (tabla compartida)   |
| usuarios → direcciones              | 1:M  | Usuario puede tener múltiples direcciones (tabla compartida) |
| estadosRegistro → usuarios          | 1:M  | Estado del registro (Activo/Inactivo/Pendiente)              |
| usuarios → cuentas (creación)       | 1:M  | Auditoría: usuario que creó cuentas                          |
| usuarios → cuentas (modificación)   | 1:M  | Auditoría: usuario que modificó cuentas                      |
| usuarios → contactos (creación)     | 1:M  | Auditoría: usuario que creó contactos                        |
| usuarios → contactos (modificación) | 1:M  | Auditoría: usuario que modificó contactos                    |
| usuarios ↔ cuentas (compartir)      | M:M  | Cuentas compartidas (usuariosCuentas)                        |

### Campos Principales:

| Campo            | Tipo         | Descripción                                             |
| ---------------- | ------------ | ------------------------------------------------------- |
| idUsuario        | INT (PK)     | Identificador único                                     |
| nombresUsuario   | VARCHAR(100) | Nombre(s) del usuario                                   |
| apellidosUsuario | VARCHAR(100) | Apellido(s) del usuario                                 |
| emailUsuario     | VARCHAR(100) | Correo electrónico (único)                              |
| avatar           | VARCHAR(255) | URL o ruta de imagen de perfil                          |
| idEstadoRegistro | INT (FK)     | Estado del registro → estadosRegistro(idEstadoRegistro) |

**Nota**: Los teléfonos y direcciones se almacenan en tablas compartidas con relación 1:M (ver definición de CREATE TABLE telefonos y direcciones arriba).

### Casos de Uso Principales:

1. Gestión de usuarios del sistema CRM
2. Control de acceso y autenticación
3. Auditoría de creación y modificación de registros
4. Compartir cuentas entre equipos de ventas
5. Gestión de estados de usuarios (activos, inactivos, pendientes)
6. Perfil de usuario con información de contacto
