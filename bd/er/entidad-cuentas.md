# Mejoras: Entidades CUENTAS, DIRECCIONES, TELEFONOS, TIPOS y SECTORES

## Sistema CRM - Normalización y Clasificación de Datos

---

## 📝 Cambios Propuestos

### Problema Actual:

- Los campos de dirección y teléfono están duplicados en CUENTAS y CONTACTOS
- No se pueden almacenar múltiples direcciones o teléfonos por cuenta o contacto
- Dificulta el mantenimiento y actualización de información de contacto

### Solución:

- Crear entidad **DIRECCIONES** independiente
- Crear entidad **TELEFONOS** independiente
- Crear entidad **tiposCuenta** para clasificar cuentas (Potencial, Principal, Fabricante, etc.)
- Crear entidad **sectoresCuenta** para definir sectores industriales
- Relación **1:M** con CUENTAS y CONTACTOS para DIRECCIONES y TELEFONOS
- Relación **M:1** de CUENTAS con tiposCuenta y sectoresCuenta
- Uso de notación **camelCase** en todos los campos

---

## 🏗️ Diagrama ER Actualizado - Módulo CUENTAS Completo

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│       USUARIOS, CUENTAS, CONTACTOS, DIRECCIONES, TELÉFONOS, TIPOS Y SECTORES        │
└──────────────────────────────────────────────────────────────────────────────────────┘


                            ┌──────────────────────────┐
                            │       usuarios           │
                            ├──────────────────────────┤
                            │ PK  idUsuario           │
                            │     nombre               │
                            │     email                │
                            │     activo               │
                            └──────┬──────────┬────────┘
                                   │          │
                                   │ 1        │ M:N
                                   │          │
                         (creador) │   ┌──────▼────────────────────┐
                         (modif.)  │   │   usuariosCuentas         │
                                   │   ├───────────────────────────┤
                                   │   │ PK  id                    │
                                   │   │ FK  idUsuario             │
                                   │   │ FK  idCuenta              │
                                   │   │     esPropietario         │
                                   │   │     esJefe                │
                                   │   │     fechaAsignacion       │
                                   │   └───────────┬───────────────┘
                                   │               │
                                   │ M             │ M
                                   │ 1             │ 1
                                   │               │
              ┌─────────────────┐  │  ┌─────────────────┐
              │  tiposCuenta    │  │  │ sectoresCuenta  │
              ├─────────────────┤  │  ├─────────────────┤
              │ PK idTipoCuenta │  │  │ PK idSector     │
              │    nombre       │  │  │    nombre       │
              │    descripcion  │  │  │    descripcion  │
              │    activo       │  │  │    activo       │
              └────────┬────────┘  │  └────────┬────────┘
                       │ 1         │           │ 1
                       │           │           │
                       │ M         │ M         │ M
                       │           │           │
                  ┌────▼───────────▼───────────▼────┐
                  │           cuentas               │
                  ├─────────────────────────────────┤
                  │ PK  idCuenta                    │
                  │     nombreCuenta                │
                  │     razonSocialCuenta           │
                  │     rfcCuenta                   │
                  │     webCuenta                   │
                  │     descripcionCuenta           │
                  │ FK  idTipoCuenta                │
                  │ FK  idSectorCuenta              │
                  │ FK  idUsuarioCreador            │
                  │ FK  idUsuarioModificador        │
                  │ FK  idEstadoRegistro            │
                  │     fechaCreacion               │
                  │     fechaActualizacion          │
                  └──────┬──────────────────────────┘
                         │
                         │ 1
                         │
                         │ M
                         │
           ┌─────────────▼──────────────┐
           │       contactos            │
           ├────────────────────────────┤
           │ PK  idContacto             │
           │ FK  idCuenta               │
           │     nombresContacto        │
           │     apellidosContacto      │
           │     emailContacto          │
           │     cargoContacto          │
           │     departamentoContacto   │
           │     rolCompra              │
           │ FK  idJefeContacto         │◄──┐ (auto-referencia)
           │ FK  idContactoInfluye      │◄──┤
           │ FK  idUsuarioCreador       │   │
           │ FK  idUsuarioModificador   │   │
           │ FK  idEstadoRegistro       │   │
           │     fechaCreacion          │   │
           └────────────────────────────┘   │
                                            └──┘


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


                         ┌──────────────────────┐
                         │  estadosRegistro     │
                         ├──────────────────────┤
                         │ PK idEstadoRegistro  │
                         │    nombre            │
                         │    descripcion       │
                         └──────────────────────┘
                         Estados: 1=Activo
                                  2=Inactivo
                                  3=Pendiente
```

---

## 📋 Tablas Catálogo

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

### Tabla tiposCuenta

```sql
CREATE TABLE tiposCuenta (
    idTipoCuenta INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_activo (activo)
);

