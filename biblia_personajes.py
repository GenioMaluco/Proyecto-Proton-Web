import json
import re
from pathlib import Path
from typing import Dict, List


PERSONAJES_SELECCIONADOS = [
    {
        "nombre": "Francisco Cisco González Dávila",
        "archivo": "francisco_cisco_gonzalez_davila",
        "categoria": "Personaje principal",
        "descripcion": {
            "nombre_completo": "Francisco González Dávila",
            "alias": "Cisco, Ojos de Océano, Ojos de Abismo, Niño del Futuro",
            "edad": "10 años al inicio; mentalmente madura más rápido",
            "apariencia": "Cabello rubio claro, piel pálida, ojos azules profundos, lunar en la mejilla izquierda, delgado y menudo",
            "personalidad": "Curioso, analítico, brillante, terco, valiente y emocionalmente sensible",
            "trasfondo": "Gemelo de Gil, hijo de Shilea, adoptado por Don Paco tras el nacimiento; creció en Curridabat y construyó a Droid",
            "motivacion": "Cumplir la misión de Don Paco, reunir las ocho gemas y descubrir la verdad sobre su origen",
            "habilidades": "Inteligencia excepcional, ingeniería, lógica, liderazgo y capacidad para canalizar la Gema Blanca",
            "arco": "Pasa de niño inseguro a líder decidido que acepta su papel en la historia",
            "relaciones": "Don Paco, Nawa, Gil, Droid, Loky, Curré, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Inteligente", "Analítico", "Curioso", "Valiente", "Empático"],
            "estadisticas": {"fuerza": 4, "inteligencia": 10, "agilidad": 5, "resistencia": 4, "espiritu": 7},
            "puntos_salud": 90,
            "habilidades_especiales": ["Ingeniería", "Análisis rápido", "Liderazgo", "Canalización de gemas"],
            "poderes": ["Gema Blanca de la Transformación"],
            "funciones": ["Protagonista", "Héroe elegido", "Científico", "Líder"],
            "color": "Azul"
        },
        "notas": ["Representa la curiosidad y la transformación"],
    },
    {
        "nombre": "Boenawa Shilea",
        "archivo": "boenawa_shilea",
        "categoria": "Personaje principal",
        "descripcion": {
            "nombre_completo": "Boenawa Shilea",
            "alias": "Nawa, Ditsowe, La Jaguar, Guardiana del Valle",
            "edad": "Aproximadamente 12-13 años",
            "apariencia": "Piel morena, cabello negro, ojos negros brillantes, contextura ágil y musculosa",
            "personalidad": "Feroz, valiente, intuitiva, protectora y leal",
            "trasfondo": "Criada por Don Paco, entrenada para ser una Jawa y protegida por la conexión con la naturaleza",
            "motivacion": "Proteger a su pueblo, a sus hermanos y cumplir la profecía",
            "habilidades": "Combate con cuchillo de obsidiana, supervivencia en la selva, uso de plantas medicinales y vínculo con Loky",
            "arco": "Pasa de guerrera solitaria a líder espiritual y protectora",
            "relaciones": "Cisco, Gil, Don Paco, Loky, Curré, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Valiente", "Protectora", "Intuitiva", "Pragmática", "Resiliente"],
            "estadisticas": {"fuerza": 8, "inteligencia": 7, "agilidad": 9, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 95,
            "habilidades_especiales": ["Combate cuerpo a cuerpo", "Supervivencia", "Herboristería", "Comunicación con animales"],
            "poderes": ["Gema Verde de Sanación", "Gema Índigo de Espíritu"],
            "funciones": ["Guerrera", "Protectora", "Guía espiritual"],
            "color": "Verde"
        },
        "notas": ["Representa la protección, la fuerza y la sanación"],
    },
    {
        "nombre": "Gilberto Gil González Dávila",
        "archivo": "gilberto_gil_gonzalez_davila",
        "categoria": "Personaje principal",
        "descripcion": {
            "nombre_completo": "Gilberto González Dávila",
            "alias": "Gil, Ojos de Ámbar, Hijo de los Españoles",
            "edad": "Aproximadamente 14 años",
            "apariencia": "Cabello oscuro, piel acaramelada, ojos amarillos brillantes, complexión atlética",
            "personalidad": "Seguro de sí mismo, carismático, leal y atormentado por su identidad",
            "trasfondo": "Gemelo de Cisco, criado por una pareja española y luego confrontado con su origen indígena",
            "motivacion": "Encontrar su verdadera identidad y redimirse de su vínculo con la expedición española",
            "habilidades": "Espadachín, estratega militar, líder nato, conocimiento de navegación",
            "arco": "De conquistador confundido a defensor de los pueblos indígenas",
            "relaciones": "Cisco, Nawa, Don Paco, Curré, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Carismático", "Estratega", "Leal", "Valiente", "Confundido pero noble"],
            "estadisticas": {"fuerza": 8, "inteligencia": 7, "agilidad": 7, "resistencia": 7, "espiritu": 6},
            "puntos_salud": 92,
            "habilidades_especiales": ["Espadachín", "Táctica militar", "Navegación"],
            "poderes": ["Gema Morada de Creación"],
            "funciones": ["Guerrero", "Líder", "Puente cultural"],
            "color": "Violeta"
        },
        "notas": ["Representa la identidad dual y la reconciliación"],
    },
    {
        "nombre": "Don Paco",
        "archivo": "don_paco",
        "categoria": "Personaje principal",
        "descripcion": {
            "nombre_completo": "Francisco Paco",
            "alias": "Don Paco, Jawa Paco, El Guardián del Tiempo",
            "edad": "Aparenta 70 años, pero su edad real es incierta",
            "apariencia": "Hombre mayor, espalda algo encorvada, ojos negros profundos, bata de laboratorio o ropa sencilla",
            "personalidad": "Sabio, paciente, enigmático, bondadoso y con humor socarrón",
            "trasfondo": "Guardia del equilibrio temporal, mentor de los hermanos y guía en distintas épocas",
            "motivacion": "Proteger el flujo del tiempo y preparar a los jóvenes para su misión",
            "habilidades": "Dominio de la física del tiempo, hipnosis, manipulación temporal y estrategia",
            "arco": "Mentor que aprende a ceder el relevo a sus pupilos",
            "relaciones": "Cisco, Nawa, Gil, Shilea, Pipo/Ramsés, Doctor Miranda",
        },
        "atributos": {
            "caracteristicas": ["Sabio", "Paciente", "Enigmático", "Misterioso", "Mentor"],
            "estadisticas": {"fuerza": 3, "inteligencia": 10, "agilidad": 3, "resistencia": 4, "espiritu": 9},
            "puntos_salud": 85,
            "habilidades_especiales": ["Manipulación temporal", "Hipnosis", "Estrategia", "Conocimiento ancestral"],
            "poderes": ["Control del tiempo"],
            "funciones": ["Mentor", "Guardián", "Diseñador del destino"],
            "color": "Índigo"
        },
        "notas": ["Representa la sabiduría y el equilibrio del tiempo"],
    },
    {
        "nombre": "Rey Curré",
        "archivo": "rey_curre",
        "categoria": "Personaje secundario importante",
        "descripcion": {
            "nombre_completo": "Curré",
            "alias": "Rey Curré, Señor del Valle, El Rey Humilde",
            "edad": "Adulto maduro",
            "apariencia": "Hombre imponente, piel cobriza, cabello negro largo con canas, tocado de plumas",
            "personalidad": "Orgulloso al inicio, luego humilde, sabio y visionario",
            "trasfondo": "Rey de los Diquís, aliado clave de los hermanos y guía del pueblo",
            "motivacion": "Proteger a su pueblo y asegurar su supervivencia",
            "habilidades": "Liderazgo, estrategia, conocimiento histórico y espiritual",
            "arco": "De rey arrogante a líder sabio y humilde",
            "relaciones": "Cisco, Nawa, Gil, Tamanco, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Líder", "Sabio", "Justo", "Humilde", "Visionario"],
            "estadisticas": {"fuerza": 7, "inteligencia": 8, "agilidad": 5, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 88,
            "habilidades_especiales": ["Liderazgo", "Estrategia", "Visión del futuro"],
            "poderes": ["Gema Naranja de Sabiduría"],
            "funciones": ["Rey", "Aliado", "Guía"],
            "color": "Naranja"
        },
        "notas": ["Representa el liderazgo sabio y la unión de pueblos"],
    },
    {
        "nombre": "Droid",
        "archivo": "droid",
        "categoria": "Personaje secundario importante",
        "descripcion": {
            "nombre_completo": "Droid",
            "alias": "El Robot, La Mochila, El Sistema",
            "edad": "Construido dos años antes del viaje",
            "apariencia": "Robot humanoide, casco de soldador, ojo rojo, capacidad de transformarse",
            "personalidad": "Leal, práctico, lógico y con un toque de humor",
            "trasfondo": "Construido por Cisco para acompañarlo y ayudarlo en la misión",
            "motivacion": "Proteger a Cisco y ayudar a cumplir la misión",
            "habilidades": "Escaneo multidimensional, traducción, hologramas, armas sónicas y transformaciones",
            "arco": "Evolutiona su conexión emocional con Cisco y su capacidad de adaptación",
            "relaciones": "Cisco, Nawa, Gil, Don Paco",
        },
        "atributos": {
            "caracteristicas": ["Leal", "Práctico", "Lógico", "Adaptable", "Útil"],
            "estadisticas": {"fuerza": 6, "inteligencia": 9, "agilidad": 6, "resistencia": 8, "espiritu": 5},
            "puntos_salud": 100,
            "habilidades_especiales": ["Escaneo", "Traducción", "Transformación", "Soporte táctico"],
            "poderes": ["Hologramas", "Campos de energía"],
            "funciones": ["Asistente", "Inteligencia artificial", "Aliado"],
            "color": "Azul"
        },
        "notas": ["Representa la ciencia, la ayuda tecnológica y la lealtad"],
    },
    {
        "nombre": "Loky",
        "archivo": "loky",
        "categoria": "Personaje secundario importante",
        "descripcion": {
            "nombre_completo": "Loky",
            "alias": "El Jaguar Negro, Espíritu del Valle",
            "edad": "Indeterminada",
            "apariencia": "Jaguar negro grande con manchas doradas y ojos amarillos",
            "personalidad": "Feroz, salvaje al inicio, luego protector y leal",
            "trasfondo": "Criatura espiritual herida por Pipo/Ramsés y sanada por Cisco",
            "motivacion": "Proteger a sus aliados y vengar el daño recibido",
            "habilidades": "Fuerza, velocidad, sigilo y conexión espiritual con la selva",
            "arco": "De criatura herida a guardián protector",
            "relaciones": "Nawa, Cisco, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Feroz", "Protector", "Ágil", "Instintivo", "Leal"],
            "estadisticas": {"fuerza": 9, "inteligencia": 6, "agilidad": 9, "resistencia": 8, "espiritu": 7},
            "puntos_salud": 90,
            "habilidades_especiales": ["Sigilo", "Garras", "Fuerza sobrehumana", "Conexión espiritual"],
            "poderes": ["Conexión con la selva"],
            "funciones": ["Guardián", "Compañero animal", "Protector"],
            "color": "Rojo"
        },
        "notas": ["Representa la fuerza bruta y el vínculo con la naturaleza"],
    },
    {
        "nombre": "Pipo Ramsés",
        "archivo": "pipo_ramses",
        "categoria": "Personaje secundario importante",
        "descripcion": {
            "nombre_completo": "Ramsés II",
            "alias": "Pipo, El Faraón, El Primogénito",
            "edad": "Más de 3000 años",
            "apariencia": "Hombre alto, tez morena, rasgos egipcios, tocado de oro y lapislázuli",
            "personalidad": "Narcisista, arrogante, manipulador y obsesionado con el poder",
            "trasfondo": "Faraón egipcio que viajó en el tiempo y se hizo pasar por un Jawa ancestral",
            "motivacion": "Reunir las ocho gemas para abrir un portal y obtener poder absoluto",
            "habilidades": "Control del tiempo, magia ancestral, manipulación mental y premonición limitada",
            "arco": "Antagonista trágico que termina atrapado en su propio bucle",
            "relaciones": "Cisco, Nawa, Gil, Don Paco, Curré",
        },
        "atributos": {
            "caracteristicas": ["Manipulador", "Ambicioso", "Estratega", "Cruel", "Poderoso"],
            "estadisticas": {"fuerza": 7, "inteligencia": 9, "agilidad": 6, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 80,
            "habilidades_especiales": ["Control temporal", "Magia ancestral", "Manipulación mental"],
            "poderes": ["Gema Roja de Valor", "Gema Amarilla de Voluntad"],
            "funciones": ["Antagonista", "Manipulador", "Rival del tiempo"],
            "color": "Amarillo"
        },
        "notas": ["Representa la ambición, el orgullo y la corrupción del poder"],
    },
    {
        "nombre": "Shilea",
        "archivo": "shilea",
        "categoria": "Personaje secundario importante",
        "descripcion": {
            "nombre_completo": "Ditsowe Shilea",
            "alias": "Shilea, La Madre Viajera",
            "edad": "Fallece joven en 1990",
            "apariencia": "Mujer indígena de piel morena, cabello negro, ojos oscuros, aretes de jade morado",
            "personalidad": "Valiente, amorosa y sacrificada",
            "trasfondo": "Originaria de una tribu cabécar, viajó al futuro para salvar a sus hijos y a su pueblo",
            "motivacion": "Salvar a sus hijos y a su comunidad",
            "habilidades": "Conocimiento de plantas medicinales, valor y conexión con las gemas",
            "arco": "Su presencia emocional guía a los hermanos desde la distancia",
            "relaciones": "Cisco, Nawa, Gil, Don Paco, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Amorosa", "Sacrificial", "Valiente", "Mística", "Protectora"],
            "estadisticas": {"fuerza": 5, "inteligencia": 7, "agilidad": 5, "resistencia": 5, "espiritu": 8},
            "puntos_salud": 70,
            "habilidades_especiales": ["Herboristería", "Conexión con gemas"],
            "poderes": ["Gema Morada", "Gema Índigo"],
            "funciones": ["Madre", "Guía espiritual", "Fuente emocional"],
            "color": "Violeta"
        },
        "notas": ["Es el vínculo emocional que une a los hermanos"],
    },
    {
        "nombre": "Tamanco",
        "archivo": "tamanco",
        "categoria": "Personaje secundario importante",
        "descripcion": {
            "nombre_completo": "Tamanco",
            "alias": "El Guerrero Leal",
            "edad": "Adulto, aproximadamente 30 años",
            "apariencia": "Hombre fornido, piel oscura, pinturas de guerra, adornos de plumas y conchas",
            "personalidad": "Valiente, leal, respetuoso y curioso",
            "trasfondo": "Guerrero Boruca que guia a Cisco en el Templo del Norte",
            "motivacion": "Proteger a su pueblo y ayudar a Cisco en su misión",
            "habilidades": "Combate cuerpo a cuerpo, conocimiento de la montaña y la selva",
            "arco": "Su lealtad es clave para la batalla final",
            "relaciones": "Cisco, Curré, Nawa, Gil",
        },
        "atributos": {
            "caracteristicas": ["Leal", "Fuerte", "Valiente", "Respetuoso", "Práctico"],
            "estadisticas": {"fuerza": 8, "inteligencia": 5, "agilidad": 6, "resistencia": 8, "espiritu": 6},
            "puntos_salud": 88,
            "habilidades_especiales": ["Combate", "Guía de montaña"],
            "poderes": [],
            "funciones": ["Guerrero", "Guía"],
            "color": "Verde"
        },
        "notas": ["Representa la fuerza y la lealtad entre pueblos"],
    },
    {
        "nombre": "Doctor Miranda",
        "archivo": "doctor_miranda",
        "categoria": "Personaje secundario",
        "descripcion": {
            "nombre_completo": "Doctor Miranda",
            "alias": "El Doctor, El Hombre de Ciencia",
            "edad": "65 años",
            "apariencia": "Hombre mayor, bata blanca, gafas y expresión seria",
            "personalidad": "Escéptico, racional y luego convencido por lo inexplicable",
            "trasfondo": "Médico de guardia en el nacimiento de los gemelos y cómplice de Don Paco",
            "motivacion": "Actuar según su conciencia aunque eso rompa reglas",
            "habilidades": "Medicina y cirugía",
            "arco": "De escéptico a creyente del destino",
            "relaciones": "Don Paco, los gemelos, la obstetra Rodríguez",
        },
        "atributos": {
            "caracteristicas": ["Racional", "Profesional", "Honesto", "Consciente"],
            "estadisticas": {"fuerza": 2, "inteligencia": 8, "agilidad": 2, "resistencia": 4, "espiritu": 6},
            "puntos_salud": 78,
            "habilidades_especiales": ["Medicina", "Cirugía"],
            "poderes": [],
            "funciones": ["Médico", "Cómplice"],
            "color": "Amarillo"
        },
        "notas": ["Personaje clave para la trama del nacimiento"],
    },
    {
        "nombre": "Obstetra Rodríguez",
        "archivo": "obstetra_rodriguez",
        "categoria": "Personaje secundario",
        "descripcion": {
            "nombre_completo": "Rodríguez",
            "alias": "La Obstetra, La Enfermera",
            "edad": "Adulta",
            "apariencia": "Uniforme de enfermera, expresión seria y profesional",
            "personalidad": "Práctica, discreta y leal a sus intereses",
            "trasfondo": "Presente en el parto de los gemelos y testigo del trato con los González Dávila",
            "motivacion": "Mantenerse al margen y obtener un beneficio económico",
            "habilidades": "Asistencia médica y discreción",
            "arco": "Su silencio permite que la historia avance",
            "relaciones": "Doctor Miranda, Don Paco, los gemelos",
        },
        "atributos": {
            "caracteristicas": ["Discreta", "Profesional", "Práctica", "Leal a su interés"],
            "estadisticas": {"fuerza": 1, "inteligencia": 6, "agilidad": 2, "resistencia": 3, "espiritu": 4},
            "puntos_salud": 76,
            "habilidades_especiales": ["Asistencia médica"],
            "poderes": [],
            "funciones": ["Enfermera", "Testigo"],
            "color": "Azul"
        },
        "notas": ["Es una pieza menor que facilita el desarrollo del conflicto"],
    },
    {
        "nombre": "Cristóbal Colón",
        "archivo": "cristobal_colon",
        "categoria": "Personaje secundario",
        "descripcion": {
            "nombre_completo": "Cristóbal Colón",
            "alias": "El Almirante, El Padre Adoptivo de Gil",
            "edad": "Adulto",
            "apariencia": "Hombre europeo con barba, ropas de navegante y catalejo",
            "personalidad": "Ambicioso, crédulo y algo pomposo",
            "trasfondo": "Navegante genovés manipulado por Don Paco para que creyera ser Colón y zarpara a América",
            "motivacion": "Cumplir su misión divina de encontrar nuevas rutas y riquezas",
            "habilidades": "Navegación, liderazgo de tripulación",
            "arco": "Es una pieza en el tablero de Don Paco",
            "relaciones": "Gil, Don Paco, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Ambicioso", "Autoritario", "Navegante", "Crédulo"],
            "estadisticas": {"fuerza": 5, "inteligencia": 6, "agilidad": 4, "resistencia": 5, "espiritu": 4},
            "puntos_salud": 74,
            "habilidades_especiales": ["Navegación"],
            "poderes": [],
            "funciones": ["Explorador", "Capitán"],
            "color": "Amarillo"
        },
        "notas": ["Sirve como herramienta de la manipulación temporal"],
    },
    {
        "nombre": "Chamanes de las cuatro tribus",
        "archivo": "chamanes_de_las_cuatro_tribus",
        "categoria": "Grupo secundario",
        "descripcion": {
            "nombre_completo": "Chamanes de las tribus Diquís, Cabécares, Bribris y Borucas",
            "alias": "Chamanes, Ancianos Sabios",
            "edad": "Ancianos",
            "apariencia": "Pinturas faciales, tocados de plumas, ropas ceremoniales y collares de jade",
            "personalidad": "Sabios, reservados y respetuosos de la tradición",
            "trasfondo": "Guardianes del conocimiento ancestral y participantes en la profecía",
            "motivacion": "Preservar la cultura y la vida de su pueblo",
            "habilidades": "Hierbas, rituales, astronomía y lenguaje sagrado",
            "arco": "Facilitan el camino de las tribus hacia la supervivencia",
            "relaciones": "Curré, Cisco, Nawa, Gil",
        },
        "atributos": {
            "caracteristicas": ["Sabios", "Tradicionales", "Reservados", "Espirituales"],
            "estadisticas": {"fuerza": 3, "inteligencia": 8, "agilidad": 2, "resistencia": 4, "espiritu": 9},
            "puntos_salud": 80,
            "habilidades_especiales": ["Rituales", "Astronomía", "Herboristería"],
            "poderes": ["Sabiduría ancestral"],
            "funciones": ["Guía espiritual", "Guardia cultural"],
            "color": "Verde"
        },
        "notas": ["Grupo espiritual clave para la historia"],
    },
    {
        "nombre": "Tribu Diquís",
        "archivo": "tribu_diquis",
        "categoria": "Grupo secundario",
        "descripcion": {
            "nombre_completo": "Pueblo Diquís",
            "alias": "Los Diquís, Pueblo de las Esferas",
            "edad": "Colectivo de todas las edades",
            "apariencia": "Piel morena, cabello negro, vestidos con taparrabos y adornos de oro y jade",
            "personalidad": "Valientes, hospitalarios y desconfiados de los extraños",
            "trasfondo": "Descendientes de los constructores de esferas y aliados de los hermanos",
            "motivacion": "Sobrevivir y preservar su cultura",
            "habilidades": "Agricultura, tallado de piedra, guerra y astronomía",
            "arco": "Pasan de víctimas del destino a constructores de su propia salvación",
            "relaciones": "Curré, Cisco, Nawa, Gil",
        },
        "atributos": {
            "caracteristicas": ["Hospitalarios", "Valientes", "Conectados con la naturaleza", "Resilientes"],
            "estadisticas": {"fuerza": 7, "inteligencia": 7, "agilidad": 5, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 85,
            "habilidades_especiales": ["Taller de piedra", "Astronomía", "Guerra"],
            "poderes": [],
            "funciones": ["Pueblo aliado", "Población principal"],
            "color": "Naranja"
        },
        "notas": ["Grupo cultural fundamental de la historia"],
    },
    {
        "nombre": "Españoles y marineros de la expedición",
        "archivo": "espanoles_y_marineros_de_la_expedicion",
        "categoria": "Grupo secundario",
        "descripcion": {
            "nombre_completo": "Conquistadores y marineros españoles",
            "alias": "Conquistadores, Hombres de Metal",
            "edad": "Adultos",
            "apariencia": "Barbudos, armaduras de metal, espadas y arcabuces",
            "personalidad": "Ambiciosos, temerosos y obedientes",
            "trasfondo": "Forman parte de la expedición de 1499 y se enfrentan a los hermanos",
            "motivacion": "Buscar riquezas y gloria",
            "habilidades": "Combate con espada, uso de arcabuces y navegación",
            "arco": "Son un obstáculo que los hermanos deben superar",
            "relaciones": "Gil, Colón, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Ambiciosos", "Organizados", "Militares", "Temerosos"],
            "estadisticas": {"fuerza": 6, "inteligencia": 5, "agilidad": 4, "resistencia": 6, "espiritu": 3},
            "puntos_salud": 75,
            "habilidades_especiales": ["Combate armado", "Navegación"],
            "poderes": [],
            "funciones": ["Enemigos", "Expedición"],
            "color": "Rojo"
        },
        "notas": ["Grupo antagonista de la expedición"],
    },
    {
        "nombre": "La Banshee",
        "archivo": "la_banshee",
        "categoria": "Entidad secundaria",
        "descripcion": {
            "nombre_completo": "La Banshee",
            "alias": "El Alma en Pena, El Eco de los Caídos",
            "edad": "Eterna",
            "apariencia": "Forma espectral, traslúcida, ojos vacíos y boca de grito",
            "personalidad": "Dolorosa, vengativa y llena de rabia acumulada",
            "trasfondo": "Manifestación del dolor de los guerreros caídos en el templo del sur",
            "motivacion": "Evitar que alguien más tome la Gema Verde",
            "habilidades": "Alarido psíquico, control de sombras, posesión",
            "arco": "Es derrotada cuando Nawa y Loky unen fuerzas",
            "relaciones": "Nawa, Loky",
        },
        "atributos": {
            "caracteristicas": ["Espectral", "Vengativa", "Dolorosa", "Poderosa"],
            "estadisticas": {"fuerza": 5, "inteligencia": 7, "agilidad": 6, "resistencia": 6, "espiritu": 9},
            "puntos_salud": 70,
            "habilidades_especiales": ["Control de sombras", "Alarido psíquico"],
            "poderes": ["Posesión", "Manipulación emocional"],
            "funciones": ["Antagonista espiritual"],
            "color": "Negro"
        },
        "notas": ["Representa el dolor no resuelto"],
    },
    {
        "nombre": "Guardían del Templo del Norte",
        "archivo": "guardian_del_templo_del_norte",
        "categoria": "Entidad secundaria",
        "descripcion": {
            "nombre_completo": "Guardían del Templo del Norte",
            "alias": "El Gólem, La Montaña Viviente",
            "edad": "Antigua",
            "apariencia": "Gólem de granito de tres metros, gema blanca incrustada en el pecho",
            "personalidad": "Impasible y justo",
            "trasfondo": "Criado para proteger la Gema Blanca de la Transformación",
            "motivacion": "Proteger la gema hasta que llegue el elegido",
            "habilidades": "Fuerza sobrehumana, resistencia, control de vapor y temperatura",
            "arco": "Es derrotado por Cisco y Tamanco",
            "relaciones": "Cisco, Tamanco",
        },
        "atributos": {
            "caracteristicas": ["Inamovible", "Resistente", "Justo", "Elemental"],
            "estadisticas": {"fuerza": 9, "inteligencia": 4, "agilidad": 2, "resistencia": 10, "espiritu": 5},
            "puntos_salud": 95,
            "habilidades_especiales": ["Control de vapor", "Resistencia"],
            "poderes": ["Gema Blanca"],
            "funciones": ["Guardia elemental"],
            "color": "Blanco"
        },
        "notas": ["Representa la prueba de valor y la transformación"],
    },
]


