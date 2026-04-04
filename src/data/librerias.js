// ============================================================
// VOX WEBSITE — Catalogo completo de librerias
// Incluye: 30 librerias core + 24 librerias de terceros (pub.dev)
// ============================================================

// --- LIBRERIAS CORE DE VOX (incluidas con el compilador) ---

export const LIBRERIAS_CORE = [
  {
    id: "core-mate", nombre_vox: "vox:mate", nombre_flutter: "dart:math", url_pub: null,
    descripcion_corta: "Funciones matematicas: trigonometria, aleatorios y constantes",
    descripcion_larga: "Modulo matematico completo con funciones trigonometricas, exponenciales, logaritmicas, redondeo, valores absolutos, numeros aleatorios y constantes como PI y E.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Dart SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:mate";',
    ejemplo_codigo: 'importar "vox:mate";\n\nvariable raiz = raizCuadrada(144);\nvariable angulo = seno(PI / 2);\nvariable dado = aleatorioEntero(1, 6);',
    metodos: [
      { nombre_vox: "seno(x)", nombre_flutter: "sin(x)", descripcion: "Seno de un angulo en radianes" },
      { nombre_vox: "coseno(x)", nombre_flutter: "cos(x)", descripcion: "Coseno de un angulo" },
      { nombre_vox: "raizCuadrada(x)", nombre_flutter: "sqrt(x)", descripcion: "Raiz cuadrada" },
      { nombre_vox: "potencia(b, e)", nombre_flutter: "pow(b, e)", descripcion: "Potencia base^exponente" },
      { nombre_vox: "aleatorioEntero(min, max)", nombre_flutter: "Random().nextInt()", descripcion: "Entero aleatorio en rango" },
      { nombre_vox: "aleatorioDecimal()", nombre_flutter: "Random().nextDouble()", descripcion: "Decimal aleatorio 0.0-1.0" },
      { nombre_vox: "redondear(x)", nombre_flutter: "round()", descripcion: "Redondea al entero mas cercano" },
      { nombre_vox: "absoluto(x)", nombre_flutter: "abs()", descripcion: "Valor absoluto" },
      { nombre_vox: "minimo(a, b)", nombre_flutter: "min(a, b)", descripcion: "Menor de dos valores" },
      { nombre_vox: "maximo(a, b)", nombre_flutter: "max(a, b)", descripcion: "Mayor de dos valores" },
    ]
  },
  {
    id: "core-red", nombre_vox: "vox:red", nombre_flutter: "package:http", url_pub: "pub.dev/packages/http",
    descripcion_corta: "Cliente HTTP: GET, POST, PUT, PATCH, DELETE y descargas",
    descripcion_larga: "Cliente HTTP completo con soporte para todos los verbos HTTP, headers personalizados, cuerpos JSON y descarga de archivos binarios.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:red";',
    ejemplo_codigo: 'importar "vox:red";\n\nvariable datos = esperar http_obtener("https://api.ejemplo.com/datos");\nvariable resp = esperar http_enviar("https://api.ejemplo.com/crear", {"nombre": "Vox"});',
    metodos: [
      { nombre_vox: "http_obtener(url)", nombre_flutter: "http.get(url)", descripcion: "Peticion GET" },
      { nombre_vox: "http_enviar(url, datos)", nombre_flutter: "http.post(url, body)", descripcion: "Peticion POST con JSON" },
      { nombre_vox: "http_actualizar(url, datos)", nombre_flutter: "http.put(url, body)", descripcion: "Peticion PUT" },
      { nombre_vox: "http_parche(url, datos)", nombre_flutter: "http.patch(url, body)", descripcion: "Peticion PATCH" },
      { nombre_vox: "http_eliminar(url)", nombre_flutter: "http.delete(url)", descripcion: "Peticion DELETE" },
      { nombre_vox: "http_descargar(url, ruta)", nombre_flutter: "http.readBytes(url)", descripcion: "Descarga archivo binario" },
    ]
  },
  {
    id: "core-json", nombre_vox: "vox:json", nombre_flutter: "dart:convert", url_pub: null,
    descripcion_corta: "Codificacion y decodificacion JSON",
    descripcion_larga: "Utilidades para convertir entre objetos Dart y texto JSON, con soporte para mapas, listas y formato bonito.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Dart SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:json";',
    ejemplo_codigo: 'importar "vox:json";\n\nvariable texto = codificar({"nombre": "Vox"});\nvariable mapa = decodificarMapa(texto);',
    metodos: [
      { nombre_vox: "codificar(obj)", nombre_flutter: "jsonEncode(obj)", descripcion: "Objeto a texto JSON" },
      { nombre_vox: "codificarBonito(obj)", nombre_flutter: "JsonEncoder.withIndent()", descripcion: "JSON formateado con indentacion" },
      { nombre_vox: "decodificar(texto)", nombre_flutter: "jsonDecode(text)", descripcion: "Texto JSON a objeto" },
      { nombre_vox: "decodificarMapa(texto)", nombre_flutter: "jsonDecode() as Map", descripcion: "JSON a Mapa" },
      { nombre_vox: "decodificarLista(texto)", nombre_flutter: "jsonDecode() as List", descripcion: "JSON a Lista" },
    ]
  },
  {
    id: "core-local", nombre_vox: "vox:local", nombre_flutter: "package:shared_preferences", url_pub: "pub.dev/packages/shared_preferences",
    descripcion_corta: "Almacenamiento local persistente clave-valor",
    descripcion_larga: "Almacena datos simples de forma persistente: texto, enteros, decimales, booleanos y listas de texto.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:local";',
    ejemplo_codigo: 'importar "vox:local";\n\nesperar guardarTexto("nombre", "Carlos");\nvariable nombre = esperar obtenerTexto("nombre");',
    metodos: [
      { nombre_vox: "guardarTexto(clave, valor)", nombre_flutter: "setString(key, value)", descripcion: "Guarda texto" },
      { nombre_vox: "obtenerTexto(clave)", nombre_flutter: "getString(key)", descripcion: "Lee texto guardado" },
      { nombre_vox: "guardarEntero(clave, valor)", nombre_flutter: "setInt(key, value)", descripcion: "Guarda entero" },
      { nombre_vox: "guardarBooleano(clave, valor)", nombre_flutter: "setBool(key, value)", descripcion: "Guarda booleano" },
      { nombre_vox: "eliminar(clave)", nombre_flutter: "remove(key)", descripcion: "Elimina una clave" },
      { nombre_vox: "limpiarTodo()", nombre_flutter: "clear()", descripcion: "Borra todo el almacenamiento" },
    ]
  },
  {
    id: "core-tiempo", nombre_vox: "vox:tiempo", nombre_flutter: "dart:core (DateTime)", url_pub: null,
    descripcion_corta: "Utilidades de fecha, hora, diferencias y esperas",
    descripcion_larga: "Funciones para crear fechas, calcular diferencias en dias/horas/minutos, formatear fechas y hacer esperas asincronas.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Dart SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:tiempo";',
    ejemplo_codigo: 'importar "vox:tiempo";\n\nvariable ahora_val = ahora();\nvariable formato = formatoFecha(ahora_val);',
    metodos: [
      { nombre_vox: "ahora()", nombre_flutter: "DateTime.now()", descripcion: "Fecha y hora actual" },
      { nombre_vox: "hoy()", nombre_flutter: "DateTime.now() (solo fecha)", descripcion: "Fecha de hoy sin hora" },
      { nombre_vox: "formatoFecha(fecha)", nombre_flutter: "DateFormat.format()", descripcion: "Formatea DD/MM/AAAA" },
      { nombre_vox: "diasEntre(a, b)", nombre_flutter: "difference().inDays", descripcion: "Dias entre dos fechas" },
      { nombre_vox: "agregarDias(fecha, n)", nombre_flutter: "add(Duration(days: n))", descripcion: "Suma dias a una fecha" },
    ]
  },
  {
    id: "core-seguridad", nombre_vox: "vox:seguridad", nombre_flutter: "package:crypto + dart:convert", url_pub: "pub.dev/packages/crypto",
    descripcion_corta: "Hashing SHA-256/MD5/SHA-1, HMAC y Base64",
    descripcion_larga: "Funciones de seguridad para generar hashes criptograficos, HMAC para autenticacion de mensajes y codificacion/decodificacion Base64.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:seguridad";',
    ejemplo_codigo: 'importar "vox:seguridad";\n\nvariable hash = hashSHA256("mi_password");\nvariable b64 = codificarBase64("Hola Vox");',
    metodos: [
      { nombre_vox: "hashSHA256(texto)", nombre_flutter: "sha256.convert()", descripcion: "Hash SHA-256" },
      { nombre_vox: "hashMD5(texto)", nombre_flutter: "md5.convert()", descripcion: "Hash MD5" },
      { nombre_vox: "hmacSHA256(texto, clave)", nombre_flutter: "Hmac(sha256, key).convert()", descripcion: "HMAC SHA-256" },
      { nombre_vox: "codificarBase64(texto)", nombre_flutter: "base64Encode()", descripcion: "Codifica a Base64" },
      { nombre_vox: "decodificarBase64(texto)", nombre_flutter: "base64Decode()", descripcion: "Decodifica Base64" },
    ]
  },
  {
    id: "core-archivo", nombre_vox: "vox:archivo", nombre_flutter: "dart:io (File/Directory)", url_pub: null,
    descripcion_corta: "Leer, escribir, copiar, mover y listar archivos",
    descripcion_larga: "Operaciones completas del sistema de archivos: lectura/escritura de texto y bytes, copia, movimiento, listado de directorios.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Dart SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:archivo";',
    ejemplo_codigo: 'importar "vox:archivo";\n\nvariable contenido = esperar leerArchivo("datos.txt");\nesperar escribirArchivo("salida.txt", "Hola Vox");',
    metodos: [
      { nombre_vox: "leerArchivo(ruta)", nombre_flutter: "File(path).readAsString()", descripcion: "Lee archivo como texto" },
      { nombre_vox: "escribirArchivo(ruta, contenido)", nombre_flutter: "File(path).writeAsString()", descripcion: "Escribe texto en archivo" },
      { nombre_vox: "existeArchivo(ruta)", nombre_flutter: "File(path).existsSync()", descripcion: "Verifica si archivo existe" },
      { nombre_vox: "copiarArchivo(origen, destino)", nombre_flutter: "File(path).copy()", descripcion: "Copia un archivo" },
      { nombre_vox: "listarArchivos(ruta)", nombre_flutter: "Directory(path).listSync()", descripcion: "Lista archivos en directorio" },
      { nombre_vox: "borrarArchivo(ruta)", nombre_flutter: "File(path).deleteSync()", descripcion: "Elimina un archivo" },
    ]
  },
  {
    id: "core-bd", nombre_vox: "vox:bd", nombre_flutter: "package:sqflite", url_pub: "pub.dev/packages/sqflite",
    descripcion_corta: "Base de datos SQLite local con CRUD y transacciones",
    descripcion_larga: "Base de datos SQLite embebida con creacion de tablas, insercion, consultas, actualizacion, eliminacion, SQL personalizado y transacciones.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:bd";',
    ejemplo_codigo: 'importar "vox:bd";\n\nvariable db = BaseDatosVox();\nesperar db.abrir("mi_app.db");\nesperar db.insertar("usuarios", {"nombre": "Ana", "edad": 25});',
    metodos: [
      { nombre_vox: "abrir(nombre)", nombre_flutter: "openDatabase(name)", descripcion: "Abre/crea la base de datos" },
      { nombre_vox: "insertar(tabla, datos)", nombre_flutter: "db.insert(table, values)", descripcion: "Inserta un registro" },
      { nombre_vox: "consultar(tabla)", nombre_flutter: "db.query(table)", descripcion: "Consulta todos los registros" },
      { nombre_vox: "actualizar(tabla, datos, where)", nombre_flutter: "db.update(table, values)", descripcion: "Actualiza registros" },
      { nombre_vox: "eliminar(tabla, where)", nombre_flutter: "db.delete(table)", descripcion: "Elimina registros" },
      { nombre_vox: "transaccion(fn)", nombre_flutter: "db.transaction(fn)", descripcion: "Ejecuta transaccion atomica" },
    ]
  },
  {
    id: "core-ws", nombre_vox: "vox:ws", nombre_flutter: "dart:io (WebSocket)", url_pub: null,
    descripcion_corta: "Conexiones WebSocket en tiempo real",
    descripcion_larga: "Establece conexiones WebSocket para comunicacion bidireccional en tiempo real. Soporta envio de texto y JSON.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Dart SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:ws";',
    ejemplo_codigo: 'importar "vox:ws";\n\nvariable ws = ConexionWS();\nesperar ws.conectar("wss://api.ejemplo.com/ws");\nws.enviar("Hola servidor");',
    metodos: [
      { nombre_vox: "conectar(url)", nombre_flutter: "WebSocket.connect(url)", descripcion: "Conecta al servidor" },
      { nombre_vox: "enviar(mensaje)", nombre_flutter: "ws.add(message)", descripcion: "Envia texto" },
      { nombre_vox: "enviarJSON(datos)", nombre_flutter: "ws.add(jsonEncode(data))", descripcion: "Envia objeto como JSON" },
      { nombre_vox: "escuchar(callback)", nombre_flutter: "ws.listen(callback)", descripcion: "Escucha mensajes entrantes" },
      { nombre_vox: "cerrar()", nombre_flutter: "ws.close()", descripcion: "Cierra la conexion" },
    ]
  },
  {
    id: "core-regex", nombre_vox: "vox:regex", nombre_flutter: "dart:core (RegExp)", url_pub: null,
    descripcion_corta: "Expresiones regulares, validadores y extraccion",
    descripcion_larga: "Busqueda, reemplazo y validacion con expresiones regulares. Incluye validadores predefinidos para email, URL y numero.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Dart SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:regex";',
    ejemplo_codigo: 'importar "vox:regex";\n\nsi (esEmail("user@vox.dev")) {\n  imprimir("Email valido");\n}',
    metodos: [
      { nombre_vox: "coincide(patron, texto)", nombre_flutter: "RegExp(pattern).hasMatch(text)", descripcion: "Verifica si coincide" },
      { nombre_vox: "buscarTodas(patron, texto)", nombre_flutter: "RegExp(pattern).allMatches(text)", descripcion: "Encuentra todas las coincidencias" },
      { nombre_vox: "esEmail(texto)", nombre_flutter: "RegExp(emailPattern).hasMatch()", descripcion: "Valida formato email" },
      { nombre_vox: "esURL(texto)", nombre_flutter: "RegExp(urlPattern).hasMatch()", descripcion: "Valida formato URL" },
    ]
  },
  {
    id: "core-ubicacion", nombre_vox: "vox:ubicacion", nombre_flutter: "package:geolocator", url_pub: "pub.dev/packages/geolocator",
    descripcion_corta: "Geolocalizacion GPS con distancia y vigilancia",
    descripcion_larga: "Obtiene la ubicacion del dispositivo, calcula distancias entre coordenadas y vigila cambios de posicion en tiempo real.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web"],
    instalacion: 'importar "vox:ubicacion";',
    ejemplo_codigo: 'importar "vox:ubicacion";\n\nvariable pos = esperar obtenerUbicacion();\nimprimir("Lat: {pos.latitud}, Lon: {pos.longitud}");',
    metodos: [
      { nombre_vox: "obtenerUbicacion()", nombre_flutter: "Geolocator.getCurrentPosition()", descripcion: "Posicion actual del GPS" },
      { nombre_vox: "calcularDistancia(lat1, lon1, lat2, lon2)", nombre_flutter: "Geolocator.distanceBetween()", descripcion: "Distancia en metros" },
      { nombre_vox: "vigilarUbicacion(callback)", nombre_flutter: "Geolocator.getPositionStream()", descripcion: "Escucha cambios de posicion" },
    ]
  },
  {
    id: "core-permisos", nombre_vox: "vox:permisos", nombre_flutter: "package:permission_handler", url_pub: "pub.dev/packages/permission_handler",
    descripcion_corta: "Solicitar y verificar permisos del dispositivo",
    descripcion_larga: "Gestiona permisos de camara, galeria, ubicacion, microfono, notificaciones, contactos, bluetooth y mas.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:permisos";',
    ejemplo_codigo: 'importar "vox:permisos";\n\nvariable estado = esperar solicitar(TipoPermiso.camara);\nsi (estado == EstadoPermiso.concedido) {\n  imprimir("Camara autorizada");\n}',
    metodos: [
      { nombre_vox: "solicitar(tipo)", nombre_flutter: "Permission.request()", descripcion: "Pide un permiso al usuario" },
      { nombre_vox: "verificar(tipo)", nombre_flutter: "Permission.status", descripcion: "Verifica estado actual" },
      { nombre_vox: "estaConcedido(tipo)", nombre_flutter: "Permission.isGranted", descripcion: "Esta concedido?" },
      { nombre_vox: "abrirConfiguracion()", nombre_flutter: "openAppSettings()", descripcion: "Abre config del SO" },
    ]
  },
  {
    id: "core-conexion", nombre_vox: "vox:conexion", nombre_flutter: "package:connectivity_plus", url_pub: "pub.dev/packages/connectivity_plus",
    descripcion_corta: "Detecta estado de conexion a internet",
    descripcion_larga: "Verifica si hay Wi-Fi, datos moviles o ethernet activo. Vigila cambios de conectividad en tiempo real.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:conexion";',
    ejemplo_codigo: 'importar "vox:conexion";\n\nsi (esperar hayConexion()) {\n  imprimir("Hay internet");\n}',
    metodos: [
      { nombre_vox: "hayConexion()", nombre_flutter: "Connectivity().checkConnectivity()", descripcion: "Hay internet?" },
      { nombre_vox: "hayWifi()", nombre_flutter: "result == wifi", descripcion: "Conectado por Wi-Fi?" },
      { nombre_vox: "hayMovil()", nombre_flutter: "result == mobile", descripcion: "Conectado por datos moviles?" },
      { nombre_vox: "vigilarConexion(callback)", nombre_flutter: "onConnectivityChanged", descripcion: "Escucha cambios de red" },
    ]
  },
  {
    id: "core-camara", nombre_vox: "vox:camara", nombre_flutter: "package:camera", url_pub: "pub.dev/packages/camera",
    descripcion_corta: "Acceso directo a camaras: fotos, video y flash",
    descripcion_larga: "Control completo de las camaras del dispositivo para capturar fotos y grabar video. Soporta camara frontal/trasera y flash.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web"],
    instalacion: 'importar "vox:camara";',
    ejemplo_codigo: 'importar "vox:camara";\n\nvariable camaras = esperar obtenerCamaras();\nvariable foto = esperar tomarFoto();',
    metodos: [
      { nombre_vox: "obtenerCamaras()", nombre_flutter: "availableCameras()", descripcion: "Lista camaras del dispositivo" },
      { nombre_vox: "tomarFoto()", nombre_flutter: "takePicture()", descripcion: "Captura una foto" },
      { nombre_vox: "iniciarVideo()", nombre_flutter: "startVideoRecording()", descripcion: "Inicia grabacion de video" },
      { nombre_vox: "detenerVideo()", nombre_flutter: "stopVideoRecording()", descripcion: "Detiene grabacion" },
    ]
  },
  {
    id: "core-imagen", nombre_vox: "vox:imagen", nombre_flutter: "package:image_picker", url_pub: "pub.dev/packages/image_picker",
    descripcion_corta: "Seleccionar imagenes y videos de la galeria",
    descripcion_larga: "Permite al usuario seleccionar fotos/videos de la galeria o tomar nuevas con la camara.",
    categoria: "Core", version: "1.0.0", licencia: "Apache 2.0", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web"],
    instalacion: 'importar "vox:imagen";',
    ejemplo_codigo: 'importar "vox:imagen";\n\nvariable foto = esperar seleccionarDeGaleria();\nvariable nuevaFoto = esperar tomarFoto();',
    metodos: [
      { nombre_vox: "seleccionarDeGaleria()", nombre_flutter: "pickImage(source: gallery)", descripcion: "Elige imagen de galeria" },
      { nombre_vox: "tomarFoto()", nombre_flutter: "pickImage(source: camera)", descripcion: "Abre camara y captura" },
      { nombre_vox: "seleccionarMultiples()", nombre_flutter: "pickMultiImage()", descripcion: "Selecciona varias imagenes" },
    ]
  },
  {
    id: "core-mapa", nombre_vox: "vox:mapa", nombre_flutter: "package:google_maps_flutter", url_pub: "pub.dev/packages/google_maps_flutter",
    descripcion_corta: "Google Maps con marcadores, lineas y circulos",
    descripcion_larga: "Integracion completa de Google Maps con marcadores personalizados, polilineas, circulos y control de la camara.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:mapa";',
    ejemplo_codigo: 'importar "vox:mapa";\n\nvariable ctrl = crearControlador();\nctrl.agregarMarcador(crearMarcador(\n  posicion: crearPosicion(-12.04, -77.03),\n  titulo: "Lima"\n));',
    metodos: [
      { nombre_vox: "crearControlador()", nombre_flutter: "GoogleMapController", descripcion: "Crea controlador del mapa" },
      { nombre_vox: "agregarMarcador(marcador)", nombre_flutter: "markers.add()", descripcion: "Agrega pin al mapa" },
      { nombre_vox: "moverCamara(posicion, zoom)", nombre_flutter: "animateCamera()", descripcion: "Mueve la vista del mapa" },
    ]
  },
  {
    id: "core-pdf", nombre_vox: "vox:pdf", nombre_flutter: "package:flutter_pdfview", url_pub: "pub.dev/packages/flutter_pdfview",
    descripcion_corta: "Visor de archivos PDF con navegacion",
    descripcion_larga: "Renderiza archivos PDF con navegacion de paginas, modo nocturno y control programatico de la vista.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:pdf";',
    ejemplo_codigo: 'importar "vox:pdf";\n\ndiseno {\n  visorPDF("doc.pdf")\n}',
    metodos: [
      { nombre_vox: "visorPDF(ruta)", nombre_flutter: "PDFView(filePath)", descripcion: "Widget visor de PDF" },
      { nombre_vox: "irAPagina(n)", nombre_flutter: "setPage(n)", descripcion: "Navega a pagina especifica" },
    ]
  },
  {
    id: "core-qr", nombre_vox: "vox:qr", nombre_flutter: "package:qr_flutter", url_pub: "pub.dev/packages/qr_flutter",
    descripcion_corta: "Genera codigos QR para texto, URLs y WiFi",
    descripcion_larga: "Genera widgets de codigo QR para texto libre, URLs, contactos vCard y credenciales WiFi.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web"],
    instalacion: 'importar "vox:qr";',
    ejemplo_codigo: 'importar "vox:qr";\n\ndiseno {\n  generarQR("https://voxlang.dev", tamano: 200)\n}',
    metodos: [
      { nombre_vox: "generarQR(datos, tamano)", nombre_flutter: "QrImageView(data, size)", descripcion: "Genera QR generico" },
      { nombre_vox: "qrUrl(url)", nombre_flutter: "QrImageView(data: url)", descripcion: "QR de URL" },
      { nombre_vox: "qrWifi(ssid, password)", nombre_flutter: "QrImageView(data: wifiString)", descripcion: "QR de credencial WiFi" },
    ]
  },
  {
    id: "core-biometria", nombre_vox: "vox:biometria", nombre_flutter: "package:local_auth", url_pub: "pub.dev/packages/local_auth",
    descripcion_corta: "Autenticacion biometrica: huella, cara e iris",
    descripcion_larga: "Autenticacion biometrica del dispositivo con soporte para huella dactilar, reconocimiento facial e iris.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:biometria";',
    ejemplo_codigo: 'importar "vox:biometria";\n\nsi (esperar estaDisponible()) {\n  variable ok = esperar autenticar("Confirma tu identidad");\n}',
    metodos: [
      { nombre_vox: "estaDisponible()", nombre_flutter: "canCheckBiometrics", descripcion: "Hay biometria disponible?" },
      { nombre_vox: "autenticar(mensaje)", nombre_flutter: "authenticate(reason)", descripcion: "Solicita autenticacion" },
      { nombre_vox: "tieneHuella()", nombre_flutter: "biometrics.contains(fingerprint)", descripcion: "Soporta huella?" },
    ]
  },
  {
    id: "core-notificaciones", nombre_vox: "vox:notificaciones", nombre_flutter: "package:flutter_local_notifications", url_pub: "pub.dev/packages/flutter_local_notifications",
    descripcion_corta: "Notificaciones locales simples",
    descripcion_larga: "Muestra notificaciones locales con titulo y cuerpo personalizados. Inicializacion automatica para Android e iOS.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:notificaciones";',
    ejemplo_codigo: 'importar "vox:notificaciones";\n\nesperar inicializar();\nesperar mostrar("Hola!", "Mensaje desde Vox");',
    metodos: [
      { nombre_vox: "inicializar()", nombre_flutter: "initialize()", descripcion: "Configura notificaciones" },
      { nombre_vox: "mostrar(titulo, cuerpo)", nombre_flutter: "show(id, title, body)", descripcion: "Muestra notificacion" },
      { nombre_vox: "cancelar(id)", nombre_flutter: "cancel(id)", descripcion: "Cancela una notificacion" },
      { nombre_vox: "cancelarTodas()", nombre_flutter: "cancelAll()", descripcion: "Cancela todas" },
    ]
  },
  {
    id: "core-estado", nombre_vox: "vox:estado", nombre_flutter: "dart:async (Streams)", url_pub: null,
    descripcion_corta: "Estado global reactivo con streams y almacen clave-valor",
    descripcion_larga: "Sistema de estado global propio de Vox usando streams de Dart. Incluye clase abstracta EstadoGlobal y almacen reactivo clave-valor.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Vox)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:estado";',
    ejemplo_codigo: 'importar "vox:estado";\n\nalmacenGlobal.establecer("usuario", "Carlos");\nvariable nombre = almacenGlobal.obtener("usuario");',
    metodos: [
      { nombre_vox: "establecer(clave, valor)", nombre_flutter: "StreamController (custom)", descripcion: "Guarda valor reactivo" },
      { nombre_vox: "obtener(clave)", nombre_flutter: "StreamController (custom)", descripcion: "Lee valor actual" },
      { nombre_vox: "escuchar(clave, callback)", nombre_flutter: "stream.listen()", descripcion: "Escucha cambios en clave" },
      { nombre_vox: "notificar()", nombre_flutter: "sink.add()", descripcion: "Notifica a los suscriptores" },
    ]
  },
  {
    id: "core-audio", nombre_vox: "vox:audio", nombre_flutter: "package:audioplayers", url_pub: "pub.dev/packages/audioplayers",
    descripcion_corta: "Reproduccion de audio con control de volumen y progreso",
    descripcion_larga: "Reproductor de audio completo desde URL, archivo o asset. Control de volumen, velocidad, repeticion y tracking de progreso.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "macOS"],
    instalacion: 'importar "vox:audio";',
    ejemplo_codigo: 'importar "vox:audio";\n\nvariable player = crearReproductor();\nesperar player.reproducirDesdeUrl("https://audio.mp3");',
    metodos: [
      { nombre_vox: "reproducirDesdeUrl(url)", nombre_flutter: "play(UrlSource(url))", descripcion: "Reproduce audio desde URL" },
      { nombre_vox: "pausar()", nombre_flutter: "pause()", descripcion: "Pausa la reproduccion" },
      { nombre_vox: "detener()", nombre_flutter: "stop()", descripcion: "Detiene reproduccion" },
      { nombre_vox: "establecerVolumen(v)", nombre_flutter: "setVolume(v)", descripcion: "Ajusta volumen 0.0-1.0" },
    ]
  },
  {
    id: "core-video", nombre_vox: "vox:video", nombre_flutter: "package:video_player", url_pub: "pub.dev/packages/video_player",
    descripcion_corta: "Reproduccion de video con controles completos",
    descripcion_larga: "Reproductor de video desde URL, archivo o asset. Control de volumen, velocidad, posicion y aspect ratio.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web"],
    instalacion: 'importar "vox:video";',
    ejemplo_codigo: 'importar "vox:video";\n\nvariable player = crearReproductor();\nesperar player.desdeUrl("https://video.mp4");\nesperar player.reproducir();',
    metodos: [
      { nombre_vox: "desdeUrl(url)", nombre_flutter: "VideoPlayerController.networkUrl()", descripcion: "Carga video remoto" },
      { nombre_vox: "reproducir()", nombre_flutter: "play()", descripcion: "Inicia reproduccion" },
      { nombre_vox: "pausar()", nombre_flutter: "pause()", descripcion: "Pausa el video" },
    ]
  },
  {
    id: "core-firebase", nombre_vox: "vox:firebase", nombre_flutter: "package:firebase_core + auth + firestore", url_pub: "pub.dev/packages/firebase_core",
    descripcion_corta: "Firebase Auth + Firestore completo",
    descripcion_larga: "Autenticacion con email/password, CRUD de Firestore, escucha en tiempo real y transacciones.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web"],
    instalacion: 'importar "vox:firebase";',
    ejemplo_codigo: 'importar "vox:firebase";\n\nesperar inicializar();\nesperar registrar("user@vox.dev", "password123");',
    metodos: [
      { nombre_vox: "inicializar()", nombre_flutter: "Firebase.initializeApp()", descripcion: "Inicializa Firebase" },
      { nombre_vox: "registrar(email, pass)", nombre_flutter: "createUserWithEmailAndPassword()", descripcion: "Crea cuenta nueva" },
      { nombre_vox: "iniciarSesion(email, pass)", nombre_flutter: "signInWithEmailAndPassword()", descripcion: "Inicia sesion" },
      { nombre_vox: "establecerDocumento(col, id, datos)", nombre_flutter: "doc.set(data)", descripcion: "Crea/actualiza documento" },
      { nombre_vox: "escucharColeccion(col, callback)", nombre_flutter: "snapshots().listen()", descripcion: "Escucha cambios en tiempo real" },
    ]
  },
  {
    id: "core-supabase", nombre_vox: "vox:supabase", nombre_flutter: "package:supabase_flutter", url_pub: "pub.dev/packages/supabase_flutter",
    descripcion_corta: "Supabase Auth + BD + Storage + Realtime",
    descripcion_larga: "Integracion completa con Supabase: auth con email, CRUD de tablas, subida de archivos y suscripciones en tiempo real.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS"],
    instalacion: 'importar "vox:supabase";',
    ejemplo_codigo: 'importar "vox:supabase";\n\nesperar inicializar("https://tu-proyecto.supabase.co", "tu-key");',
    metodos: [
      { nombre_vox: "inicializar(url, key)", nombre_flutter: "Supabase.initialize()", descripcion: "Conecta con Supabase" },
      { nombre_vox: "insertar(tabla, datos)", nombre_flutter: "from(table).insert(data)", descripcion: "Inserta registro" },
      { nombre_vox: "consultar(tabla)", nombre_flutter: "from(table).select()", descripcion: "Lee todos los registros" },
      { nombre_vox: "subirArchivo(bucket, ruta, bytes)", nombre_flutter: "storage.upload()", descripcion: "Sube archivo a Storage" },
      { nombre_vox: "escucharTabla(tabla, callback)", nombre_flutter: "channel.onPostgresChanges()", descripcion: "Suscripcion realtime" },
    ]
  },
  {
    id: "core-mongodb", nombre_vox: "vox:mongodb", nombre_flutter: "package:mongo_dart", url_pub: "pub.dev/packages/mongo_dart",
    descripcion_corta: "Cliente MongoDB con CRUD y agregaciones",
    descripcion_larga: "Conexion directa a MongoDB con CRUD completo, consultas avanzadas, agregaciones, indices y transacciones.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:mongodb";',
    ejemplo_codigo: 'importar "vox:mongodb";\n\nvariable db = MongoDBVox();\nesperar db.conectar("mongodb://localhost/mi_app");',
    metodos: [
      { nombre_vox: "conectar(url)", nombre_flutter: "Db.create(url)", descripcion: "Conecta al servidor" },
      { nombre_vox: "insertar(col, datos)", nombre_flutter: "collection.insertOne()", descripcion: "Inserta documento" },
      { nombre_vox: "consultar(col)", nombre_flutter: "collection.find()", descripcion: "Lee todos los documentos" },
    ]
  },
  {
    id: "core-mysql", nombre_vox: "vox:mysql", nombre_flutter: "package:mysql_client", url_pub: "pub.dev/packages/mysql_client",
    descripcion_corta: "Cliente MySQL/MariaDB con CRUD y DDL",
    descripcion_larga: "Conexion a MySQL/MariaDB con creacion de tablas, CRUD parametrizado, consultas SQL personalizadas.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:mysql";',
    ejemplo_codigo: 'importar "vox:mysql";\n\nvariable db = MySQLVox();\nesperar db.conectar(host: "localhost", usuario: "root", bd: "mi_app");',
    metodos: [
      { nombre_vox: "conectar(host, usuario, pass, bd)", nombre_flutter: "MySQLConnection.createConnection()", descripcion: "Conecta al servidor" },
      { nombre_vox: "insertar(tabla, datos)", nombre_flutter: "execute(INSERT INTO...)", descripcion: "Inserta registro" },
      { nombre_vox: "consultar(tabla)", nombre_flutter: "execute(SELECT * FROM...)", descripcion: "Consulta todo" },
      { nombre_vox: "ejecutarSQL(sql)", nombre_flutter: "execute(sql)", descripcion: "SQL personalizado" },
    ]
  },
  {
    id: "core-postgres", nombre_vox: "vox:postgres", nombre_flutter: "package:postgres", url_pub: "pub.dev/packages/postgres",
    descripcion_corta: "Cliente PostgreSQL con transacciones y SSL",
    descripcion_larga: "Conexion a PostgreSQL con parametros nombrados, DDL, CRUD, transacciones atomicas y soporte SSL.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:postgres";',
    ejemplo_codigo: 'importar "vox:postgres";\n\nvariable db = PostgresVox();\nesperar db.conectar(host: "localhost", bd: "mi_app");',
    metodos: [
      { nombre_vox: "conectar(host, usuario, pass, bd)", nombre_flutter: "Connection.open(Endpoint(...))", descripcion: "Conecta al servidor" },
      { nombre_vox: "insertar(tabla, datos)", nombre_flutter: "execute(Sql.named(INSERT...))", descripcion: "Inserta registro" },
      { nombre_vox: "transaccion(fn)", nombre_flutter: "runTx((session) => ...)", descripcion: "Transaccion atomica" },
    ]
  },
  {
    id: "core-sqlserver", nombre_vox: "vox:sqlserver", nombre_flutter: "package:mssql_connection", url_pub: "pub.dev/packages/mssql_connection",
    descripcion_corta: "Cliente SQL Server con procedimientos almacenados",
    descripcion_larga: "Conexion a SQL Server con DDL, CRUD, consultas parametrizadas y procedimientos almacenados.",
    categoria: "Core", version: "1.0.0", licencia: "MIT", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Windows"],
    instalacion: 'importar "vox:sqlserver";',
    ejemplo_codigo: 'importar "vox:sqlserver";\n\nvariable db = SQLServerVox();\nesperar db.conectar(host: "servidor", bd: "mi_app");',
    metodos: [
      { nombre_vox: "conectar(host, usuario, pass, bd)", nombre_flutter: "MssqlConnection.connect()", descripcion: "Conecta al servidor" },
      { nombre_vox: "ejecutarProcedimiento(nombre, params)", nombre_flutter: "execute(EXEC ...)", descripcion: "Ejecuta stored procedure" },
    ]
  },
  {
    id: "core-nativo", nombre_vox: "vox:nativo", nombre_flutter: "package:flutter/services.dart", url_pub: null,
    descripcion_corta: "Comunicacion con codigo nativo Kotlin/Swift",
    descripcion_larga: "Platform Channels para invocar funciones nativas de Kotlin (Android) y Swift (iOS) desde Vox.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Flutter SDK)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS"],
    instalacion: 'importar "vox:nativo";',
    ejemplo_codigo: 'importar "vox:nativo";\n\nvariable canal = crearCanal("mi_canal");\nvariable resultado = esperar canal.invocar("obtenerBateria");',
    metodos: [
      { nombre_vox: "crearCanal(nombre)", nombre_flutter: "MethodChannel(name)", descripcion: "Crea canal de metodo" },
      { nombre_vox: "invocar(metodo, args)", nombre_flutter: "channel.invokeMethod()", descripcion: "Llama funcion nativa" },
      { nombre_vox: "alRecibir(callback)", nombre_flutter: "setMethodCallHandler()", descripcion: "Escucha llamadas nativas" },
    ]
  },
  {
    id: "core-test", nombre_vox: "vox:test", nombre_flutter: "Implementacion propia", url_pub: null,
    descripcion_corta: "Framework de testing unitario en espanol",
    descripcion_larga: "Framework de pruebas propio de Vox con aserciones en espanol, grupos de tests y reporte de resultados.",
    categoria: "Core", version: "1.0.0", licencia: "BSD-3 (Vox)", ultima_actualizacion: "2026-04-04",
    descargas_mes: null, estrellas: null, autor: "Vox Lang", plataformas: ["Android", "iOS", "Web", "Windows", "macOS", "Linux"],
    instalacion: 'importar "vox:test";',
    ejemplo_codigo: 'importar "vox:test";\n\nvariable gestor = GestorPruebas();\ngestor.prueba("suma correcta", () {\n  afirmarIgual(2 + 2, 4);\n});\ngestor.resumen();',
    metodos: [
      { nombre_vox: "prueba(nombre, fn)", nombre_flutter: "test(name, fn)", descripcion: "Define una prueba" },
      { nombre_vox: "afirmarIgual(a, b)", nombre_flutter: "expect(a, equals(b))", descripcion: "Verifica igualdad" },
      { nombre_vox: "afirmarVerdadero(v)", nombre_flutter: "expect(v, isTrue)", descripcion: "Verifica que sea true" },
      { nombre_vox: "afirmarLanza(fn)", nombre_flutter: "expect(fn, throwsException)", descripcion: "Verifica que lance error" },
    ]
  },
];