-- Datos iniciales
INSERT INTO tiposCuenta (nombre, descripcion) VALUES
('Potencial', 'Cliente potencial o prospecto'),
('Principal', 'Cliente principal activo'),
('Fabricante', 'Cuenta de fabricante o proveedor'),
('Distribuidor', 'Distribuidor autorizado'),
('Socio', 'Socio de negocio o alianza'),
('Competidor', 'Competencia en el mercado'),
('Inactivo', 'Cliente inactivo o suspendido');
```

### Tabla sectoresCuenta

```sql
CREATE TABLE sectoresCuenta (
    idSector INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_activo (activo)
);

-- Datos iniciales
INSERT INTO sectoresCuenta (nombre, descripcion) VALUES
('Tecnología', 'Empresas de tecnología y software'),
('Telecomunicaciones', 'Telefonía y comunicaciones'),
('Financiero', 'Bancos, seguros y servicios financieros'),
('Gobierno', 'Instituciones gubernamentales'),
('Educación', 'Instituciones educativas'),
('Salud', 'Hospitales y servicios médicos'),
('Retail', 'Comercio minorista'),
('Manufactura', 'Industria manufacturera'),
('Energía', 'Sector energético y utilities'),
('Transporte', 'Logística y transporte'),
('Construcción', 'Construcción e inmobiliario'),
('Medios', 'Medios de comunicación y entretenimiento'),
('Otro', 'Otros sectores no clasificados');
```

---

## 📋 Nueva Tabla: direcciones (Compartida)

### Script SQL

```sql
-- Tabla compartida por cuentas, contactos y usuarios
CREATE TABLE direcciones (
    idDireccion INT PRIMARY KEY AUTO_INCREMENT,
    idCuenta INT NULL COMMENT 'FK a cuentas (NULL si pertenece a contacto o usuario)',
    idContacto INT NULL COMMENT 'FK a contactos (NULL si pertenece a cuenta o usuario)',
    idUsuario INT NULL COMMENT 'FK a usuarios (NULL si pertenece a cuenta o contacto)',
    tipo VARCHAR(50) COMMENT 'fiscal, entrega, oficina, casa, etc.',
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL DEFAULT 'México',
    codigoPostal VARCHAR(10),
    esPrincipal BOOLEAN DEFAULT FALSE COMMENT 'Dirección principal',
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Una dirección debe pertenecer a cuenta, contacto O usuario (solo uno)
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
    INDEX idx_tipo (tipo),
    INDEX idx_ciudad (ciudad),
    INDEX idx_estado (estado)
);
```

---

## 📞 Nueva Tabla: telefonos (Compartida)

### Script SQL

```sql
-- Tabla compartida por cuentas, contactos y usuarios
CREATE TABLE telefonos (
    idTelefono INT PRIMARY KEY AUTO_INCREMENT,
    idCuenta INT NULL COMMENT 'FK a cuentas (NULL si pertenece a contacto o usuario)',
    idContacto INT NULL COMMENT 'FK a contactos (NULL si pertenece a cuenta o usuario)',
    idUsuario INT NULL COMMENT 'FK a usuarios (NULL si pertenece a cuenta o contacto)',
    tipo VARCHAR(50) COMMENT 'oficina, movil, casa, fax, directo, etc.',
    numero VARCHAR(20) NOT NULL,
    extension VARCHAR(10) COMMENT 'Extensión telefónica',
    esPrincipal BOOLEAN DEFAULT FALSE COMMENT 'Teléfono principal',
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Un teléfono debe pertenecer a cuenta, contacto O usuario (solo uno)
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
    INDEX idx_tipo (tipo),
    INDEX idx_numero (numero)
);
```

---

## 🔄 Modificaciones a Tablas Existentes

### Tabla cuentas (Actualizada con camelCase)

```sql
-- Eliminar campos redundantes
ALTER TABLE cuentas
    DROP COLUMN direccion,
    DROP COLUMN ciudad,
    DROP COLUMN estado,
    DROP COLUMN pais,
    DROP COLUMN codigoPostal,
    DROP COLUMN telefono;

