-- =====================================================
-- CRM People ETAPA 1 - Schema Completo MySQL
-- Sistema de Gestión de Relaciones con Clientes
-- 30 Entidades con Datos Iniciales
-- Versión: 1.0
-- Fecha: 7 de enero de 2026
-- =====================================================

-- Configuración inicial
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

-- =====================================================
-- Crear base de datos
-- =====================================================
CREATE DATABASE IF NOT EXISTS people_etapa1 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE people_etapa1;
-- =====================================================
-- CATÁLOGOS BÁSICOS (Sin dependencias)
-- =====================================================

-- Tabla: estadosRegistro (usada por casi todas las entidades)
DROP TABLE IF EXISTS estadosRegistro;
CREATE TABLE estadosRegistro (
    idEstadoRegistro INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: estadosRegistro
INSERT INTO estadosRegistro (idEstadoRegistro, nombre, descripcion) VALUES
(1, 'Activo', 'Registro activo y disponible'),
(2, 'Inactivo', 'Registro inactivo, no visible'),
(3, 'Pendiente', 'Registro pendiente de validación');

-- =====================================================
-- MÓDULO USUARIOS
-- =====================================================

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombresUsuario VARCHAR(100) NOT NULL,
    apellidosUsuario VARCHAR(100) NOT NULL,
    emailUsuario VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    INDEX idx_email (emailUsuario),
    INDEX idx_estado (idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: usuarios
-- Nota: Los passwords están en texto plano solo para demo. En producción usar bcrypt/hash.
INSERT INTO usuarios (nombresUsuario, apellidosUsuario, emailUsuario, password, idEstadoRegistro) VALUES
('Oscar', 'Carrillo', 'ocarrillo@empresa.com', 'password123', 1),
('Admin', 'Sistema', 'admin@empresa.com', 'admin123', 1),
('Vendedor', 'Demo', 'vendedor@empresa.com', 'vendedor123', 1);

-- =====================================================
-- CATÁLOGOS DE CUENTAS
-- =====================================================

DROP TABLE IF EXISTS tiposCuenta;
CREATE TABLE tiposCuenta (
    idTipoCuenta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tiposCuenta (nombre, descripcion, idEstadoRegistro) VALUES
('Potencial', 'Cliente potencial sin compras', 1),
('Cliente', 'Cliente activo con compras', 1),
('Fabricante', 'Proveedor o fabricante', 1),
('Distribuidor', 'Distribuidor autorizado', 1),
('Partner', 'Socio de negocio', 1);

DROP TABLE IF EXISTS sectoresCuenta;
CREATE TABLE sectoresCuenta (
    idSectorCuenta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO sectoresCuenta (nombre, descripcion, idEstadoRegistro) VALUES
('Tecnología', 'Empresas de tecnología y software', 1),
('Financiero', 'Bancos e instituciones financieras', 1),
('Gobierno', 'Sector gubernamental', 1),
('Telecomunicaciones', 'Operadores y proveedores telecom', 1),
('Retail', 'Comercio y retail', 1),
('Manufactura', 'Industria manufacturera', 1),
('Educación', 'Instituciones educativas', 1),
('Salud', 'Sector salud y hospitales', 1);

-- =====================================================
-- MÓDULO CUENTAS
-- =====================================================

DROP TABLE IF EXISTS cuentas;
CREATE TABLE cuentas (
    idCuenta INT AUTO_INCREMENT PRIMARY KEY,
    nombreCuenta VARCHAR(200) NOT NULL,
    razonSocialCuenta VARCHAR(200),
    rfcCuenta VARCHAR(20),
    webCuenta VARCHAR(255),
    descripcionCuenta TEXT,
    idTipoCuenta INT NOT NULL,
    idSectorCuenta INT NOT NULL,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idTipoCuenta) REFERENCES tiposCuenta(idTipoCuenta),
    FOREIGN KEY (idSectorCuenta) REFERENCES sectoresCuenta(idSectorCuenta),
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    INDEX idx_nombre (nombreCuenta),
    INDEX idx_rfc (rfcCuenta),
    INDEX idx_tipo (idTipoCuenta),
    INDEX idx_sector (idSectorCuenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: cuentas
INSERT INTO cuentas (nombreCuenta, razonSocialCuenta, rfcCuenta, webCuenta, descripcionCuenta, idTipoCuenta, idSectorCuenta, idUsuarioCreador, idEstadoRegistro) VALUES
('Empresa Demo SA', 'Empresa Demo SA de CV', 'XAXX010101000', 'https://demo.com', 'Cliente de demostración', 2, 1, 1, 1),
('TechCorp', 'Technology Corporation SA', 'TCO120520X01', 'https://techcorp.com', 'Empresa tecnológica', 1, 1, 1, 1);

-- =====================================================
-- MÓDULO CONTACTOS
-- =====================================================

DROP TABLE IF EXISTS contactos;
CREATE TABLE contactos (
    idContacto INT AUTO_INCREMENT PRIMARY KEY,
    idCuenta INT NOT NULL,
    nombresContacto VARCHAR(100) NOT NULL,
    apellidosContacto VARCHAR(100) NOT NULL,
    emailContacto VARCHAR(150) NOT NULL,
    cargoContacto VARCHAR(100),
    departamentoContacto VARCHAR(100),
    rolCompra VARCHAR(100),
    idJefeContacto INT,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idJefeContacto) REFERENCES contactos(idContacto),
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    INDEX idx_cuenta (idCuenta),
    INDEX idx_email (emailContacto),
    INDEX idx_jefe (idJefeContacto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: contactos
INSERT INTO contactos (idCuenta, nombresContacto, apellidosContacto, emailContacto, cargoContacto, departamentoContacto, rolCompra, idUsuarioCreador, idEstadoRegistro) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@demo.com', 'Director TI', 'Tecnología', 'Decisor', 1, 1),
(1, 'María', 'García', 'maria.garcia@demo.com', 'Gerente Compras', 'Compras', 'Influenciador', 1, 1),
(2, 'Carlos', 'López', 'carlos.lopez@techcorp.com', 'CTO', 'Tecnología', 'Decisor', 1, 1);

-- =====================================================
-- RELACIÓN M:M USUARIOS-CUENTAS
-- =====================================================

DROP TABLE IF EXISTS usuariosCuentas;
CREATE TABLE usuariosCuentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idCuenta INT NOT NULL,
    esPropietario BOOLEAN DEFAULT FALSE,
    esJefe BOOLEAN DEFAULT FALSE,
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    UNIQUE KEY uk_usuario_cuenta (idUsuario, idCuenta),
    INDEX idx_usuario (idUsuario),
    INDEX idx_cuenta (idCuenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: usuariosCuentas
INSERT INTO usuariosCuentas (idUsuario, idCuenta, esPropietario, esJefe) VALUES
(1, 1, TRUE, TRUE),
(3, 1, FALSE, FALSE),
(1, 2, TRUE, TRUE);

-- =====================================================
-- CATÁLOGOS DE OPORTUNIDADES
-- =====================================================

DROP TABLE IF EXISTS lineasNegocio;
CREATE TABLE lineasNegocio (
    idLineaNegocio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    nombreCorto VARCHAR(50),
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO lineasNegocio (nombre, nombreCorto, descripcion, idEstadoRegistro) VALUES
('F5 DCS', 'F5 DCS', 'F5 Distributed Cloud Services', 1),
('F5 Nginx', 'F5 Nginx', 'F5 Nginx Plus y Controller', 1),
('F5 Tradicional', 'F5 Trad', 'F5 BIG-IP tradicional', 1),
('F5 Renovaciones', 'F5 Renov', 'Renovaciones de licencias F5', 1),
('Bluecat DDI', 'Bluecat DDI', 'Bluecat DDI Solutions', 1),
('Bluecat Edge', 'Bluecat Edge', 'Bluecat Edge Services', 1),
('Servicios', 'Servicios', 'Servicios profesionales y consultoría', 1);

DROP TABLE IF EXISTS etapasVenta;
CREATE TABLE etapasVenta (
    idEtapaVenta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    orden INT NOT NULL UNIQUE,
    probabilidad INT NOT NULL DEFAULT 0,
    esEtapaFinal BOOLEAN DEFAULT FALSE,
    colorHex VARCHAR(7),
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO etapasVenta (nombre, descripcion, orden, probabilidad, esEtapaFinal, colorHex, idEstadoRegistro) VALUES
('Contacto Inicial', 'Primera interacción con el prospecto', 1, 10, FALSE, '#E3F2FD', 1),
('Identificación de Oportunidad', 'Calificación inicial de la oportunidad', 2, 20, FALSE, '#BBDEFB', 1),
('Desarrollo', 'Análisis detallado de necesidades', 3, 40, FALSE, '#90CAF9', 1),
('Cotización', 'Presentación de propuesta económica', 4, 60, FALSE, '#64B5F6', 1),
('Demostración', 'Prueba de concepto o demo técnico', 5, 70, FALSE, '#42A5F5', 1),
('Negociación', 'Ajustes finales y términos', 6, 80, FALSE, '#2196F3', 1),
('Waiting', 'Esperando aprobaciones internas del cliente', 7, 85, FALSE, '#1E88E5', 1),
('Ganado', 'Oportunidad ganada exitosamente', 8, 100, TRUE, '#4CAF50', 1),
('Perdido', 'Oportunidad perdida', 9, 0, TRUE, '#F44336', 1),
('Abandonado', 'Oportunidad descartada', 10, 0, TRUE, '#9E9E9E', 1);

-- =====================================================
-- MÓDULO OPORTUNIDADES
-- =====================================================

DROP TABLE IF EXISTS oportunidades;
CREATE TABLE oportunidades (
    idOportunidad INT AUTO_INCREMENT PRIMARY KEY,
    idCuenta INT NOT NULL,
    nombreOportunidad VARCHAR(200) NOT NULL,
    descripcionOportunidad TEXT,
    montoEstimado DECIMAL(15,2),
    fechaCierre DATE,
    idContacto INT,
    idEtapaVenta INT NOT NULL,
    idLineaNegocio INT NOT NULL,
    idPreventa INT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta),
    FOREIGN KEY (idContacto) REFERENCES contactos(idContacto),
    FOREIGN KEY (idEtapaVenta) REFERENCES etapasVenta(idEtapaVenta),
    FOREIGN KEY (idLineaNegocio) REFERENCES lineasNegocio(idLineaNegocio),
    FOREIGN KEY (idPreventa) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario),
    INDEX idx_cuenta (idCuenta),
    INDEX idx_etapa (idEtapaVenta),
    INDEX idx_linea (idLineaNegocio),
    INDEX idx_fecha_cierre (fechaCierre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: oportunidades
INSERT INTO oportunidades (idCuenta, nombreOportunidad, descripcionOportunidad, montoEstimado, fechaCierre, idContacto, idEtapaVenta, idLineaNegocio, idPreventa, idUsuarioCreador, idEstadoRegistro) VALUES
(1, 'Implementación F5 DCS', 'Proyecto de migración a F5 Distributed Cloud', 150000.00, '2026-03-31', 1, 4, 1, 1, 1, 1),
(2, 'Renovación licencias F5', 'Renovación anual de licencias BIG-IP', 80000.00, '2026-02-28', 3, 6, 4, 1, 1, 1);

-- =====================================================
-- RELACIÓN M:M USUARIOS-OPORTUNIDADES
-- =====================================================

DROP TABLE IF EXISTS usuariosOportunidades;
CREATE TABLE usuariosOportunidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idOportunidad INT NOT NULL,
    idUsuario INT NOT NULL,
    esPrincipal BOOLEAN DEFAULT FALSE,
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idOportunidad) REFERENCES oportunidades(idOportunidad) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    UNIQUE KEY uk_oportunidad_usuario (idOportunidad, idUsuario),
    INDEX idx_oportunidad (idOportunidad),
    INDEX idx_usuario (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: usuariosOportunidades
INSERT INTO usuariosOportunidades (idOportunidad, idUsuario, esPrincipal) VALUES
(1, 1, TRUE),
(1, 3, FALSE),
(2, 1, TRUE);

-- =====================================================
-- MÓDULO ETAPAS DE VENTA - PREGUNTAS Y RESPUESTAS
-- =====================================================

DROP TABLE IF EXISTS preguntasEtapa;
CREATE TABLE preguntasEtapa (
    idPregunta INT AUTO_INCREMENT PRIMARY KEY,
    idEtapaVenta INT NOT NULL,
    textoPregunta VARCHAR(500) NOT NULL,
    descripcionPregunta TEXT,
    tipoPregunta ENUM('SiNo', 'Texto', 'OpcionMultiple', 'Fecha') NOT NULL DEFAULT 'SiNo',
    esObligatoria BOOLEAN DEFAULT TRUE,
    orden INT NOT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEtapaVenta) REFERENCES etapasVenta(idEtapaVenta) ON DELETE CASCADE,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    INDEX idx_etapa (idEtapaVenta),
    INDEX idx_orden (idEtapaVenta, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: preguntasEtapa
INSERT INTO preguntasEtapa (idEtapaVenta, textoPregunta, descripcionPregunta, tipoPregunta, esObligatoria, orden, idEstadoRegistro) VALUES
(1, '¿Se realizó el contacto inicial?', 'Confirmar primera comunicación', 'SiNo', TRUE, 1, 1),
(1, '¿Se identificó el contacto clave?', 'Validar persona de contacto', 'SiNo', TRUE, 2, 1),
(2, '¿Se identificó una necesidad clara?', 'Validar que existe una necesidad real', 'SiNo', TRUE, 1, 1),
(2, '¿Existe presupuesto?', 'Confirmar disponibilidad de presupuesto', 'SiNo', TRUE, 2, 1),
(3, '¿Se completó el análisis técnico?', 'Validar análisis técnico detallado', 'SiNo', TRUE, 1, 1),
(4, '¿Se envió la propuesta formal?', 'Confirmar envío de cotización', 'SiNo', TRUE, 1, 1);

DROP TABLE IF EXISTS respuestasOportunidad;
CREATE TABLE respuestasOportunidad (
    idRespuesta INT AUTO_INCREMENT PRIMARY KEY,
    idOportunidad INT NOT NULL,
    idPregunta INT NOT NULL,
    respuestaSiNo BOOLEAN,
    respuestaTexto TEXT,
    respuestaOpcion VARCHAR(200),
    respuestaFecha DATE,
    esRespuestaAdecuada BOOLEAN DEFAULT FALSE,
    idUsuarioRespuesta INT NOT NULL,
    fechaRespuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idOportunidad) REFERENCES oportunidades(idOportunidad) ON DELETE CASCADE,
    FOREIGN KEY (idPregunta) REFERENCES preguntasEtapa(idPregunta),
    FOREIGN KEY (idUsuarioRespuesta) REFERENCES usuarios(idUsuario),
    UNIQUE KEY uk_oportunidad_pregunta (idOportunidad, idPregunta),
    INDEX idx_oportunidad (idOportunidad),
    INDEX idx_pregunta (idPregunta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS historialEtapasOportunidad;
CREATE TABLE historialEtapasOportunidad (
    idHistorial INT AUTO_INCREMENT PRIMARY KEY,
    idOportunidad INT NOT NULL,
    idEtapaAnterior INT,
    idEtapaNueva INT NOT NULL,
    idUsuario INT NOT NULL,
    fechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentarios TEXT,
    FOREIGN KEY (idOportunidad) REFERENCES oportunidades(idOportunidad) ON DELETE CASCADE,
    FOREIGN KEY (idEtapaAnterior) REFERENCES etapasVenta(idEtapaVenta),
    FOREIGN KEY (idEtapaNueva) REFERENCES etapasVenta(idEtapaVenta),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    INDEX idx_oportunidad (idOportunidad),
    INDEX idx_fecha (fechaCambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CATÁLOGOS DE PROPUESTAS
-- =====================================================

DROP TABLE IF EXISTS estadosPropuesta;
CREATE TABLE estadosPropuesta (
    idEstadoPropuesta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    orden INT NOT NULL UNIQUE,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO estadosPropuesta (nombre, descripcion, orden, idEstadoRegistro) VALUES
('Borrador', 'Propuesta en borrador, sin enviar', 1, 1),
('En aprobación', 'Propuesta en proceso de aprobación interna', 2, 1),
('Aprobada', 'Propuesta aprobada internamente', 3, 1),
('Rechazada', 'Propuesta rechazada internamente', 4, 1),
('Enviada', 'Propuesta enviada al cliente', 5, 1),
('Ganada', 'Propuesta aceptada por el cliente', 6, 1),
('Aceptada', 'Propuesta aceptada formalmente', 7, 1),
('Perdida', 'Propuesta rechazada por el cliente', 8, 1),
('No vigente', 'Propuesta fuera de vigencia', 9, 1),
('Abandonada', 'Propuesta descartada', 10, 1);

DROP TABLE IF EXISTS tiposProductos;
CREATE TABLE tiposProductos (
    idTipoProducto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tiposProductos (nombre, descripcion, idEstadoRegistro) VALUES
('Producto', 'Productos físicos o licencias de software', 1),
('Servicio', 'Servicios profesionales, consultoría, implementación', 1),
('Renovación', 'Renovaciones de licencias y soportes', 1);

DROP TABLE IF EXISTS fabricantes;
CREATE TABLE fabricantes (
    idFabricante INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO fabricantes (nombre, descripcion, idEstadoRegistro) VALUES
('F5 Productos', 'Productos F5 Networks', 1),
('F5 Servicios', 'Servicios profesionales F5', 1),
('F5 Renovaciones', 'Renovaciones de licencias F5', 1),
('Bluecat Productos', 'Productos Bluecat Networks', 1),
('Bluecat Servicios', 'Servicios profesionales Bluecat', 1),
('AccessQuality Servicios', 'Servicios de AccessQuality', 1);

DROP TABLE IF EXISTS catalogoItems;
CREATE TABLE catalogoItems (
    idCatalogoItem INT AUTO_INCREMENT PRIMARY KEY,
    idFabricante INT NOT NULL,
    codigo VARCHAR(100) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precioLista DECIMAL(15,2),
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idFabricante) REFERENCES fabricantes(idFabricante),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    UNIQUE KEY uk_fabricante_codigo (idFabricante, codigo),
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre),
    INDEX idx_fabricante (idFabricante)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO catalogoItems (idFabricante, codigo, nombre, descripcion, precioLista, idEstadoRegistro) VALUES
(1, 'F5-BIG-LTM-1600', 'F5 BIG-IP LTM 1600', 'Load balancer de aplicaciones', 25000.00, 1),
(1, 'F5-BIG-LTM-3600', 'F5 BIG-IP LTM 3600', 'Load balancer de alto rendimiento', 45000.00, 1),
(1, 'F5-DCS-WAAP', 'F5 Distributed Cloud WAAP', 'Web Application and API Protection', 15000.00, 1),
(2, 'F5-PS-IMPL', 'F5 Implementación', 'Servicio de implementación F5', 8000.00, 1),
(2, 'F5-PS-TRAINING', 'F5 Capacitación', 'Capacitación técnica F5', 3000.00, 1),
(3, 'F5-RENEW-LTM-1Y', 'F5 Renovación LTM 1 año', 'Renovación anual de soporte LTM', 5000.00, 1),
(4, 'BC-DDI-IPAM', 'Bluecat IPAM', 'IP Address Management', 18000.00, 1),
(6, 'AQ-CONSULTING', 'Consultoría AccessQuality', 'Consultoría profesional', 2000.00, 1);

DROP TABLE IF EXISTS tiposMoneda;
CREATE TABLE tiposMoneda (
    idMoneda INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    codigo VARCHAR(3) NOT NULL UNIQUE,
    simbolo VARCHAR(5) NOT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tiposMoneda (nombre, codigo, simbolo, idEstadoRegistro) VALUES
('Dólar Estadounidense', 'USD', '$', 1),
('Peso Mexicano', 'MXN', 'MX$', 1),
('Euro', 'EUR', '€', 1);

DROP TABLE IF EXISTS opcionesValidez;
CREATE TABLE opcionesValidez (
    idValidez INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    dias INT NOT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO opcionesValidez (nombre, descripcion, dias, idEstadoRegistro) VALUES
('30 días', 'Vigencia de 30 días', 30, 1),
('60 días', 'Vigencia de 60 días', 60, 1),
('90 días', 'Vigencia de 90 días', 90, 1),
('180 días', 'Vigencia de 180 días', 180, 1);

DROP TABLE IF EXISTS condicionesPago;
CREATE TABLE condicionesPago (
    idCondicionesPago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO condicionesPago (nombre, descripcion, idEstadoRegistro) VALUES
('50% anticipo, 50% contra entrega', 'Pago en dos exhibiciones', 1),
('100% anticipo', 'Pago completo por adelantado', 1),
('30 días netos', 'Pago a 30 días después de la entrega', 1),
('60 días netos', 'Pago a 60 días después de la entrega', 1);

DROP TABLE IF EXISTS tiemposEntrega;
CREATE TABLE tiemposEntrega (
    idTiempoEntrega INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    dias INT NOT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tiemposEntrega (nombre, descripcion, dias, idEstadoRegistro) VALUES
('5 días hábiles', 'Entrega en 5 días hábiles', 5, 1),
('10 días hábiles', 'Entrega en 10 días hábiles', 10, 1),
('15 días hábiles', 'Entrega en 15 días hábiles', 15, 1),
('30 días hábiles', 'Entrega en 30 días hábiles', 30, 1);

DROP TABLE IF EXISTS opcionesGarantia;
CREATE TABLE opcionesGarantia (
    idGarantia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    meses INT NOT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO opcionesGarantia (nombre, descripcion, meses, idEstadoRegistro) VALUES
('6 meses', 'Garantía de 6 meses', 6, 1),
('12 meses', 'Garantía de 12 meses', 12, 1),
('24 meses', 'Garantía de 24 meses', 24, 1),
('36 meses', 'Garantía de 36 meses', 36, 1);

DROP TABLE IF EXISTS visibilidadesSeccion;
CREATE TABLE visibilidadesSeccion (
    idVisibilidadSeccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO visibilidadesSeccion (nombre, descripcion, idEstadoRegistro) VALUES
('Incluir', 'Sección visible en la propuesta', 1),
('Ocultar', 'Sección oculta, solo uso interno', 1),
('Opcional', 'Sección opcional según configuración', 1);

-- =====================================================
-- MÓDULO PROPUESTAS
-- =====================================================

DROP TABLE IF EXISTS propuestas;
CREATE TABLE propuestas (
    idPropuesta INT AUTO_INCREMENT PRIMARY KEY,
    idOportunidad INT NOT NULL,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idOportunidad) REFERENCES oportunidades(idOportunidad),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario),
    INDEX idx_oportunidad (idOportunidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: propuestas
INSERT INTO propuestas (idOportunidad, idUsuarioCreador, idEstadoRegistro) VALUES
(1, 1, 1),
(2, 1, 1);

DROP TABLE IF EXISTS versionesPropuesta;
CREATE TABLE versionesPropuesta (
    idVersion INT AUTO_INCREMENT PRIMARY KEY,
    idPropuesta INT NOT NULL,
    nombrePropuesta VARCHAR(200) NOT NULL,
    numeroVersion INT NOT NULL DEFAULT 1,
    fechaVersion DATE NOT NULL,
    introduccion TEXT,
    idMoneda INT NOT NULL DEFAULT 1,
    idValidez INT NOT NULL DEFAULT 1,
    idCondicionesPago INT NOT NULL DEFAULT 1,
    idTiempoEntrega INT NOT NULL DEFAULT 1,
    idGarantia INT NOT NULL DEFAULT 1,
    idContacto INT,
    idPreventa INT,
    idEstadoPropuesta INT NOT NULL DEFAULT 1,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    notasComerciales TEXT,
    notasInternas TEXT,
    esActual BOOLEAN DEFAULT TRUE,
    idUsuarioCreador INT NOT NULL,
    idUsuarioModificador INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idPropuesta) REFERENCES propuestas(idPropuesta) ON DELETE CASCADE,
    FOREIGN KEY (idMoneda) REFERENCES tiposMoneda(idMoneda),
    FOREIGN KEY (idValidez) REFERENCES opcionesValidez(idValidez),
    FOREIGN KEY (idCondicionesPago) REFERENCES condicionesPago(idCondicionesPago),
    FOREIGN KEY (idTiempoEntrega) REFERENCES tiemposEntrega(idTiempoEntrega),
    FOREIGN KEY (idGarantia) REFERENCES opcionesGarantia(idGarantia),
    FOREIGN KEY (idContacto) REFERENCES contactos(idContacto),
    FOREIGN KEY (idPreventa) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idEstadoPropuesta) REFERENCES estadosPropuesta(idEstadoPropuesta),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    FOREIGN KEY (idUsuarioCreador) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idUsuarioModificador) REFERENCES usuarios(idUsuario),
    INDEX idx_propuesta (idPropuesta),
    INDEX idx_version (numeroVersion),
    INDEX idx_actual (esActual)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: versionesPropuesta
INSERT INTO versionesPropuesta (idPropuesta, nombrePropuesta, numeroVersion, fechaVersion, introduccion, idMoneda, idValidez, idCondicionesPago, idTiempoEntrega, idGarantia, idContacto, idPreventa, idEstadoPropuesta, esActual, idUsuarioCreador, idEstadoRegistro) VALUES
(1, 'Propuesta F5 DCS - Empresa Demo', 1, '2026-01-07', 'Propuesta para implementación de F5 Distributed Cloud Services', 1, 2, 1, 2, 2, 1, 1, 1, TRUE, 1, 1),
(2, 'Renovación F5 - TechCorp', 1, '2026-01-07', 'Propuesta de renovación anual de licencias F5', 1, 1, 3, 1, 2, 3, 1, 1, TRUE, 1, 1);

DROP TABLE IF EXISTS seccionesPropuesta;
CREATE TABLE seccionesPropuesta (
    idSeccion INT AUTO_INCREMENT PRIMARY KEY,
    idVersion INT NOT NULL,
    tituloSeccion VARCHAR(200) NOT NULL,
    idVisibilidadSeccion INT NOT NULL DEFAULT 1,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    orden INT NOT NULL,
    FOREIGN KEY (idVersion) REFERENCES versionesPropuesta(idVersion) ON DELETE CASCADE,
    FOREIGN KEY (idVisibilidadSeccion) REFERENCES visibilidadesSeccion(idVisibilidadSeccion),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    INDEX idx_version (idVersion),
    INDEX idx_orden (idVersion, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: seccionesPropuesta
INSERT INTO seccionesPropuesta (idVersion, tituloSeccion, idVisibilidadSeccion, orden, idEstadoRegistro) VALUES
(1, 'Productos F5 DCS', 1, 1, 1),
(1, 'Servicios de Implementación', 1, 2, 1),
(2, 'Renovaciones F5', 1, 1, 1);

DROP TABLE IF EXISTS itemsPropuesta;
CREATE TABLE itemsPropuesta (
    idItem INT AUTO_INCREMENT PRIMARY KEY,
    idSeccion INT NOT NULL,
    idFabricante INT NOT NULL,
    idTipoProducto INT NOT NULL,
    codigoItem VARCHAR(100) NOT NULL,
    descripcionItem TEXT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precioListaUnitario DECIMAL(15,2) NOT NULL,
    descuentoFabricante DECIMAL(5,2) DEFAULT 0.00,
    importacion DECIMAL(5,2) DEFAULT 0.00,
    margen DECIMAL(5,2) DEFAULT 0.00,
    descuentoFinal DECIMAL(5,2) DEFAULT 0.00,
    resaltado BOOLEAN DEFAULT FALSE,
    escondido BOOLEAN DEFAULT FALSE,
    filaTexto BOOLEAN DEFAULT FALSE,
    sinPrecio BOOLEAN DEFAULT FALSE,
    perteneceFormula BOOLEAN DEFAULT FALSE,
    idEstadoRegistro INT NOT NULL DEFAULT 1,
    orden INT NOT NULL,
    FOREIGN KEY (idSeccion) REFERENCES seccionesPropuesta(idSeccion) ON DELETE CASCADE,
    FOREIGN KEY (idFabricante) REFERENCES fabricantes(idFabricante),
    FOREIGN KEY (idTipoProducto) REFERENCES tiposProductos(idTipoProducto),
    FOREIGN KEY (idEstadoRegistro) REFERENCES estadosRegistro(idEstadoRegistro),
    INDEX idx_seccion (idSeccion),
    INDEX idx_fabricante (idFabricante),
    INDEX idx_codigo (codigoItem),
    INDEX idx_orden (idSeccion, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: itemsPropuesta
INSERT INTO itemsPropuesta (idSeccion, idFabricante, idTipoProducto, codigoItem, descripcionItem, cantidad, precioListaUnitario, descuentoFabricante, margen, orden, idEstadoRegistro) VALUES
(1, 1, 1, 'F5-DCS-WAAP', 'F5 Distributed Cloud WAAP - Web Application and API Protection', 2, 15000.00, 10.00, 25.00, 1, 1),
(2, 2, 2, 'F5-PS-IMPL', 'Servicio de implementación y configuración F5 DCS', 1, 8000.00, 5.00, 30.00, 1, 1),
(2, 2, 2, 'F5-PS-TRAINING', 'Capacitación técnica para equipo del cliente', 1, 3000.00, 5.00, 30.00, 2, 1),
(3, 3, 3, 'F5-RENEW-LTM-1Y', 'Renovación anual de soporte F5 BIG-IP LTM', 4, 5000.00, 15.00, 20.00, 1, 1);

-- =====================================================
-- RELACIÓN M:M USUARIOS-PROPUESTAS
-- =====================================================

DROP TABLE IF EXISTS usuariosPropuestas;
CREATE TABLE usuariosPropuestas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPropuesta INT NOT NULL,
    idUsuario INT NOT NULL,
    esPrincipal BOOLEAN DEFAULT FALSE,
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPropuesta) REFERENCES propuestas(idPropuesta) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    UNIQUE KEY uk_propuesta_usuario (idPropuesta, idUsuario),
    INDEX idx_propuesta (idPropuesta),
    INDEX idx_usuario (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: usuariosPropuestas
INSERT INTO usuariosPropuestas (idPropuesta, idUsuario, esPrincipal) VALUES
(1, 1, TRUE),
(1, 3, FALSE),
(2, 1, TRUE);

-- =====================================================
-- TABLAS COMPARTIDAS (POLIMÓRFICAS)
-- =====================================================

DROP TABLE IF EXISTS direcciones;
CREATE TABLE direcciones (
    idDireccion INT AUTO_INCREMENT PRIMARY KEY,
    idCuenta INT,
    idContacto INT,
    idUsuario INT,
    tipo VARCHAR(50),
    direccion VARCHAR(300),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'México',
    codigoPostal VARCHAR(20),
    esPrincipal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idContacto) REFERENCES contactos(idContacto) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    CHECK ((idCuenta IS NOT NULL AND idContacto IS NULL AND idUsuario IS NULL) OR
           (idCuenta IS NULL AND idContacto IS NOT NULL AND idUsuario IS NULL) OR
           (idCuenta IS NULL AND idContacto IS NULL AND idUsuario IS NOT NULL)),
    INDEX idx_cuenta (idCuenta),
    INDEX idx_contacto (idContacto),
    INDEX idx_usuario (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: direcciones
INSERT INTO direcciones (idCuenta, tipo, direccion, ciudad, estado, codigoPostal, esPrincipal, activo) VALUES
(1, 'Oficina Principal', 'Av. Insurgentes Sur 1234', 'Ciudad de México', 'CDMX', '03100', TRUE, TRUE),
(2, 'Oficina Principal', 'Av. Revolución 567', 'Monterrey', 'Nuevo León', '64000', TRUE, TRUE);

DROP TABLE IF EXISTS telefonos;
CREATE TABLE telefonos (
    idTelefono INT AUTO_INCREMENT PRIMARY KEY,
    idCuenta INT,
    idContacto INT,
    idUsuario INT,
    tipo VARCHAR(50),
    numero VARCHAR(30) NOT NULL,
    extension VARCHAR(10),
    esPrincipal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta) ON DELETE CASCADE,
    FOREIGN KEY (idContacto) REFERENCES contactos(idContacto) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    CHECK ((idCuenta IS NOT NULL AND idContacto IS NULL AND idUsuario IS NULL) OR
           (idCuenta IS NULL AND idContacto IS NOT NULL AND idUsuario IS NULL) OR
           (idCuenta IS NULL AND idContacto IS NULL AND idUsuario IS NOT NULL)),
    INDEX idx_cuenta (idCuenta),
    INDEX idx_contacto (idContacto),
    INDEX idx_usuario (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales: telefonos
INSERT INTO telefonos (idCuenta, tipo, numero, esPrincipal, activo) VALUES
(1, 'Oficina', '55-1234-5678', TRUE, TRUE),
(2, 'Oficina', '81-8765-4321', TRUE, TRUE);

INSERT INTO telefonos (idContacto, tipo, numero, esPrincipal, activo) VALUES
(1, 'Móvil', '55-9876-5432', TRUE, TRUE),
(2, 'Móvil', '55-5555-1234', TRUE, TRUE),
(3, 'Móvil', '81-4444-9999', TRUE, TRUE);

-- =====================================================
-- RESTAURAR CONFIGURACIÓN
-- =====================================================

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen de tablas creadas
SELECT 
    'BASE DE DATOS CREADA EXITOSAMENTE' AS STATUS,
    COUNT(*) AS TOTAL_TABLAS
FROM information_schema.tables 
WHERE table_schema = 'crm_etapa1';

-- Mostrar conteo de registros por tabla
SELECT 
    table_name AS Tabla,
    table_rows AS Registros
FROM information_schema.tables
WHERE table_schema = 'crm_etapa1'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

/*
RESUMEN DEL SCHEMA:
- 30 tablas creadas
- Nomenclatura camelCase
- Datos iniciales en catálogos y ejemplos
- Foreign Keys configuradas
- Índices optimizados
- Check constraints en tablas polimórficas
- Auditoría completa (creador, modificador, fechas)

PARA EJECUTAR:
mysql -u root -p < crm-etapa1-schema.sql

PARA VALIDAR:
USE crm_etapa1;
SHOW TABLES;
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM cuentas;
SELECT COUNT(*) FROM oportunidades;
SELECT COUNT(*) FROM propuestas;
*/