// --- LIBRERIAS DE TERCEROS (wrappers de pub.dev traducidos) ---

export const LIBRERIAS_TERCEROS = [
  { id:"vox-audio-player", nombre_vox:"vox:audio-player", nombre_flutter:"audioplayers", url_pub:"pub.dev/packages/audioplayers", descripcion_corta:"Reproduce MP3, WAV y formatos de audio", descripcion_larga:"Biblioteca completa para reproducir audio en multiples formatos. Soporta reproduccion en segundo plano, control de volumen y ecualizador.", categoria:"Audio/Video", version:"6.0.0", licencia:"MIT", ultima_actualizacion:"2024-08-15", descargas_mes:45230, estrellas:3200, autor:"bluefireoss", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:audio-player", ejemplo_codigo:'importar "vox:audio-player";\n\nfuncion reproducir() {\n  reproductor.cargar("cancion.mp3");\n  reproductor.iniciar();\n}', metodos:[{nombre_vox:"cargar(ruta)",nombre_flutter:"setSourceAsset(path)",descripcion:"Carga archivo de audio"},{nombre_vox:"iniciar()",nombre_flutter:"resume()",descripcion:"Inicia reproduccion"},{nombre_vox:"pausar()",nombre_flutter:"pause()",descripcion:"Pausa la reproduccion"}] },
  { id:"vox-audio-grabador", nombre_vox:"vox:audio-grabador", nombre_flutter:"record", url_pub:"pub.dev/packages/record", descripcion_corta:"Graba audio con control de calidad", descripcion_larga:"Plugin para grabar audio con opciones de formato y calidad configurable. Soporta WAV, AAC y MP3.", categoria:"Audio/Video", version:"5.1.0", licencia:"MIT", ultima_actualizacion:"2024-06-20", descargas_mes:22100, estrellas:1100, autor:"llfbandit", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:audio-grabador", ejemplo_codigo:'importar "vox:audio-grabador";\n\nfuncion grabar() {\n  grabador.iniciar(formato: "aac");\n}', metodos:[{nombre_vox:"iniciar()",nombre_flutter:"start()",descripcion:"Inicia grabacion"},{nombre_vox:"detener()",nombre_flutter:"stop()",descripcion:"Detiene y guarda"}] },
  { id:"vox-audio-onda", nombre_vox:"vox:audio-onda", nombre_flutter:"audio_waveforms", url_pub:"pub.dev/packages/audio_waveforms", descripcion_corta:"Visualiza ondas de audio en tiempo real", descripcion_larga:"Renderiza formas de onda de audio animadas durante grabacion y reproduccion. Ideal para apps de mensajeria.", categoria:"Audio/Video", version:"1.0.5", licencia:"MIT", ultima_actualizacion:"2024-03-10", descargas_mes:8900, estrellas:890, autor:"SimformSolutions", plataformas:["Android","iOS"], instalacion:"vox instalar vox:audio-onda", ejemplo_codigo:'importar "vox:audio-onda";\n\ndiseno {\n  VisualizadorOnda(controlador: ondaControlador)\n}', metodos:[{nombre_vox:"actualizar(datos)",nombre_flutter:"updateWaveData(data)",descripcion:"Actualiza la onda"}] },
  { id:"vox-audio-just", nombre_vox:"vox:audio-just", nombre_flutter:"just_audio", url_pub:"pub.dev/packages/just_audio", descripcion_corta:"Reproductor de audio avanzado con streams", descripcion_larga:"Reproductor de audio completo con soporte para playlists, streams en vivo y concatenacion de fuentes de audio.", categoria:"Audio/Video", version:"0.9.37", licencia:"MIT", ultima_actualizacion:"2024-07-01", descargas_mes:38000, estrellas:2800, autor:"ryanheise", plataformas:["Android","iOS","Web","macOS"], instalacion:"vox instalar vox:audio-just", ejemplo_codigo:'importar "vox:audio-just";\n\nfuncion cargarPlaylist() {\n  jugador.cargarLista(["a.mp3","b.mp3"]);\n  jugador.iniciar();\n}', metodos:[{nombre_vox:"cargarLista(lista)",nombre_flutter:"setAudioSources(list)",descripcion:"Carga una lista de audio"}] },
  { id:"vox-audio-fondo", nombre_vox:"vox:audio-fondo", nombre_flutter:"audio_service", url_pub:"pub.dev/packages/audio_service", descripcion_corta:"Reproduce audio en segundo plano", descripcion_larga:"Permite reproducir audio cuando la app esta en background con controles en la notificacion del sistema operativo.", categoria:"Audio/Video", version:"0.18.14", licencia:"MIT", ultima_actualizacion:"2024-05-12", descargas_mes:29500, estrellas:1950, autor:"ryanheise", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:audio-fondo", ejemplo_codigo:'importar "vox:audio-fondo";\n\nservicio.iniciarEnFondo();\nservicio.reproducir("cancion.mp3");', metodos:[{nombre_vox:"iniciarEnFondo()",nombre_flutter:"AudioService.init()",descripcion:"Inicia en background"}] },
  { id:"vox-video-player", nombre_vox:"vox:video-player", nombre_flutter:"video_player", url_pub:"pub.dev/packages/video_player", descripcion_corta:"Reproduce videos MP4 y HLS", descripcion_larga:"Plugin oficial de Flutter para reproduccion de video. Soporta archivos locales, URLs remotas y streaming HLS.", categoria:"Audio/Video", version:"2.8.3", licencia:"BSD", ultima_actualizacion:"2024-09-18", descargas_mes:52000, estrellas:4100, autor:"flutter-team", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:video-player", ejemplo_codigo:'importar "vox:video-player";\n\ndiseno {\n  ReproductorVideo(url: "https://video.mp4")\n}', metodos:[{nombre_vox:"cargar(url)",nombre_flutter:"VideoPlayerController.networkUrl()",descripcion:"Carga video remoto"}] },
  { id:"vox-video-camara", nombre_vox:"vox:video-camara", nombre_flutter:"camera", url_pub:"pub.dev/packages/camera", descripcion_corta:"Accede a la camara del dispositivo", descripcion_larga:"Plugin oficial para acceder a camaras del dispositivo. Soporta foto, video, flash y multiples camaras.", categoria:"Audio/Video", version:"0.10.6", licencia:"BSD", ultima_actualizacion:"2024-10-02", descargas_mes:48000, estrellas:3600, autor:"flutter-team", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:video-camara", ejemplo_codigo:'importar "vox:video-camara";\n\ndiseno {\n  VistaCamara(controlador: camara)\n}', metodos:[{nombre_vox:"tomarFoto()",nombre_flutter:"takePicture()",descripcion:"Captura una foto"}] },
  { id:"vox-video-miniatura", nombre_vox:"vox:video-miniatura", nombre_flutter:"video_thumbnail", url_pub:"pub.dev/packages/video_thumbnail", descripcion_corta:"Genera thumbnails de videos locales", descripcion_larga:"Extrae fotogramas de videos locales o remotos para generar miniaturas en formato JPEG o PNG.", categoria:"Audio/Video", version:"0.5.3", licencia:"Apache 2.0", ultima_actualizacion:"2023-11-05", descargas_mes:15600, estrellas:720, autor:"hexagons", plataformas:["Android","iOS"], instalacion:"vox instalar vox:video-miniatura", ejemplo_codigo:'importar "vox:video-miniatura";\n\nvariable imagen = esperar miniatura.generar(ruta: "video.mp4");', metodos:[{nombre_vox:"generar(ruta)",nombre_flutter:"VideoThumbnail.thumbnailFile()",descripcion:"Genera miniatura del video"}] },
  { id:"vox-voz-texto", nombre_vox:"vox:voz-texto", nombre_flutter:"speech_to_text", url_pub:"pub.dev/packages/speech_to_text", descripcion_corta:"Convierte voz a texto en tiempo real", descripcion_larga:"Reconocimiento de voz en tiempo real con soporte multiidioma. Ideal para comandos de voz y transcripciones.", categoria:"Audio/Video", version:"6.6.1", licencia:"MIT", ultima_actualizacion:"2024-09-25", descargas_mes:31200, estrellas:2100, autor:"csdcorp", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:voz-texto", ejemplo_codigo:'importar "vox:voz-texto";\n\nreconocedor.escuchar(alOir: funcion(texto) {\n  imprimir(texto);\n});', metodos:[{nombre_vox:"escuchar(alOir)",nombre_flutter:"listen(onResult)",descripcion:"Escucha y transcribe"}] },
  { id:"vox-texto-voz", nombre_vox:"vox:texto-voz", nombre_flutter:"flutter_tts", url_pub:"pub.dev/packages/flutter_tts", descripcion_corta:"Convierte texto a voz sintetizada", descripcion_larga:"Plugin text-to-speech con soporte para multiples idiomas, velocidades y tonos de voz configurables.", categoria:"Audio/Video", version:"4.0.2", licencia:"MIT", ultima_actualizacion:"2024-08-28", descargas_mes:28900, estrellas:1800, autor:"dlutton", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:texto-voz", ejemplo_codigo:'importar "vox:texto-voz";\n\nsintetizador.idioma("es-ES");\nesperar sintetizador.hablar("Hola mundo");', metodos:[{nombre_vox:"hablar(texto)",nombre_flutter:"speak(text)",descripcion:"Pronuncia el texto dado"}] },
  { id:"vox-imagen-selector", nombre_vox:"vox:imagen-selector", nombre_flutter:"image_picker", url_pub:"pub.dev/packages/image_picker", descripcion_corta:"Selecciona imagenes de la galeria", descripcion_larga:"Plugin oficial para seleccionar fotos y videos de la galeria o capturarlos con la camara.", categoria:"Utilidades", version:"1.1.2", licencia:"Apache 2.0", ultima_actualizacion:"2024-10-10", descargas_mes:89000, estrellas:5800, autor:"flutter-team", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:imagen-selector", ejemplo_codigo:'importar "vox:imagen-selector";\n\nvariable imagen = esperar Galeria.elegirImagen();', metodos:[{nombre_vox:"elegirImagen()",nombre_flutter:"picker.pickImage()",descripcion:"Selecciona foto de galeria"}] },
  { id:"vox-imagen-recorte", nombre_vox:"vox:imagen-recorte", nombre_flutter:"image_cropper", url_pub:"pub.dev/packages/image_cropper", descripcion_corta:"Recorta imagenes seleccionadas", descripcion_larga:"Permite al usuario recortar imagenes con relaciones de aspecto personalizadas y rotacion.", categoria:"Utilidades", version:"8.0.2", licencia:"Apache 2.0", ultima_actualizacion:"2024-07-22", descargas_mes:48000, estrellas:3700, autor:"lixitcode", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:imagen-recorte", ejemplo_codigo:'importar "vox:imagen-recorte";\n\nvariable recortada = esperar Recortador.recortar(imagen.ruta);', metodos:[{nombre_vox:"recortar(ruta)",nombre_flutter:"ImageCropper.cropImage()",descripcion:"Abre interfaz de recorte"}] },
  { id:"vox-estado-provider", nombre_vox:"vox:estado-provider", nombre_flutter:"provider", url_pub:"pub.dev/packages/provider", descripcion_corta:"Gestion de estado simple", descripcion_larga:"Solucion recomendada para gestion de estado. Basada en el patron InheritedWidget de Flutter.", categoria:"Estado", version:"6.1.2", licencia:"MIT", ultima_actualizacion:"2024-04-15", descargas_mes:168000, estrellas:12500, autor:"rrousselgit", plataformas:["Android","iOS","Web","Windows","macOS"], instalacion:"vox instalar vox:estado-provider", ejemplo_codigo:'importar "vox:estado-provider";\n\ndiseno {\n  Consumidor<MiEstado> { (estado) => Texto("Contador: {estado.valor}") }\n}', metodos:[{nombre_vox:"Consumidor<T>()",nombre_flutter:"Consumer<T>()",descripcion:"Escucha cambios de estado"}] },
  { id:"vox-estado-riverpod", nombre_vox:"vox:estado-riverpod", nombre_flutter:"flutter_riverpod", url_pub:"pub.dev/packages/flutter_riverpod", descripcion_corta:"Gestion de estado reactiva moderna", descripcion_larga:"Evolucion de Provider con mejor testabilidad y sin dependencia del BuildContext para el estado.", categoria:"Estado", version:"2.5.1", licencia:"MIT", ultima_actualizacion:"2024-09-01", descargas_mes:95000, estrellas:8900, autor:"rrousselgit", plataformas:["Android","iOS","Web","Windows","macOS"], instalacion:"vox instalar vox:estado-riverpod", ejemplo_codigo:'importar "vox:estado-riverpod";\n\nvariable contadorProvider = StateProvider((ref) => 0);', metodos:[{nombre_vox:"ConsumidorRiver()",nombre_flutter:"ConsumerWidget()",descripcion:"Widget de estado reactivo"}] },
  { id:"vox-estado-bloc", nombre_vox:"vox:estado-bloc", nombre_flutter:"flutter_bloc", url_pub:"pub.dev/packages/flutter_bloc", descripcion_corta:"Patron BLoC con eventos y estados", descripcion_larga:"Arquitectura empresarial que separa la UI de la logica de negocios mediante streams de eventos y estados.", categoria:"Estado", version:"8.1.6", licencia:"MIT", ultima_actualizacion:"2024-08-05", descargas_mes:88000, estrellas:8200, autor:"felangel", plataformas:["Android","iOS","Web","Windows","macOS"], instalacion:"vox instalar vox:estado-bloc", ejemplo_codigo:'importar "vox:estado-bloc";\n\ndiseno {\n  ConstructorBloc<MiBloc, Estado> { (estado) => VistaEstado(estado) }\n}', metodos:[{nombre_vox:"ConstructorBloc()",nombre_flutter:"BlocBuilder()",descripcion:"Construye UI segun el estado"}] },
  { id:"vox-estado-getx", nombre_vox:"vox:estado-getx", nombre_flutter:"get", url_pub:"pub.dev/packages/get", descripcion_corta:"Estado, rutas e inyeccion juntos", descripcion_larga:"Ecosistema completo con gestion de estado reactiva extremadamente simple y navegacion sin contexto.", categoria:"Estado", version:"4.6.6", licencia:"MIT", ultima_actualizacion:"2024-03-20", descargas_mes:128000, estrellas:10200, autor:"jonataslaw", plataformas:["Android","iOS","Web","Windows","macOS"], instalacion:"vox instalar vox:estado-getx", ejemplo_codigo:'importar "vox:estado-getx";\n\nvariable c = Get.inyectar(Controlador());', metodos:[{nombre_vox:"Obx(callback)",nombre_flutter:"Obx(() => widget)",descripcion:"Widget reactivo de GetX"}] },
  { id:"vox-estado-mobx", nombre_vox:"vox:estado-mobx", nombre_flutter:"mobx", url_pub:"pub.dev/packages/mobx", descripcion_corta:"Reactividad automatica transparente", descripcion_larga:"Implementacion de MobX para Dart. Estado mutable que actualiza la UI automaticamente mediante observaciones.", categoria:"Estado", version:"2.3.4", licencia:"MIT", ultima_actualizacion:"2024-06-10", descargas_mes:35000, estrellas:2800, autor:"mobxjs", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:estado-mobx", ejemplo_codigo:'importar "vox:estado-mobx";\n\ndiseno {\n  Observador(() => Texto("Contador: {tienda.valor}"))\n}', metodos:[{nombre_vox:"Observador()",nombre_flutter:"Observer()",descripcion:"Observa cambios automaticos"}] },
  { id:"vox-grafica-lineas", nombre_vox:"vox:grafica-lineas", nombre_flutter:"fl_chart", url_pub:"pub.dev/packages/fl_chart", descripcion_corta:"Graficas de lineas y barras animadas", descripcion_larga:"La biblioteca de graficas mas popular. Ofrece animaciones fluidas y alta personalizacion tactil.", categoria:"Graficas", version:"0.69.0", licencia:"MIT", ultima_actualizacion:"2024-09-30", descargas_mes:72000, estrellas:6800, autor:"imaNNeo", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:grafica-lineas", ejemplo_codigo:'importar "vox:grafica-lineas";\n\ndiseno {\n  GraficaLineas(datos: misPuntos, animar: verdadero)\n}', metodos:[{nombre_vox:"GraficaLineas(datos)",nombre_flutter:"LineChart()",descripcion:"Renderiza grafica de lineas"}] },
  { id:"vox-grafica-syncfusion", nombre_vox:"vox:grafica-syncfusion", nombre_flutter:"syncfusion_flutter_charts", url_pub:"pub.dev/packages/syncfusion_flutter_charts", descripcion_corta:"Graficas empresariales avanzadas", descripcion_larga:"Suite profesional de graficas con mas de 30 tipos: financieras, sparkline y mas para uso corporativo.", categoria:"Graficas", version:"27.1.51", licencia:"MIT", ultima_actualizacion:"2024-10-01", descargas_mes:28000, estrellas:2200, autor:"syncfusion", plataformas:["Android","iOS","Web","Windows"], instalacion:"vox instalar vox:grafica-syncfusion", ejemplo_codigo:'importar "vox:grafica-syncfusion";\n\ndiseno {\n  GraficaBarrasSf(datos: miData, leyenda: verdadero)\n}', metodos:[{nombre_vox:"GraficaBarrasSf(datos)",nombre_flutter:"SfCartesianChart()",descripcion:"Grafica profesional de barras"}] },
  { id:"vox-grafica-torta", nombre_vox:"vox:grafica-torta", nombre_flutter:"pie_chart", url_pub:"pub.dev/packages/pie_chart", descripcion_corta:"Graficas circulares tipo dona", descripcion_larga:"Widget de graficas circulares simple con animaciones, leyenda y soporte para multiples secciones.", categoria:"Graficas", version:"5.4.0", licencia:"MIT", ultima_actualizacion:"2024-01-18", descargas_mes:18000, estrellas:1400, autor:"apgapg", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:grafica-torta", ejemplo_codigo:'importar "vox:grafica-torta";\n\ndiseno {\n  GraficaTorta(mapaDatos: {"Vox": 70, "Dart": 30})\n}', metodos:[{nombre_vox:"GraficaTorta(datos)",nombre_flutter:"PieChart()",descripcion:"Grafica circular animada"}] },
  { id:"vox-grafica-barras", nombre_vox:"vox:grafica-barras", nombre_flutter:"bar_chart", url_pub:"pub.dev/packages/bar_chart", descripcion_corta:"Barras verticales simples", descripcion_larga:"Biblioteca ligera para graficas de barras limpias con animaciones suaves y etiquetas de datos.", categoria:"Graficas", version:"2.0.0", licencia:"MIT", ultima_actualizacion:"2023-12-15", descargas_mes:8900, estrellas:580, autor:"marchdev-tk", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:grafica-barras", ejemplo_codigo:'importar "vox:grafica-barras";\n\ndiseno {\n  Barras(datos: [10, 20, 30], etiquetas: ["Ene", "Feb", "Mar"])\n}', metodos:[{nombre_vox:"Barras(datos)",nombre_flutter:"BarChart()",descripcion:"Grafica de barras simple"}] },
  { id:"vox-grafica-gauge", nombre_vox:"vox:grafica-gauge", nombre_flutter:"gauge_indicator", url_pub:"pub.dev/packages/gauge_indicator", descripcion_corta:"Velocimetros e indicadores radiales", descripcion_larga:"Renderiza medidores circulares tipo velocimetro con aguja animada y rangos de color configurables.", categoria:"Graficas", version:"0.3.0", licencia:"MIT", ultima_actualizacion:"2024-02-28", descargas_mes:6500, estrellas:390, autor:"geamdev", plataformas:["Android","iOS","Web"], instalacion:"vox instalar vox:grafica-gauge", ejemplo_codigo:'importar "vox:grafica-gauge";\n\ndiseno {\n  Gauge(valor: 85, minimo: 0, maximo: 100)\n}', metodos:[{nombre_vox:"Gauge(valor)",nombre_flutter:"AnimatedRadialGauge()",descripcion:"Indicador radial animado"}] },
  { id:"vox-anuncios-admob", nombre_vox:"vox:anuncios-admob", nombre_flutter:"google_mobile_ads", url_pub:"pub.dev/packages/google_mobile_ads", descripcion_corta:"Monetiza con anuncios Google AdMob", descripcion_larga:"Plugin oficial para mostrar banners, intersticiales y videos recompensados de AdMob.", categoria:"Pagos", version:"5.1.0", licencia:"BSD", ultima_actualizacion:"2024-10-15", descargas_mes:65000, estrellas:5200, autor:"flutter-team", plataformas:["Android","iOS"], instalacion:"vox instalar vox:anuncios-admob", ejemplo_codigo:'importar "vox:anuncios-admob";\n\nAdMob.inicializar();\nvariable banner = BannerAd(id: "ca-app-pub-xxx");', metodos:[{nombre_vox:"inicializar()",nombre_flutter:"MobileAds.instance.initialize()",descripcion:"Configura AdMob"}] },
  { id:"vox-notif-push", nombre_vox:"vox:notif-push", nombre_flutter:"push", url_pub:"pub.dev/packages/push", descripcion_corta:"API simple para notificaciones push", descripcion_larga:"Abstraccion ligera para notificaciones push que unifica FCM y APNs con una API simple.", categoria:"Notificaciones", version:"1.0.1", licencia:"MIT", ultima_actualizacion:"2024-04-01", descargas_mes:7500, estrellas:350, autor:"ben-xD", plataformas:["Android","iOS"], instalacion:"vox instalar vox:notif-push", ejemplo_codigo:'importar "vox:notif-push";\n\nPush.alRecibir(funcion(n) { mostrarAlerta(n.titulo); });', metodos:[{nombre_vox:"alRecibir(callback)",nombre_flutter:"Push.instance.onNotification()",descripcion:"Escucha notificaciones entrantes"}] },
  { id:"vox-estado-signals", nombre_vox:"vox:estado-signals", nombre_flutter:"signals", url_pub:"pub.dev/packages/signals", descripcion_corta:"Estado reactivo tipo Signals", descripcion_larga:"Implementacion de Signals para Flutter. Reactividad granular sin rebuilds innecesarios de la UI.", categoria:"Estado", version:"5.5.0", licencia:"MIT", ultima_actualizacion:"2024-09-12", descargas_mes:22000, estrellas:1900, autor:"rodydavis", plataformas:["Android","iOS","Web","Windows"], instalacion:"vox instalar vox:estado-signals", ejemplo_codigo:'importar "vox:estado-signals";\n\nvariable s = signal(0);', metodos:[{nombre_vox:"Vigilante(callback)",nombre_flutter:"Watch(() => widget)",descripcion:"Widget que vigila senales"}] },
];

// --- EXPORTACION UNIFICADA ---

export const TODAS_LAS_LIBRERIAS = [...LIBRERIAS_CORE, ...LIBRERIAS_TERCEROS];

export const CATEGORIAS = ['Todas', 'Core', 'Audio/Video', 'Estado', 'Graficas', 'Utilidades', 'Pagos', 'Notificaciones'];