-- La tabla queda así:
CREATE TABLE cuentas (
    idCuenta INT PRIMARY KEY AUTO_INCREMENT,
    nombreCuenta VARCHAR(200) NOT NULL,
    razonSocialCuenta VARCHAR(200),
    rfcCuenta VARCHAR(20),
    webCuenta VARCHAR(255),
    descripcionCuenta TEXT,
    idTipoCuenta INT NOT NULL DEFAULT 1,
    idSectorCuenta INT NULL,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (idTipoCuenta) REFERENCES tiposCuenta(idTipoCuenta),
    FOREIGN KEY (idSectorCuenta) REFERENCES sectoresCuenta(idSector),
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario) ON DELETE SET NULL,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),

    INDEX idx_usuario_creador (idUsuarioCreador),
    INDEX idx_tipo_cuenta (idTipoCuenta),
    INDEX idx_sector (idSectorCuenta),
    INDEX idx_estado (idEstadoRegistro),
    INDEX idx_nombre (nombreCuenta)
);
```

### Tabla contactos (Actualizada con camelCase)

```sql
-- Eliminar campo telefono
ALTER TABLE contactos
    DROP COLUMN telefono;

-- La tabla queda así:
CREATE TABLE contactos (
    idContacto INT PRIMARY KEY AUTO_INCREMENT,
    idCuenta INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    rolCompra VARCHAR(100),
    idJefe INT NULL,
    idContactoInfluye INT NULL,
    idContactoInfluenciado INT NULL,
    idUsuarioCreador INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idJefe) REFERENCES contactos(idContacto) ON DELETE SET NULL,
    FOREIGN KEY (idContactoInfluye) REFERENCES contactos(idContacto) ON DELETE SET NULL,
    FOREIGN KEY (idContactoInfluenciado) REFERENCES contactos(idContacto) ON DELETE SET NULL,
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),

    INDEX idx_cuenta (idCuenta),
    INDEX idx_jefe (idJefe),
    INDEX idx_email (email),
    INDEX idx_rol_compra (rolCompra)
);
```

---

## 📊 Nuevas Relaciones

### CUENTAS → tiposCuenta (M:1)

- Una cuenta debe tener un tipo
- Muchas cuentas pueden ser del mismo tipo
- Campo: `idTipoCuenta` en cuentas
- Obligatorio (NOT NULL con valor por defecto)

### CUENTAS → sectoresCuenta (M:1)

- Una cuenta puede pertenecer a un sector (opcional)
- Muchas cuentas pueden ser del mismo sector
- Campo: `idSectorCuenta` en cuentas
- Opcional (NULL permitido)

### CUENTAS → usuarios (M:1 para modificador)

- Una cuenta tiene un usuario que la creó
- Una cuenta puede tener un usuario que la modificó por última vez
- Campos: `idUsuarioCreador` y `idUsuarioModificador` en cuentas
- `idUsuarioModificador` es opcional

### usuarios ↔ cuentas (M:N para compartir)

- Una cuenta puede ser compartida con múltiples usuarios (vendedores + jefe)
- Un usuario puede tener acceso a múltiples cuentas
- Tabla intermedia: `usuariosCuentas`
- Atributos adicionales:
  - `esPropietario`: Indica si es el dueño principal
  - `esJefe`: Indica si es el jefe del equipo
  - `fechaAsignacion`: Cuándo se compartió

---

## 📊 Relaciones (Resumen completo)

### direcciones

#### 1. **cuentas → direcciones** - **1:M**

- Una cuenta puede tener múltiples direcciones (fiscal, entrega, oficinas, etc.)
- Campo: `idCuenta` en direcciones
- Una dirección puede ser marcada como principal (`esPrincipal = TRUE`)

#### 2. **contactos → direcciones** - **1:M**

- Un contacto puede tener múltiples direcciones (casa, oficina, etc.)
- Campo: `idContacto` en direcciones
- Una dirección puede ser marcada como principal (`esPrincipal = TRUE`)

### telefonos

#### 3. **cuentas → telefonos** - **1:M**

- Una cuenta puede tener múltiples teléfonos (oficina, fax, directo, etc.)
- Campo: `idCuenta` en telefonos
- Un teléfono puede ser marcado como principal (`esPrincipal = TRUE`)

#### 4. **contactos → telefonos** - **1:M**

- Un contacto puede tener múltiples teléfonos (móvil, oficina, casa, etc.)
- Campo: `idContacto` en telefonos
- Un teléfono puede ser marcado como principal (`esPrincipal = TRUE`)

### Restricciones de Integridad

- Una dirección debe pertenecer **SOLO** a una cuenta **O** a un contacto
- Un teléfono debe pertenecer **SOLO** a una cuenta **O** a un contacto
- Implementado con `CHECK CONSTRAINT` en ambas tablas

---

## 🎯 Tipos de Direcciones Sugeridos

### Para Cuentas:

- `fiscal` - Dirección fiscal/legal
- `entrega` - Dirección de entrega
- `facturacion` - Dirección de facturación
- `oficina_principal` - Oficina principal
- `oficina_secundaria` - Oficinas adicionales
- `almacen` - Almacenes o bodegas

### Para Contactos:

- `casa` - Domicilio particular
- `oficina` - Oficina del contacto
- `temporal` - Dirección temporal

---

## 📞 Tipos de Teléfonos Sugeridos

### Para Cuentas:

- `oficina` - Teléfono de oficina principal
- `fax` - Número de fax
- `atencion_cliente` - Servicio al cliente
- `ventas` - Departamento de ventas
- `soporte` - Soporte técnico
- `conmutador` - Conmutador general

### Para Contactos:

- `movil` - Teléfono móvil/celular
- `oficina` - Teléfono de oficina
- `casa` - Teléfono de casa
- `directo` - Línea directa
- `asistente` - Teléfono de asistente

---

## 🔍 Consultas SQL Útiles

### CUENTAS con clasificación

#### Ver cuentas con su tipo y sector

```sql
SELECT
    c.idCuenta,
    c.nombre,
    c.razonSocial,
    c.rfc,
    c.web,
    tc.nombre as tipoCuenta,
    s.nombre as sector,
    c.fechaCreacion