class BibliaPersonajes:
    def __init__(self, carpeta_destino: str | Path = "biblia_personajes"):
        self.carpeta_destino = Path(carpeta_destino)

    def limpiar_carpeta(self) -> None:
        self.carpeta_destino.mkdir(parents=True, exist_ok=True)
        for archivo in self.carpeta_destino.glob("*.json"):
            if archivo.name != "indice.json":
                archivo.unlink()

    def generar(self) -> List[Dict]:
        self.limpiar_carpeta()
        personajes_creados: List[Dict] = []
        for item in PERSONAJES_SELECCIONADOS:
            archivo = self.carpeta_destino / f"{item['archivo']}.json"
            with open(archivo, "w", encoding="utf-8") as handle:
                json.dump({
                    "nombre": item["nombre"],
                    "categoria": item["categoria"],
                    "descripcion": item["descripcion"],
                    "atributos": item["atributos"],
                    "notas": item["notas"],
                }, handle, ensure_ascii=False, indent=2)
            personajes_creados.append({"nombre": item["nombre"], "archivo": archivo.name})

        indice = {
            "libro": "Proyecto Proton",
            "cantidad": len(personajes_creados),
            "personajes": personajes_creados,
        }
        with open(self.carpeta_destino / "indice.json", "w", encoding="utf-8") as handle:
            json.dump(indice, handle, ensure_ascii=False, indent=2)

        return personajes_creados


if __name__ == "__main__":
    biblia = BibliaPersonajes("biblia_personajes")
    personajes = biblia.generar()
    print(f"Se generaron {len(personajes)} archivos JSON para la biblia de personajes.")
    print("Carpeta creada:", biblia.carpeta_destino)