FROM cuentas c
JOIN tiposCuenta tc ON c.idTipoCuenta = tc.idTipoCuenta
LEFT JOIN sectoresCuenta s ON c.idSector = s.idSector
WHERE c.idEstadoRegistro = 1; -- Activo
```

#### Filtrar cuentas por tipo

```sql
SELECT c.*
FROM cuentas c
JOIN tiposCuenta tc ON c.idTipoCuenta = tc.idTipoCuenta
WHERE tc.nombre = 'Principal'
  AND c.idEstadoRegistro = 1; -- Activo
```

#### Ver cuentas por sector

```sql
SELECT
    s.nombre as sector,
    COUNT(c.idCuenta) as totalCuentas
FROM sectoresCuenta s
LEFT JOIN cuentas c ON s.idSector = c.idSectorCuenta AND c.idEstadoRegistro = 1 -- Activo
GROUP BY s.idSector, s.nombre
ORDER BY totalCuentas DESC;
```

### DIRECCIONES

#### Ver todas las direcciones de una cuenta

```sql
SELECT
    d.*,
    CASE WHEN d.es_principal THEN 'Principal' ELSE 'Secundaria' END as clasificacion
FROM direcciones d
WHERE d.id_cuenta = ?
ORDER BY d.es_principal DESC, d.fecha_creacion ASC;
```

#### Ver dirección principal de una cuenta

```sql
SELECT d.*
FROM direcciones d
WHERE d.id_cuenta = ?
  AND d.es_principal = TRUE
  AND d.activo = TRUE
LIMIT 1;
```

#### Ver cuenta con su dirección principal

```sql
SELECT
    c.idCuenta,
    c.nombreCuenta,
    c.razonSocialCuenta,
    d.direccion,
    d.ciudad,
    d.estado,
    d.pais,
    d.codigoPostal
FROM cuentas c
LEFT JOIN direcciones d ON c.idCuenta = d.idCuenta AND d.esPrincipal = TRUE
WHERE c.idCuenta = ?;
```

### TELEFONOS

#### Ver todos los teléfonos de una cuenta

```sql
SELECT
    t.*,
    CASE WHEN t.es_principal THEN 'Principal' ELSE 'Secundario' END as clasificacion
FROM telefonos t
WHERE t.id_cuenta = ?
ORDER BY t.es_principal DESC, t.tipo, t.fecha_creacion ASC;
```

#### Ver teléfono principal de una cuenta

```sql
SELECT t.*
FROM telefonos t
WHERE t.id_cuenta = ?
  AND t.es_principal = TRUE
  AND t.activo = TRUE
LIMIT 1;
```

#### Ver cuenta con teléfono y dirección principal

```sql
SELECT
    c.id_cuenta,
    c.nombre,
    c.razon_social,
    t.numero as telefono_principal,
    t.extension,
    d.direccion,
    d.ciudad,
    d.estado
FROM cuentas c
LEFT JOIN telefonos t ON c.id_cuenta = t.id_cuenta AND t.es_principal = TRUE
LEFT JOIN direcciones d ON c.id_cuenta = d.id_cuenta AND d.es_principal = TRUE
WHERE c.id_cuenta = ?;
```

### CONTACTOS CON DIRECCIONES Y TELÉFONOS

#### Ver contactos con toda su información

```sql
SELECT
    c.id_contacto,
    c.nombre,
    c.apellido,
    c.email,
    c.cargo,
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
LEFT JOIN telefonos t ON c.id_contacto = t.id_contacto AND t.activo = TRUE
LEFT JOIN direcciones d ON c.id_contacto = d.id_contacto AND d.activo = TRUE
WHERE c.id_cuenta = ?
GROUP BY c.id_contacto;
```

#### Ver contacto con información principal

```sql
SELECT
    c.*,
    t.numero as telefono_principal,
    t.tipo as tipo_telefono,
    d.direccion as direccion_principal,
    d.ciudad,
    d.estado
FROM contactos c
LEFT JOIN telefonos t ON c.id_contacto = t.id_contacto
    AND t.es_principal = TRUE
    AND t.activo = TRUE
LEFT JOIN direcciones d ON c.id_contacto = d.id_contacto
    AND d.es_principal = TRUE
    AND d.activo = TRUE
WHERE c.id_contacto = ?;
```

---

## 📌 Reglas de Negocio

### ✅ Direcciones

1. Una cuenta/contacto puede tener **múltiples direcciones**
2. Debe haber **al menos una dirección principal** activa
3. Solo puede haber **una dirección principal activa** por cuenta/contacto
4. Al marcar una dirección como principal, las demás se desmarcan automáticamente

### ✅ Teléfonos

1. Una cuenta/contacto puede tener **múltiples teléfonos**
2. Debe haber **al menos un teléfono principal** activo
3. Solo puede haber **un teléfono principal activo** por cuenta/contacto
4. Al marcar un teléfono como principal, los demás se desmarcan automáticamente

### ✅ Validaciones

1. Campos obligatorios:
   - Direcciones: `direccion`, `ciudad`, `estado`, `pais`
   - Teléfonos: `numero`
2. El `tipo` debe estar en un catálogo predefinido
3. Una dirección/teléfono debe tener `id_cuenta` O `id_contacto`, nunca ambos

### ✅ Gestión de Estados

1. Las cuentas se marcan con `idEstadoRegistro = 2` (Inactivo) en lugar de eliminarse físicamente
2. Las cuentas inactivas se mantienen para **historial** de oportunidades y cotizaciones
3. Solo se muestran cuentas activas (`idEstadoRegistro = 1`) en las consultas normales
4. Usar `WHERE idEstadoRegistro = 1` en todas las consultas de usuario
5. Estados disponibles:
   - **Activo** (1): Cuenta disponible y operativa
   - **Inactivo** (2): Cuenta desactivada o eliminada lógicamente
   - **Pendiente** (3): Cuenta pendiente de validación o activación

### ✅ Eliminación Física

1. Al eliminar físicamente una cuenta, se eliminan todas sus direcciones y teléfonos (CASCADE)
2. Al eliminar un contacto, se eliminan todas sus direcciones y teléfonos (CASCADE)

---

## 🔧 Triggers para Elementos Principales

### Direcciones

```sql
-- Asegurar que solo haya una dirección principal por cuenta
DELIMITER $$
CREATE TRIGGER trg_direccion_principal_cuenta BEFORE UPDATE ON direcciones
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_cuenta IS NOT NULL THEN
        UPDATE direcciones
        SET es_principal = FALSE
        WHERE id_cuenta = NEW.id_cuenta
          AND id_direccion != NEW.id_direccion
          AND es_principal = TRUE;
    END IF;
END$$

-- Asegurar que solo haya una dirección principal por contacto
CREATE TRIGGER trg_direccion_principal_contacto BEFORE UPDATE ON direcciones
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_contacto IS NOT NULL THEN
        UPDATE direcciones
        SET es_principal = FALSE
        WHERE id_contacto = NEW.id_contacto
          AND id_direccion != NEW.id_direccion
          AND es_principal = TRUE;
    END IF;
END$$
DELIMITER ;
```

### Teléfonos

```sql
-- Asegurar que solo haya un teléfono principal por cuenta
DELIMITER $$
CREATE TRIGGER trg_telefono_principal_cuenta BEFORE UPDATE ON telefonos
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_cuenta IS NOT NULL THEN
        UPDATE telefonos
        SET es_principal = FALSE
        WHERE id_cuenta = NEW.id_cuenta
          AND id_telefono != NEW.id_telefono
          AND es_principal = TRUE;
    END IF;
END$$

-- Asegurar que solo haya un teléfono principal por contacto
CREATE TRIGGER trg_telefono_principal_contacto BEFORE UPDATE ON telefonos
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_contacto IS NOT NULL THEN
        UPDATE telefonos
        SET es_principal = FALSE
        WHERE id_contacto = NEW.id_contacto
          AND id_telefono != NEW.id_telefono
          AND es_principal = TRUE;
    END IF;
END$$
DELIMITER ;
```

---

## 📦 Vistas Útiles

### Vista: Cuentas Completas

```sql
CREATE VIEW vista_cuentas_completas AS
SELECT
    c.id_cuenta,
    c.nombre,
    c.razon_social,
    c.rfc,
    c.sitio_web,
    c.industria,
    tp.numero as telefono_principal,
    tp.extension,
    dp.direccion as direccion_principal,
    dp.ciudad,
    dp.estado,
    dp.pais,
    dp.codigo_postal,
    u.nombre as creador,
    c.fecha_creacion
FROM cuentas c
LEFT JOIN telefonos tp ON c.id_cuenta = tp.id_cuenta
    AND tp.es_principal = TRUE
    AND tp.activo = TRUE
LEFT JOIN direcciones dp ON c.id_cuenta = dp.id_cuenta
    AND dp.es_principal = TRUE
    AND dp.activo = TRUE
LEFT JOIN usuarios u ON c.id_usuario_creador = u.id_usuario
WHERE c.idEstadoRegistro = 1; -- Activo
```

### Vista: Contactos Completos

```sql
CREATE VIEW vista_contactos_completos AS
SELECT
    c.id_contacto,
    c.id_cuenta,
    ct.nombre as nombre_cuenta,
    c.nombre,
    c.apellido,
    CONCAT(c.nombre, ' ', c.apellido) as nombre_completo,
    c.email,
    c.cargo,
    c.departamento,
    c.rol_compra,
    tp.numero as telefono_principal,
    tp.tipo as tipo_telefono,
    dp.direccion as direccion_principal,
    dp.ciudad,
    dp.estado,
    jefe.nombre as nombre_jefe,
    u.nombre as creador
FROM contactos c
JOIN cuentas ct ON c.id_cuenta = ct.id_cuenta
LEFT JOIN telefonos tp ON c.id_contacto = tp.id_contacto
    AND tp.es_principal = TRUE
    AND tp.activo = TRUE
LEFT JOIN direcciones dp ON c.id_contacto = dp.id_contacto
    AND dp.es_principal = TRUE
    AND dp.activo = TRUE
LEFT JOIN contactos jefe ON c.id_jefe = jefe.id_contacto
LEFT JOIN usuarios u ON c.id_usuario_creador = u.id_usuario
WHERE c.activo = TRUE;
```

---

## 🔄 Script de Migración Completo

```sql
-- ============================================
-- SCRIPT DE MIGRACIÓN: DIRECCIONES Y TELÉFONOS
-- ============================================

-- Paso 1: Crear tabla direcciones
CREATE TABLE direcciones (
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    id_cuenta INT NULL,
    id_contacto INT NULL,
    tipo VARCHAR(50),
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL DEFAULT 'México',
    codigo_postal VARCHAR(10),
    es_principal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_direccion_pertenencia CHECK (
        (id_cuenta IS NOT NULL AND id_contacto IS NULL) OR
        (id_cuenta IS NULL AND id_contacto IS NOT NULL)
    ),
    FOREIGN KEY (id_cuenta) REFERENCES cuentas(id_cuenta) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto) REFERENCES contactos(id_contacto) ON DELETE CASCADE,
    INDEX idx_cuenta (id_cuenta),
    INDEX idx_contacto (id_contacto),
    INDEX idx_tipo (tipo),
    INDEX idx_ciudad (ciudad),
    INDEX idx_estado (estado)
);

-- Paso 2: Crear tabla telefonos
CREATE TABLE telefonos (
    id_telefono INT PRIMARY KEY AUTO_INCREMENT,
    id_cuenta INT NULL,
    id_contacto INT NULL,
    tipo VARCHAR(50),
    numero VARCHAR(20) NOT NULL,
    extension VARCHAR(10),
    es_principal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_telefono_pertenencia CHECK (
        (id_cuenta IS NOT NULL AND id_contacto IS NULL) OR
        (id_cuenta IS NULL AND id_contacto IS NOT NULL)
    ),
    FOREIGN KEY (id_cuenta) REFERENCES cuentas(id_cuenta) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto) REFERENCES contactos(id_contacto) ON DELETE CASCADE,
    INDEX idx_cuenta (id_cuenta),
    INDEX idx_contacto (id_contacto),
    INDEX idx_tipo (tipo),
    INDEX idx_numero (numero)
);

-- Paso 3: Migrar direcciones de cuentas
INSERT INTO direcciones (id_cuenta, tipo, direccion, ciudad, estado, pais, codigo_postal, es_principal)
SELECT
    id_cuenta,
    'fiscal' as tipo,
    direccion,
    ciudad,
    estado,
    pais,
    codigo_postal,
    TRUE as es_principal
FROM cuentas
WHERE direccion IS NOT NULL AND direccion != '';

-- Paso 4: Migrar teléfonos de cuentas
INSERT INTO telefonos (id_cuenta, tipo, numero, es_principal)
SELECT
    id_cuenta,
    'oficina' as tipo,
    telefono,
    TRUE as es_principal
FROM cuentas
WHERE telefono IS NOT NULL AND telefono != '';

-- Paso 5: Migrar teléfonos de contactos
INSERT INTO telefonos (id_contacto, tipo, numero, es_principal)
SELECT
    id_contacto,
    'movil' as tipo,
    telefono,
    TRUE as es_principal
FROM contactos
WHERE telefono IS NOT NULL AND telefono != '';

-- Paso 6: Eliminar columnas redundantes de cuentas
ALTER TABLE cuentas
    DROP COLUMN direccion,
    DROP COLUMN ciudad,
    DROP COLUMN estado,
    DROP COLUMN pais,
    DROP COLUMN codigo_postal,
    DROP COLUMN telefono;

-- Paso 7: Eliminar columna redundante de contactos
ALTER TABLE contactos
    DROP COLUMN telefono;

-- Paso 8: Crear triggers
DELIMITER $$

-- Triggers para direcciones
CREATE TRIGGER trg_direccion_principal_cuenta BEFORE UPDATE ON direcciones
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_cuenta IS NOT NULL THEN
        UPDATE direcciones
        SET es_principal = FALSE
        WHERE id_cuenta = NEW.id_cuenta
          AND id_direccion != NEW.id_direccion
          AND es_principal = TRUE;
    END IF;
END$$

CREATE TRIGGER trg_direccion_principal_contacto BEFORE UPDATE ON direcciones
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_contacto IS NOT NULL THEN
        UPDATE direcciones
        SET es_principal = FALSE
        WHERE id_contacto = NEW.id_contacto
          AND id_direccion != NEW.id_direccion
          AND es_principal = TRUE;
    END IF;
END$$

-- Triggers para teléfonos
CREATE TRIGGER trg_telefono_principal_cuenta BEFORE UPDATE ON telefonos
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_cuenta IS NOT NULL THEN
        UPDATE telefonos
        SET es_principal = FALSE
        WHERE id_cuenta = NEW.id_cuenta
          AND id_telefono != NEW.id_telefono
          AND es_principal = TRUE;
    END IF;
END$$

CREATE TRIGGER trg_telefono_principal_contacto BEFORE UPDATE ON telefonos
FOR EACH ROW
BEGIN
    IF NEW.es_principal = TRUE AND NEW.id_contacto IS NOT NULL THEN
        UPDATE telefonos
        SET es_principal = FALSE
        WHERE id_contacto = NEW.id_contacto
          AND id_telefono != NEW.id_telefono
          AND es_principal = TRUE;
    END IF;
END$$

DELIMITER ;

-- Paso 9: Crear vistas
CREATE VIEW vista_cuentas_completas AS
SELECT
    c.id_cuenta,
    c.nombre,
    c.razon_social,
    c.rfc,
    c.sitio_web,
    c.industria,
    tp.numero as telefono_principal,
    tp.extension,
    dp.direccion as direccion_principal,
    dp.ciudad,
    dp.estado,
    dp.pais,
    dp.codigo_postal,
    u.nombre as creador,
    c.fecha_creacion
FROM cuentas c
LEFT JOIN telefonos tp ON c.id_cuenta = tp.id_cuenta
    AND tp.es_principal = TRUE
    AND tp.activo = TRUE
LEFT JOIN direcciones dp ON c.id_cuenta = dp.id_cuenta
    AND dp.es_principal = TRUE
    AND dp.activo = TRUE
LEFT JOIN usuarios u ON c.id_usuario_creador = u.id_usuario
WHERE c.activo = TRUE;

CREATE VIEW vista_contactos_completos AS
SELECT
    c.id_contacto,
    c.id_cuenta,
    ct.nombre as nombre_cuenta,
    c.nombre,
    c.apellido,
    CONCAT(c.nombre, ' ', c.apellido) as nombre_completo,
    c.email,
    c.cargo,
    c.departamento,
    c.rol_compra,
    tp.numero as telefono_principal,
    tp.tipo as tipo_telefono,
    dp.direccion as direccion_principal,
    dp.ciudad,
    dp.estado
FROM contactos c
JOIN cuentas ct ON c.id_cuenta = ct.id_cuenta
LEFT JOIN telefonos tp ON c.id_contacto = tp.id_contacto
    AND tp.es_principal = TRUE
    AND tp.activo = TRUE
LEFT JOIN direcciones dp ON c.id_contacto = dp.id_contacto
    AND dp.es_principal = TRUE
    AND dp.activo = TRUE
WHERE c.activo = TRUE;

-- ============================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- ============================================
```

---

## ✨ Beneficios de estas Mejoras

### 1. **Normalización**

- Elimina redundancia de datos
- Facilita mantenimiento y actualizaciones
- Reduce inconsistencias

### 2. **Flexibilidad**

- Permite múltiples direcciones por cuenta/contacto
- Permite múltiples teléfonos por cuenta/contacto
- Facilita agregar nuevos tipos

### 3. **Escalabilidad**

- Preparado para nuevos requerimientos
- Fácil agregar atributos (coordenadas GPS, referencias, horarios, etc.)
- Soporta crecimiento del negocio

### 4. **Reportes y Análisis**

- Facilita análisis por ubicación geográfica
- Permite segmentación por ciudad, estado o país
- Mejora reporting de cobertura
- Análisis de canales de comunicación

### 5. **Integridad de Datos**

- Constraints aseguran consistencia
- Triggers mantienen reglas de negocio
- Relaciones claras entre entidades
- Validaciones automáticas

### 6. **Usabilidad**

- Vistas simplifican consultas complejas
- Información completa en una sola consulta
- Mejor experiencia para reportes

---

## 📊 Resumen de Cambios

| Tabla Original | Campo Eliminado                                | Nueva Tabla | Beneficio                        |
| -------------- | ---------------------------------------------- | ----------- | -------------------------------- |
| CUENTAS        | direccion, ciudad, estado, pais, codigo_postal | DIRECCIONES | Múltiples direcciones por cuenta |
| CUENTAS        | telefono                                       | TELEFONOS   | Múltiples teléfonos por cuenta   |
| CONTACTOS      | telefono                                       | TELEFONOS   | Múltiples teléfonos por contacto |
| -              | -                                              | DIRECCIONES | Direcciones para contactos       |

---

**Fecha de creación:** 6 de enero de 2026
**Tipo de cambio:** Normalización y clasificación completa de estructura
**Versión:** 2.0 con camelCase y entidades de clasificación

---

## 📊 Resumen Final de Cambios

### Nuevas Entidades Creadas:

1. **tiposCuenta** - Clasifica cuentas (Potencial, Principal, Fabricante, etc.)
2. **sectoresCuenta** - Define sectores industriales
3. **direcciones** - Múltiples direcciones para cuentas y contactos
4. **telefonos** - Múltiples teléfonos para cuentas y contactos

### Campos Agregados a cuentas:

| Campo Nuevo          | Tipo         | Descripción                                     |
| -------------------- | ------------ | ----------------------------------------------- |
| webCuenta            | VARCHAR(255) | Sitio web de la cuenta                          |
| descripcionCuenta    | TEXT         | Descripción detallada                           |
| idTipoCuenta         | INT (FK)     | Tipo de cuenta (obligatorio)                    |
| idSectorCuenta       | INT (FK)     | Sector industrial (opcional)                    |
| idUsuarioModificador | INT (FK)     | Usuario que modificó por última vez             |
| idEstadoRegistro     | INT (FK)     | Estado del registro (Activo/Inactivo/Pendiente) |

### Campos Eliminados de cuentas:

- `direccion`, `ciudad`, `estado`, `pais`, `codigoPostal` → Movidos a `direcciones`
- `telefono` → Movido a `telefonos`
- `industria` → Reemplazado por `idSectorCuenta` (FK a `sectoresCuenta`)
- `activo` (BOOLEAN) → Reemplazado por `idEstadoRegistro` (FK a `estadosRegistro`)

### Cambios de Nomenclatura:

- **Todas las tablas y campos ahora usan camelCase**
- `id_cuenta` → `idCuenta`
- `nombre` → `nombreCuenta`
- `razon_social` → `razonSocialCuenta`
- `rfc` → `rfcCuenta`
- `web` → `webCuenta`
- `descripcion` → `descripcionCuenta`
- `idSector` → `idSectorCuenta`
- `fecha_creacion` → `fechaCreacion`
- etc.

### Estructura Final de Tablas Principales:

```sql
-- CATÁLOGOS
estadosRegistro (idEstadoRegistro, nombre, descripcion)
tiposCuenta (idTipoCuenta, nombre, descripcion, activo)
sectoresCuenta (idSector, nombre, descripcion, activo)

-- PRINCIPAL
cuentas (idCuenta, nombreCuenta, razonSocialCuenta, rfcCuenta, webCuenta, descripcionCuenta,
         idTipoCuenta, idSectorCuenta, idUsuarioCreador, idUsuarioModificador,
         idEstadoRegistro, fechaCreacion, fechaActualizacion)

-- INFORMACIÓN DE CONTACTO
direcciones (idDireccion, idCuenta, idContacto, tipo, direccion, ciudad,
             estado, pais, codigoPostal, esPrincipal, activo)
telefonos (idTelefono, idCuenta, idContacto, tipo, numero, extension,
           esPrincipal, activo)

-- PERSONAS
contactos (idContacto, idCuenta, nombre, apellido, email, cargo,
           departamento, rolCompra, idJefe, activo)
```

---
