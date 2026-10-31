import json
from pathlib import Path
from typing import Dict, List


GEMAS_CANON = [
    {
        "id": "gema_azul",
        "nombre": "Gema Azul del Tiempo / Verdad",
        "color": "Azul Celeste",
        "hex": "#38bdf8",
        "valor": "La Verdad y el Portal del Tiempo",
        "templo": "Heredada a través del Bucle Temporal (Curridabat 1990 / Cascada del Valle Diquís 1499)",
        "portador": "Francisco 'Cisco' González Dávila / Don Paco",
        "guardian": "Droid / Nawa (Custodia en la Cascada)",
        "capitulo_aparicion": 1,
        "capitulo_obtencion": 9,
        "descripcion": "Cubo simétrico perfecto que abre caminos entre épocas al interactuar con el láser de escaneo de Droid.",
    },
    {
        "id": "gema_roja",
        "nombre": "Gema Roja del Valor",
        "color": "Rojo Carmesí",
        "hex": "#ef4444",
        "valor": "El Valor y la Supervivencia",
        "templo": "Oculta en el lomo de Loky (Aldea Diquís)",
        "portador": "Cisco (Cap. 4) -> Robada por Pipo/Ramsés (Cap. 5) -> Recuperada (Cap. 8)",
        "guardian": "Loky (El Espíritu del Jaguar)",
        "capitulo_aparicion": 4,
        "capitulo_obtencion": 4,
        "descripcion": "Contiene fuego líquido en su interior; responde a quien enfrenta el miedo para sanar en lugar de destruir.",
    },
    {
        "id": "gema_amarilla",
        "nombre": "Gema Amarilla de la Voluntad",
        "color": "Amarillo Ámbar",
        "hex": "#eab308",
        "valor": "La Voluntad y el Discernimiento",
        "templo": "Traída por la Expedición de Gil y Colón (Playa Sur)",
        "portador": "Gil / Cristóbal Colón -> Entregada a Pipo/Ramsés -> Recuperada (Cap. 8)",
        "guardian": "Expedición Temporal",
        "capitulo_aparicion": 6,
        "capitulo_obtencion": 8,
        "descripcion": "Transportó a Gil y a su padre adoptivo a 1499; manipulada por Ramsés para sostener el bucle infinito.",
    },
    {
        "id": "gema_blanca",
        "nombre": "Gema Blanca de la Transformación",
        "color": "Blanco Irisado",
        "hex": "#f8fafc",
        "valor": "La Transformación y Adaptación",
        "templo": "Templo del Norte (Cordillera Volcánica Central)",
        "portador": "Francisco 'Cisco' González Dávila",
        "guardian": "Guardián del Templo del Norte (Gólem de Granito)",
        "capitulo_aparicion": 6,
        "capitulo_obtencion": 7,
        "descripcion": "Contiene un millón de arcoíris diminutos; exige soltar los temores y combinar ciencia con alianza humana.",
    },
    {
        "id": "gema_verde",
        "nombre": "Gema Verde de la Sanación",
        "color": "Verde Esmeralda",
        "hex": "#10b981",
        "valor": "La Sanación y el Poder de Amar",
        "templo": "Templo del Sur (Gran Ceibo de la Península de Osa)",
        "portador": "Boenawa 'Nawa' Shilea",
        "guardian": "La Banshee (Eco de los Caídos)",
        "capitulo_aparicion": 6,
        "capitulo_obtencion": 7,
        "descripcion": "No se toma con la mano sino con el corazón, enfrentando el dolor heredado en unión espiritual con la naturaleza.",
    },
    {
        "id": "gema_naranja",
        "nombre": "Gema Naranja de la Sabiduría",
        "color": "Naranja Dorado",
        "hex": "#f97316",
        "valor": "La Sabiduría y la Humildad",
        "templo": "Templo del Este (Cordillera de Talamanca)",
        "portador": "Rey Curré",
        "guardian": "Chamanes Cabécares y la Esfera de Agua Salada",
        "capitulo_aparicion": 6,
        "capitulo_obtencion": 7,
        "descripcion": "Se entrega únicamente a quien reconoce que no lo sabe todo y pide perdón para unir a los pueblos.",
    },
    {
        "id": "gema_morada",
        "nombre": "Gema Morada de la Creación",
        "color": "Violeta Amatista",
        "hex": "#a855f7",
        "valor": "La Creación y el Vínculo Familiar",
        "templo": "Templo del Oeste (Isla Sagrada de Nicoya)",
        "portador": "Gilberto 'Gil' González Dávila (y anteriormente Shilea)",
        "guardian": "Memoria de Ditsowe Shilea",
        "capitulo_aparicion": 6,
        "capitulo_obtencion": 7,
        "descripcion": "Permitió a Shilea viajar a 1990 para salvar a sus hijos y guarda el mensaje que revela la hermandad de los tres jóvenes.",
    },
    {
        "id": "gema_indigo",
        "nombre": "Gema Índigo del Espíritu",
        "color": "Índigo Profundo",
        "hex": "#6366f1",
        "valor": "El Espíritu y la Conexión Cósmica",
        "templo": "Dividida en los dos aretes de jade morado de Shilea",
        "portador": "Boenawa 'Nawa' Shilea (junto a Loky)",
        "guardian": "Linaje de Shilea",
        "capitulo_aparicion": 2,
        "capitulo_obtencion": 7,
        "descripcion": "Estuvo oculta a plena vista en los aretes de Nawa; al unirse sus dos mitades en la Playa del Encuentro despierta el séptimo pulso.",
    },
]


PERSONAJES_SELECCIONADOS = [
    {
        "id": "cisco",
        "nombre": "Francisco Cisco González Dávila",
        "archivo": "francisco_cisco_gonzalez_davila",
        "categoria": "Personaje principal",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "descripcion": {
            "nombre_completo": "Francisco González Dávila",
            "alias": "Cisco, Ojos de Océano, Ojos de Abismo, Niño del Futuro",
            "edad": "Recién nacido en Cap. 0 (1990); 10 años en Cap. 1-9; 53 años en el Epílogo (2033)",
            "apariencia": "Cabello rubio claro casi blanco, piel pálida, ojos azules profundos como el océano, lunar en la mejilla izquierda, bata de laboratorio",
            "personalidad": "Curioso, analítico, brillante, terco, valiente y emocionalmente sensible",
            "trasfondo": "Gemelo de Gil y hermano de Nawa, hijo de Shilea, adoptado por Don Paco tras nacer en San José el 13 de diciembre de 1990; creció en Curridabat y construyó a Droid",
            "motivacion": "Cumplir la misión de Don Paco, reunir las ocho gemas arcoíris, salvar a los pueblos indígenas y descubrir la verdad sobre su familia",
            "habilidades": "Inteligencia excepcional, ingeniería robótica, pensamiento cuántico/lógico, liderazgo táctico y canalización de la Gema Blanca y Azul",
            "arco": "Pasa de niño inseguro que teme que nadie asista a su fiesta de cumpleaños a estratega cuántico y líder que rompe el bucle de Ramsés",
            "relaciones": "Don Paco, Nawa, Gil, Droid, Loky, Curré, Tamanco, Pipo/Ramsés, Shilea",
        },
        "atributos": {
            "caracteristicas": ["Inteligente", "Analítico", "Curioso", "Valiente", "Empático"],
            "estadisticas": {"fuerza": 4, "inteligencia": 10, "agilidad": 5, "resistencia": 4, "espiritu": 7},
            "puntos_salud": 90,
            "habilidades_especiales": ["Ingeniería", "Análisis rápido", "Liderazgo", "Canalización de gemas", "Protocolo Paradox"],
            "poderes": ["Gema Blanca de la Transformación", "Gema Azul del Tiempo"],
            "funciones": ["Protagonista", "Héroe elegido", "Científico", "Líder"],
            "color": "Azul",
            "hex": "#38bdf8",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 0,
                "rol_visible": "Recién nacido en el Hospital de San José",
                "faccion_visible": "San José 1990",
                "bio": "Uno de los dos bebés gemelos nacidos la noche del 13 de diciembre de 1990. Sus ojos azules profundos llaman la atención de Don Paco, quien lo adopta para protegerlo de los albergues.",
            },
            {
                "hasta_capitulo": 3,
                "rol_visible": "Niño inventor y viajero accidental del tiempo",
                "faccion_visible": "Aprendices Jawa",
                "bio": "A tres días de cumplir 10 años en Curridabat, escanea su regalo de cumpleaños junto a su robot Droid y es transportado a octubre de 1499 en el Valle del Diquís, donde conoce a Nawa y al Jawa Pipo.",
            },
            {
                "hasta_capitulo": 6,
                "rol_visible": "Jawa del Futuro y Portador del Valor",
                "faccion_visible": "Alianza Diquís / Jawas",
                "bio": "Tras sanar al jaguar Loky extrayendo la Gema Roja y descubrir la traición de Pipo, lidera la decodificación de los manuscritos hacia los Cuatro Templos y se reencuentra con su hermano gemelo Gil.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Maestro de la Gema Blanca y Arquitecto del Protocolo Paradox",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Vence al Guardián del Templo del Norte junto a Tamanco, descubre que Gil y Nawa son sus hermanos hijos de Shilea, derrota el bucle infinito de Ramsés II y lidera el éxodo estelar hasta el retorno de las Esferas Madre en 2033.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Protagonista central; despierta su vocación científica y espiritual en 1499 y regresa a su décimo cumpleaños en 1990.",
            "libro_2": "Desarrollo de su centro tecnológico en Curridabat entre 1990 y 2033, rastreando anomalías temporales y preparando la red de recepción.",
            "libro_3": "Reencuentro definitivo en octubre de 2033 durante la llegada de las 8 Esferas Madre sobre el Valle Central y el Delta del Diquís.",
        },
        "notas": ["Representa la curiosidad, la verdad científica y la transformación."],
    },
    {
        "id": "nawa",
        "nombre": "Boenawa Shilea",
        "archivo": "boenawa_shilea",
        "categoria": "Personaje principal",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 2,
        "capitulos_presente": [2, 3, 4, 5, 6, 7, 8, 9, 10],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Boenawa Shilea",
            "alias": "Nawa, Ditsowe, La Jaguar, La Séptima, Guardiana del Valle",
            "edad": "Aproximadamente 12-13 años en 1499",
            "apariencia": "Piel morena, cabello negro rebelde, ojos negros brillantes, máscara de zorro, aretes de jade morado y bata de laboratorio de Cisco",
            "personalidad": "Feroz, valiente, intuitiva, protectora y profundamente leal",
            "trasfondo": "Hija mayor de Shilea y hermana de Cisco y Gil; enviada de bebé a la aldea Diquís para salvarla de la fiebre manchada y criada por el Jawa Paco",
            "motivacion": "Proteger a su pueblo, cuidar de sus hermanos y cumplir las instrucciones de la carta de Jawa Paco",
            "habilidades": "Combate con cuchillo de obsidiana, tejido táctico, supervivencia en la selva, herboristería medicinal y vínculo simbiótico con Loky",
            "arco": "De guardiana solitaria con miedo a su origen a portadora de las Gemas Verde e Índigo que lidera el viaje hacia Alfa Centauri",
            "relaciones": "Cisco, Gil, Don Paco, Loky, Curré, Shilea, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Valiente", "Protectora", "Intuitiva", "Pragmática", "Resiliente"],
            "estadisticas": {"fuerza": 8, "inteligencia": 7, "agilidad": 9, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 95,
            "habilidades_especiales": ["Combate cuerpo a cuerpo", "Supervivencia", "Herboristería", "Comunicación con animales"],
            "poderes": ["Gema Verde de la Sanación", "Gema Índigo del Espíritu"],
            "funciones": ["Guerrera", "Protectora", "Guía espiritual"],
            "color": "Verde",
            "hex": "#10b981",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 5,
                "rol_visible": "Aprendiz Jawa del Valle de Diquís",
                "faccion_visible": "Alianza Indígena / Jawas",
                "bio": "Joven guerrera criada por el Jawa Paco en 1499. Salva a Cisco de caer por la cascada usando una máscara de zorro, lo guía a la aldea Diquís y cura las heridas del jaguar Loky.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Hermana Mayor, La Séptima y Portadora de la Sanación y el Espíritu",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Derrota a la Banshee en el Templo del Sur montando a Loky, descubre por la carta de Shilea que es hermana de sangre de Cisco y Gil, une sus aretes de jade para despertar la Gema Índigo y lidera la semilla humana hacia Alfa Centauri.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Guía en 1499, guerrera del Templo del Sur y líder del éxodo cósmico hacia Alfa Centauri junto a Loky.",
            "libro_2": "Crónicas de la civilización semilla en Alfa Centauri y su conexión espiritual a través del espacio-tiempo con sus hermanos.",
            "libro_3": "Regreso triunfal en 2033 y convergencia con las reservas indígenas y las Esferas Madre.",
        },
        "notas": ["Representa la protección, la fuerza de la naturaleza y la sanación del dolor ancestral."],
    },
    {
        "id": "gil",
        "nombre": "Gilberto Gil González Dávila",
        "archivo": "gilberto_gil_gonzalez_davila",
        "categoria": "Personaje principal",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 6, 7, 8, 9, 10],
        "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "descripcion": {
            "nombre_completo": "Gilberto González Dávila",
            "alias": "Gil, Gilberth, Ojos de Ámbar, Hijo de los Españoles",
            "edad": "Recién nacido en Cap. 0; ~14 años cuando reaparece en 1499 (tras viajar un año antes)",
            "apariencia": "Cabello oscuro, piel acaramelada, ojos amarillos como zafiros de ámbar, complexión atlética, espada española y adornos de oro",
            "personalidad": "Seguro de sí mismo, carismático, leal, estratega y noble",
            "trasfondo": "Gemelo de Cisco e hijo de Shilea; adoptado en el hospital en 1990 por la pareja española González Dávila y arrastrado al siglo XV por el Cubo Amarillo junto a su padre adoptivo",
            "motivacion": "Reencontrarse con su verdadera familia, redimir su vínculo con la expedición española y proteger el secreto de las tribus",
            "habilidades": "Maestro espadachín, táctica naval y militar, mando de tropa y canalización de la Gema Morada",
            "arco": "De joven comandante confundido por las mentiras de Pipo a hermano leal y guardián histórico que desvía a la expedición española",
            "relaciones": "Cisco, Nawa, Don Paco, Shilea, Cristóbal Colón, Curré, Pipo/Ramsés, Dulcehe La Biriteca",
        },
        "atributos": {
            "caracteristicas": ["Carismático", "Estratega", "Leal", "Valiente", "Noble"],
            "estadisticas": {"fuerza": 8, "inteligencia": 7, "agilidad": 7, "resistencia": 7, "espiritu": 6},
            "puntos_salud": 92,
            "habilidades_especiales": ["Espadachín", "Táctica militar", "Navegación en barco-submarino"],
            "poderes": ["Gema Morada de la Creación"],
            "funciones": ["Guerrero", "Comandante táctico", "Puente entre mundos"],
            "color": "Violeta",
            "hex": "#a855f7",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 5,
                "rol_visible": "Gemelo de Ojos Amarillos adoptado en 1990",
                "faccion_visible": "Familia González Dávila",
                "bio": "Nacido dos minutos antes que Cisco en el hospital de San José. Fue adoptado la misma noche por una adinerada pareja española que pagó con monedas de oro antiguas.",
            },
            {
                "hasta_capitulo": 6,
                "rol_visible": "Joven Capitán del Barco de Vapor y Hermano Reencontrado",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Desembarca en el Valle de Diquís en 1499 para advertir a Cisco de la traición de Pipo y se une a la misión rumbo al Templo del Oeste en la Isla de Nicoya.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Portador de la Gema Morada y Guardián de la Mentira Histórica",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Encuentra la carta de su madre Shilea en la Isla de Nicoya, reclama la Gema Morada, combate en las ocho repeticiones de la Playa del Encuentro y asume la misión de desviar a los españoles y buscar a su tía Dulcehe La Biriteca.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Reencuentro con Cisco y Nawa, obtención de la Gema Morada y partida en las carabelas para proteger el rastro indígena.",
            "libro_2": "Su infiltración histórica como Gil González Dávila en el siglo XVI, la búsqueda de Dulcehe La Biriteca y el Valle Central (Cartago).",
            "libro_3": "Conexión transgeneracional desde España hasta el desenlace de 2033.",
        },
        "notas": ["Representa la identidad dual, el honor táctico y la reconciliación de la sangre."],
    },
    {
        "id": "don_paco",
        "nombre": "Don Paco",
        "archivo": "don_paco",
        "categoria": "Personaje principal",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 1, 2, 4, 7, 9, 10],
        "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "descripcion": {
            "nombre_completo": "Francisco Paco",
            "alias": "Don Paco, Jawa Paco, El Guardián del Tiempo, El Primogénito",
            "edad": "Aparenta ~70 años en 1990 y ~33 años en su manifestación de 1499; ha viajado por el círculo del tiempo durante tres mil años",
            "apariencia": "En 1990: conserje mayor de espalda algo encorvada, ojos negros profundos e inmensos; en 1499: hombre joven de 33 años con vestimenta mestiza atemporal",
            "personalidad": "Sabio, paciente, enigmático, bondadoso y con humor socarrón",
            "trasfondo": "Maestro Jawa que cuidó a Shilea en 1990, adoptó a Cisco en el hospital, crio a Nawa en 1499 y tejió las piezas del tablero temporal (incluyendo la hipnosis del navegante en Las Vegas en 1989)",
            "motivacion": "Guiar a los tres hermanos para romper el bucle de Ramsés y salvar la semilla de la humanidad sin destruir su libre albedrío",
            "habilidades": "Dominio de la física y los bucles del tiempo, hipnosis/magia mental benévola, estrategia milenaria y omnisciencia paradójica",
            "arco": "El gran arquitecto del destino que prepara el camino con cartas precisas al segundo y finalmente entrega el relevo a sus hijos adoptivos",
            "relaciones": "Cisco, Nawa, Gil, Shilea, Doctor Miranda, Pipo/Ramsés, Cristóbal Colón",
        },
        "atributos": {
            "caracteristicas": ["Sabio", "Paciente", "Enigmático", "Amoroso", "Maestro"],
            "estadisticas": {"fuerza": 3, "inteligencia": 10, "agilidad": 3, "resistencia": 4, "espiritu": 10},
            "puntos_salud": 85,
            "habilidades_especiales": ["Manipulación temporal", "Hipnosis", "Estrategia trans-temporal", "Cartas proféticas"],
            "poderes": ["Círculo del Tiempo (El Ocho Acostado)"],
            "funciones": ["Mentor", "Padre adoptivo", "Guardián del Tiempo"],
            "color": "Índigo",
            "hex": "#6366f1",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 1,
                "rol_visible": "Conserje del Hospital y Padre Adoptivo de Cisco",
                "faccion_visible": "San José 1990",
                "bio": "Conserje del hospital de San José que entrega al Dr. Miranda una carta prediciendo el nacimiento de los gemelos, adopta a Cisco y lo cría con amor en Curridabat.",
            },
            {
                "hasta_capitulo": 8,
                "rol_visible": "Jawa Paco, Maestro del Tiempo",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Se revela que en 1499 fue el maestro Jawa de Nawa y mentor anterior de Pipo, además de haber protegido a Shilea en San José antes de que diera a luz.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "El Primogénito / Viajero del Círculo de 3,000 Años",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Aparece en la playa de 1499 como un joven de 33 años revelando cómo recorrió el círculo del tiempo durante tres milenios y cómo hipnotizó en 1989 al falso Colón para preparar la salvación de las tribus.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Mentor de los tres hermanos y autor de las cartas al Dr. Miranda y a Nawa.",
            "libro_2": "Sus viajes previos por los 3,000 años del bucle temporal y el origen de su rivalidad con Ramsés.",
            "libro_3": "El cierre de la ecuación del universo en el horizonte de 2033.",
        },
        "notas": ["Representa la sabiduría paternal, la fe en las nuevas generaciones y el equilibrio del tiempo."],
    },
    {
        "id": "curre",
        "nombre": "Rey Curré",
        "archivo": "rey_curre",
        "categoria": "Personaje secundario importante",
        "faccion": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
        "primera_aparicion": 4,
        "capitulos_presente": [4, 6, 7, 8, 9, 10],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Curré",
            "alias": "Rey Curré, Señor del Valle de Diquís, El Rey Humilde",
            "edad": "Adulto maduro (no envejece tras el éxodo estelar hasta 2033)",
            "apariencia": "Hombre imponente de piel cobriza, cabello negro largo con canas, tocado de plumas de quetzal y bastón tallado con jaguares",
            "personalidad": "Soberbio y desconfiado al inicio; luego humilde, sabio, valiente y con gran sentido del humor",
            "trasfondo": "Rey de los Diquís que sometió a las otras tribus tras el asesinato de su padre por el Rey Huetar Quepoa Corrohore 240 lunas atrás",
            "motivacion": "Unir a todos los pueblos indígenas sin soberbia y conducirlos hacia las estrellas para evitar su extinción",
            "habilidades": "Liderazgo militar y político, estrategia, resistencia espiritual y portador de la Gema Naranja",
            "arco": "En la esfera de agua salada del Templo del Este vence su orgullo, pide perdón de rodillas a los Cabécares y en 2033 regresa liderando las Esferas Madre",
            "relaciones": "Cisco, Nawa, Gil, Tamanco, Chamanes de las cuatro tribus, Quepoa Corrohore, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Líder", "Sabio", "Justo", "Humilde", "Visionario"],
            "estadisticas": {"fuerza": 7, "inteligencia": 8, "agilidad": 5, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 88,
            "habilidades_especiales": ["Liderazgo de las 4 tribus", "Estrategia", "Visión del futuro corporativo"],
            "poderes": ["Gema Naranja de la Sabiduría"],
            "funciones": ["Rey del Valle", "Aliado principal", "Comandante del Éxodo Estelar"],
            "color": "Naranja",
            "hex": "#f97316",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 6,
                "rol_visible": "Señor del Valle de Diquís",
                "faccion_visible": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
                "bio": "Monarca imponente de los Diquís que pone a prueba a Cisco frente al jaguar negro y, tras ver su valor, se convierte en su aliado.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Portador de la Gema Naranja y Líder Interestelar de los Pueblos",
                "faccion_visible": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
                "bio": "Supera la prueba de la oscuridad en Talamanca viendo el futuro de los cubículos y la muerte de su padre, une a las tribus con humildad, ancla el portal contra Ramsés y regresa en 2033 al mando de las Esferas Madre.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Unificador de las cuatro tribus, portador de la Gema Naranja y protagonista del mensaje global en el Epílogo de 2033.",
            "libro_2": "Gobernante sabio de la civilización indígena interestelar en Alfa Centauri.",
            "libro_3": "Líder de la flota de las 8 Esferas Madre a su regreso a Costa Rica en 2033.",
        },
        "notas": ["Representa la verdadera sabiduría que nace de la humildad y la unión de los pueblos."],
    },
    {
        "id": "droid",
        "nombre": "Droid",
        "archivo": "droid",
        "categoria": "Personaje secundario importante",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Droid",
            "alias": "El Robot, La Mochila, El Amigo de Metal",
            "edad": "Construido por Cisco dos años antes de 1990 (aunque ya asiste a Don Paco en la noche de 1990)",
            "apariencia": "Robot humanoide de metro y medio con casco de soldador marcado con la mano blanca de Don Paco y ojo rojo; se pliega en mochila táctica y gafas inteligentes",
            "personalidad": "Leal, lógico, protector y con sutil sentido del humor",
            "trasfondo": "Construido por Cisco con piezas de basura electrónica; ganador de la feria de ciencias y compañero inseparable de aventuras",
            "motivacion": "Proteger a Francisco y ejecutar los cálculos cuánticos necesarios para cumplir la misión",
            "habilidades": "Modo Mochila + Gafas traductoras, Modo Dron, Exoesqueleto de fibra de carbono con nitrógeno criogénico, Modo Avión de Combate Táctico y Protocolo Paradox",
            "arco": "De proyecto escolar de reciclaje electrónico a computadora cuántica capaz de absorber 3,000 años de simulaciones de Ramsés en 3 segundos",
            "relaciones": "Cisco, Don Paco, Nawa, Gil",
        },
        "atributos": {
            "caracteristicas": ["Leal", "Práctico", "Lógico", "Adaptable", "Cuántico"],
            "estadisticas": {"fuerza": 6, "inteligencia": 9, "agilidad": 6, "resistencia": 8, "espiritu": 5},
            "puntos_salud": 100,
            "habilidades_especiales": ["Escaneo multidimensional", "Traducción cabécar/español", "Exoesqueleto", "Protocolo Paradox"],
            "poderes": ["Domo Holográfico Cuántico", "Cañones Sónicos"],
            "funciones": ["Compañero IA", "Soporte táctico", "Traductor y procesador"],
            "color": "Azul",
            "hex": "#0ea5e9",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 5,
                "rol_visible": "Robot Compañero y Mochila Táctica de Cisco",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Robot creado por Cisco con piezas recicladas. Al escanear el cubo azul abre el vórtice a 1499 y se transforma en una mochila con gafas traductoras.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Exoesqueleto de Combate y Ejecutor del Protocolo Paradox",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Decodifica los manuscritos ancestrales, despliega el exoesqueleto criogénico en el volcán y proyecta en reversa las siete líneas temporales que colapsan la mente del Faraón.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Soporte tecnológico indispensable en cada prueba y pieza clave del Protocolo Paradox.",
            "libro_2": "Evolución de su arquitectura de inteligencia artificial junto a Cisco en el siglo XXI.",
            "libro_3": "Interfaz de comunicación entre la tecnología terrestre y las Esferas Madre de granito.",
        },
        "notas": ["Representa la ciencia al servicio de la vida y la lealtad incondicional."],
    },
    {
        "id": "loky",
        "nombre": "Loky",
        "archivo": "loky",
        "categoria": "Personaje secundario importante",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 4,
        "capitulos_presente": [4, 5, 6, 7, 8, 9],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Loky",
            "alias": "El Espíritu del Jaguar, Guardián del Valle",
            "edad": "Indeterminada (Ser físico-espiritual)",
            "apariencia": "Jaguar negro colosal del tamaño de un caballo pequeño, con motas doradas al sol y ojos amarillos intensos",
            "personalidad": "Feroz contra los traidores, noble, protector y profundamente agradecido con quienes lo sanaron",
            "trasfondo": "Espíritu guardián del Valle de Diquís al que Pipo incrustó quirúrgicamente la Gema Roja en el lomo para corromperlo",
            "motivacion": "Proteger a Cisco y Nawa, combatir junto a ella y resguardar el equilibrio espiritual de la selva",
            "habilidades": "Fuerza y velocidad sobrehumanas, regeneración acelerada, percepción espiritual y capacidad de herir espectros al unirse con Nawa",
            "arco": "De bestia enjaulada al borde de la muerte a compañero inseparable de Nawa y puente vivo del rayo Índigo",
            "relaciones": "Cisco, Nawa, Gil, Pipo/Ramsés, La Banshee",
        },
        "atributos": {
            "caracteristicas": ["Feroz", "Protector", "Ágil", "Espiritual", "Leal"],
            "estadisticas": {"fuerza": 9, "inteligencia": 6, "agilidad": 9, "resistencia": 8, "espiritu": 8},
            "puntos_salud": 90,
            "habilidades_especiales": ["Puente espiritual-físico", "Rastreo olfativo", "Regeneración"],
            "poderes": ["Conexión con la selva y canalización de la Gema Índigo"],
            "funciones": ["Guardián espiritual", "Compañero de batalla de Nawa"],
            "color": "Rojo",
            "hex": "#dc2626",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 4,
                "rol_visible": "El Espíritu del Jaguar",
                "faccion_visible": "Alianza Indígena / Jawas",
                "bio": "Jaguar negro capturado en la cascada que sufría por la Gema Roja incrustada en su lomo. Tras ser liberado del dolor por Cisco, se convierte en su guardián.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Loky, Guardián Espiritual y Compañero de Nawa",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Hiere a Pipo cuando este roba la Gema Roja, recibe el nombre de Loky tras ser curado por Nawa, derrota junto a ella a la Banshee en el Templo del Sur y parte con Nawa hacia Alfa Centauri.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Sanado por Cisco y Nawa; montura sagrada en el Templo del Sur y en la batalla de la Playa del Encuentro.",
            "libro_2": "Guardián junto a Nawa en Alfa Centauri (mientras en 1990 Don Paco regala un cachorro de jaguar a Cisco).",
            "libro_3": "Retorno del espíritu del jaguar en la convergencia de 2033.",
        },
        "notas": ["Representa el puente entre el mundo espiritual y el mundo físico."],
    },
    {
        "id": "pipo_ramses",
        "nombre": "Pipo Ramsés",
        "archivo": "pipo_ramses",
        "categoria": "Personaje secundario importante",
        "faccion": "Fuerzas del Bucle / Antagonistas",
        "primera_aparicion": 2,
        "capitulos_presente": [2, 3, 4, 5, 6, 8, 9],
        "imagen": "Proyecto-Proton/Personajes/Jawa-Pipo.jpg",
        "descripcion": {
            "nombre_completo": "Ramsés II (oculto bajo la identidad de Jawa Pipo)",
            "alias": "Jawa Pipo, Ramsés el Grande, Faraón de las Dos Tierras, El Arquitecto del Bucle",
            "edad": "Más de 3,000 años",
            "apariencia": "Como Pipo: anciano chamán de cabello oscuro con trenzas y collares; como Ramsés: hombre imponente con lino blanco, tocado de oro y lapislázuli y collar de escarabajos",
            "personalidad": "Carismático, teatral, manipulador, narcisista y obsesionado con el control absoluto del tiempo",
            "trasfondo": "Faraón egipcio que cruzó el mar milenios atrás buscando los cristales esenciales, introdujo el sarampión como experimento y fingió ser el Jawa sucesor de Don Paco",
            "motivacion": "Reunir las ocho gemas y el oro de los Diquís para regresar al Nilo como un Dios absoluto dueño del eterno retorno",
            "habilidades": "Magia mental (psicología/manipulación), alquimia de pólvora, premonición táctica y creación del bucle temporal de Planck con las gemas Roja y Amarilla",
            "arco": "Pasa de mentor carismático a traidor descubierto y finalmente a dios autoproclamado encerrado en la cuarentena estática de su propio infinito",
            "relaciones": "Cisco, Nawa, Gil, Don Paco, Curré, Loky, Cristóbal Colón",
        },
        "atributos": {
            "caracteristicas": ["Manipulador", "Ambicioso", "Estratega", "Soberbio", "Poderoso"],
            "estadisticas": {"fuerza": 7, "inteligencia": 9, "agilidad": 6, "resistencia": 7, "espiritu": 8},
            "puntos_salud": 80,
            "habilidades_especiales": ["Bucle temporal", "Magia mental", "Pólvora", "Ejército de espectros de Anubis"],
            "poderes": ["Gema Roja del Valor (usurpada)", "Gema Amarilla de la Voluntad (usurpada)"],
            "funciones": ["Falso mentor (Cap. 2-4)", "Antagonista principal (Cap. 5-8)"],
            "color": "Amarillo",
            "hex": "#eab308",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 4,
                "rol_visible": "Jawa Pipo, Mentor de la Aldea Diquís",
                "faccion_visible": "Alianza Indígena / Jawas",
                "bio": "Actual Jawa de la aldea Diquís y antiguo aprendiz de Paco. Recibe a Cisco con entusiasmo, le enseña sobre la 'magia' (psicología, pólvora y matemáticas) y le entrega los manuscritos de los ocho Cristales.",
            },
            {
                "hasta_capitulo": 7,
                "rol_visible": "Jawa Traidor y Ladrón de las Gemas Roja y Amarilla",
                "faccion_visible": "Fuerzas del Bucle / Antagonistas",
                "bio": "Roba la Gema Roja en la noche, es herido en el brazo por Loky y huye hacia las carabelas en un submarino primitivo tras haber engañado también a Gil y a su padre adoptivo para obtener la Gema Amarilla.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Ramsés II, El Faraón Infinito",
                "faccion_visible": "Fuerzas del Bucle / Antagonistas",
                "bio": "Revela su verdadera identidad milenaria como el Faraón Ramsés II y encierra la Playa del Encuentro en un bucle de ocho repeticiones, hasta ser derrotado por el Protocolo Paradox y confinado en una llanura estática por la eternidad.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Antagonista central; encerrado en la cuarentena cuántica de su propio bucle al final del Capítulo 8.",
            "libro_2": "Ecos de sus experimentos previos en Mesoamérica y el Antiguo Egipto dentro de la historia de los Jawas.",
            "libro_3": "Referencia fundamental sobre el peligro del poder sin amor ni libertad.",
        },
        "notas": ["Representa la soberbia del poder absoluto y la prisión del ego que se niega a aprender."],
    },
    {
        "id": "shilea",
        "nombre": "Ditsowe Shilea",
        "archivo": "shilea",
        "categoria": "Personaje secundario importante",
        "faccion": "Héroes del Tiempo / Jawas",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 7],
        "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "descripcion": {
            "nombre_completo": "Ditsowe Shilea",
            "alias": "Shilea, La Madre Viajera",
            "edad": "Joven; fallece el 13 de diciembre de 1990 al dar a luz a Cisco y Gil",
            "apariencia": "Mujer indígena cabécar de piel morena, cabello negro, tatuaje de ocho esferas en círculo y aretes de jade morado",
            "personalidad": "Valiente, amorosa, abnegada y visionaria",
            "trasfondo": "Madre biológica de Nawa, Gil y Cisco y hermana de Dulcehe La Biriteca. En 1499 tocó la Gema Morada en la Isla de Nicoya para viajar a 1990 y salvar a sus hijos de la plaga",
            "motivacion": "Dar vida a sus hijos en una época donde pudieran sobrevivir y dejarles el camino trazado para salvar a su pueblo",
            "habilidades": "Herboristería ancestral, valentía para cruzar el tiempo y vínculo espiritual con las gemas Morada e Índigo",
            "arco": "Su sacrificio en el Capítulo 0 y su carta revelada en el Capítulo 7 unen emocionalmente a los tres hermanos",
            "relaciones": "Cisco, Nawa, Gil, Don Paco, Dulcehe La Biriteca",
        },
        "atributos": {
            "caracteristicas": ["Amorosa", "Sacrificial", "Valiente", "Mística", "Protectora"],
            "estadisticas": {"fuerza": 5, "inteligencia": 7, "agilidad": 5, "resistencia": 6, "espiritu": 9},
            "puntos_salud": 70,
            "habilidades_especiales": ["Herboristería", "Viaje temporal por amor maternal"],
            "poderes": ["Gema Morada de la Creación", "Gema Índigo del Espíritu (Aretes de jade)"],
            "funciones": ["Madre de los tres protagonistas", "Corazón emocional de la saga"],
            "color": "Violeta",
            "hex": "#c084fc",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 6,
                "rol_visible": "Madre Misteriosa de las Ocho Esferas",
                "faccion_visible": "San José 1990",
                "bio": "Mujer encontrada inconsciente en el Cerro de la Muerte que da a luz a los gemelos en 1990 antes de fallecer. Lleva tatuadas ocho esferas formando un círculo.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Ditsowe Shilea, Madre de Cisco, Gil y Nawa",
                "faccion_visible": "Héroes del Tiempo / Jawas",
                "bio": "Su carta en el Templo del Oeste revela que viajó desde 1499 tocando la Gema Morada en Nicoya, fue cuidada por Don Paco en San José y es la madre de los tres jóvenes héroes.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "El origen del viaje y el lazo de sangre que une a Cisco, Gil y Nawa.",
            "libro_2": "Su legado continúa a través de su hermana Dulcehe La Biriteca en el siglo XVI.",
            "libro_3": "Memoria viva en el retorno de la semilla a Costa Rica.",
        },
        "notas": ["Es el puente de amor maternal que conecta 1499 y 1990."],
    },
    {
        "id": "tamanco",
        "nombre": "Tamanco",
        "archivo": "tamanco",
        "categoria": "Personaje secundario importante",
        "faccion": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
        "primera_aparicion": 6,
        "capitulos_presente": [6, 7, 8, 9],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Tamanco",
            "alias": "El Guerrero Leal, Cazador de las Montañas Humeantes",
            "edad": "Adulto, ~30 años",
            "apariencia": "Guerrero Boruca fornido, pinturas de guerra, adornos de plumas y pesada maza de piedra volcánica",
            "personalidad": "Valiente, leal, curioso por la ciencia y cumplidor de su palabra ('siete oraciones')",
            "trasfondo": "Experimentado cazador de las faldas del volcán que se ofrece como guía de Cisco hacia el Templo del Norte",
            "motivacion": "Proteger a Cisco en el volcán y defender la libertad de los pueblos indígenas",
            "habilidades": "Fuerza descomunal, rastreo en montaña volcánica y combate con maza de piedra",
            "arco": "Entra al volcán al cumplirse las siete oraciones y provoca el torrente de agua subterránea que permite a Cisco vencer al Gólem de Granito",
            "relaciones": "Cisco, Curré, Nawa, Gil",
        },
        "atributos": {
            "caracteristicas": ["Leal", "Fuerte", "Valiente", "Respetuoso", "Curioso"],
            "estadisticas": {"fuerza": 8, "inteligencia": 5, "agilidad": 6, "resistencia": 8, "espiritu": 6},
            "puntos_salud": 88,
            "habilidades_especiales": ["Combate con maza volcánica", "Guía de alta montaña"],
            "poderes": [],
            "funciones": ["Guerrero Boruca", "Compañero de Cisco en el Templo del Norte"],
            "color": "Verde",
            "hex": "#22c55e",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Guerrero Boruca y Aliado del Templo del Norte",
                "faccion_visible": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
                "bio": "Guía a Cisco hacia la Cordillera Volcánica Central y salva su vida al derribar una fisura de agua subterránea sobre el Gólem de Granito. En el sueño de cumpleaños de 1990 aparece como el carnicero del barrio.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Héroe fundamental en la obtención de la Gema Blanca.",
            "libro_2": "Representante de los guerreros Borucas en el nuevo mundo.",
            "libro_3": "Parte de la memoria y linaje que retorna en 2033.",
        },
        "notas": ["Demuestra que la tecnología de Cisco necesita de la fuerza y lealtad humana para triunfar."],
    },
    {
        "id": "doctor_miranda",
        "nombre": "Doctor Miranda",
        "archivo": "doctor_miranda",
        "categoria": "Personaje secundario",
        "faccion": "San José 1990",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 10],
        "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "descripcion": {
            "nombre_completo": "Doctor Miranda",
            "alias": "El Hombre de Ciencia",
            "edad": "65 años (40 años ejerciendo la medicina)",
            "apariencia": "Médico mayor con bata blanca y expresión reflexiva",
            "personalidad": "Racional y escéptico al inicio, pero guiado por una profunda conciencia moral",
            "trasfondo": "Médico de guardia en el hospital de San José la noche del 13 de diciembre de 1990 que recibe la carta profética de Don Paco",
            "motivacion": "Evitar que el segundo gemelo sufra en un albergue y darle una oportunidad junto a Don Paco",
            "habilidades": "Medicina, cirugía neonatal y discernimiento ético",
            "arco": "Tras comprobar cada predicción cronometrada de la carta de Don Paco, borra los registros del hospital y le entrega a Cisco",
            "relaciones": "Don Paco, Cisco, Gil, Obstetra Rodríguez",
        },
        "atributos": {
            "caracteristicas": ["Racional", "Profesional", "Compasivo", "Consciente"],
            "estadisticas": {"fuerza": 2, "inteligencia": 8, "agilidad": 2, "resistencia": 4, "espiritu": 6},
            "puntos_salud": 78,
            "habilidades_especiales": ["Medicina", "Cirugía"],
            "poderes": [],
            "funciones": ["Médico de guardia", "Cómplice de Don Paco en 1990"],
            "color": "Amarillo",
            "hex": "#facc15",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Médico de Guardia en San José (1990)",
                "faccion_visible": "San José 1990",
                "bio": "Experimenta una serie de déjà vus descritos minuto a minuto en la carta de Don Paco y toma la decisión crucial de confiarle al bebé de ojos azules.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Guardián del secreto del nacimiento de Cisco y Gil en 1990.",
            "libro_2": "Sus archivos médicos y el rastro del hospital en San José.",
            "libro_3": "Ecos del inicio del bucle en 1990.",
        },
        "notas": ["Su decisión ética abre la puerta a toda la historia de Cisco."],
    },
    {
        "id": "obstetra_rodriguez",
        "nombre": "Obstetra Rodríguez",
        "archivo": "obstetra_rodriguez",
        "categoria": "Personaje secundario",
        "faccion": "San José 1990",
        "primera_aparicion": 0,
        "capitulos_presente": [0, 9],
        "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "descripcion": {
            "nombre_completo": "Enfermera / Obstetra Rodríguez",
            "alias": "La Obstetra",
            "edad": "Adulta",
            "apariencia": "Uniforme de enfermera de maternidad",
            "personalidad": "Práctica, discreta y pragmática",
            "trasfondo": "Asiste en el parto de Shilea y gestiona la entrega del primer gemelo (Gil) a la pareja española González Dávila",
            "motivacion": "Resolver la situación sin escándalos y asegurar su propio beneficio con las monedas de oro",
            "habilidades": "Asistencia obstétrica y discreción",
            "arco": "Su silencio pagado con oro antiguo permite que el registro de ambos niños desaparezca sin investigaciones",
            "relaciones": "Doctor Miranda, Don Paco, Cisco, Gil",
        },
        "atributos": {
            "caracteristicas": ["Discreta", "Práctica", "Pragmática"],
            "estadisticas": {"fuerza": 1, "inteligencia": 6, "agilidad": 2, "resistencia": 3, "espiritu": 4},
            "puntos_salud": 76,
            "habilidades_especiales": ["Asistencia médica"],
            "poderes": [],
            "funciones": ["Testigo del nacimiento", "Intermediaria de la adopción de Gil"],
            "color": "Azul",
            "hex": "#60a5fa",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Obstetra del Hospital Capitalino",
                "faccion_visible": "San José 1990",
                "bio": "Propone entregar uno de los gemelos a los turistas españoles y recibe monedas de oro antiguas a cambio de su silencio.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Pieza clave en la separación inicial de los gemelos en 1990.",
            "libro_2": "Mención en la reconstrucción del pasado de Cisco y Gil.",
            "libro_3": "Parte de los recuerdos de origen.",
        },
        "notas": ["En el despertar de cumpleaños de Cisco (Cap. 9) aparece como la enfermera que lo cuidaba de niño."],
    },
    {
        "id": "cristobal_colon",
        "nombre": "Cristóbal Colón (El Hombre del Catalejo)",
        "archivo": "cristobal_colon",
        "categoria": "Personaje secundario",
        "faccion": "Expedición Española 1499",
        "primera_aparicion": 5,
        "capitulos_presente": [5, 6, 9],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Navegante Genovés / Padre Adoptivo de Gil",
            "alias": "Cristóbal Colón, El Hombre del Catalejo, El Almirante",
            "edad": "Adulto",
            "apariencia": "Hombre de cabello negro peinado hacia atrás, vestimenta oscura anacrónica (estilo siglo XIX) y catalejo",
            "personalidad": "Autoritario, ambicioso y bajo sugestión hipnótica profunda",
            "trasfondo": "Navegante genovés con delirios de grandeza al que Don Paco conoció en un casino de Las Vegas en 1989 e hipnotizó para que creyera ser Cristóbal Colón y zarpara hacia Costa Rica tres años antes",
            "motivacion": "Cumplir la misión implantada en su mente y regresar a España reportando no haber encontrado nada",
            "habilidades": "Navegación transatlántica y mando de flota",
            "arco": "Se revela primero como el misterioso hombre del catalejo y padre adoptivo de Gil, y finalmente en el Capítulo 9 Don Paco revela la verdad sobre su hipnosis en Las Vegas",
            "relaciones": "Gil, Don Paco, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Autoritario", "Navegante", "Hipnotizado", "Enigmático"],
            "estadisticas": {"fuerza": 5, "inteligencia": 6, "agilidad": 4, "resistencia": 5, "espiritu": 4},
            "puntos_salud": 74,
            "habilidades_especiales": ["Navegación", "Mando naval"],
            "poderes": [],
            "funciones": ["Padre adoptivo de Gil", "Pieza de ajedrez temporal de Don Paco"],
            "color": "Amarillo",
            "hex": "#ca8a04",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 5,
                "rol_visible": "El Misterioso Hombre del Catalejo",
                "faccion_visible": "Expedición Española 1499",
                "bio": "Hombre de vestimenta anacrónica que observa a Cisco desde la cubierta de un barco de propulsión a vapor de 1802 mientras recibe a Pipo.",
            },
            {
                "hasta_capitulo": 8,
                "rol_visible": "Cristóbal, Padre Adoptivo de Gil",
                "faccion_visible": "Expedición Española 1499",
                "bio": "Padre adoptivo de Gil que llegó un año antes con el Cubo Amarillo, entregó la gema a Pipo y trajo tres carabelas desde España.",
            },
            {
                "hasta_capitulo": 10,
                "rol_visible": "Navegante Hipnotizado por Don Paco en Las Vegas (1989)",
                "faccion_visible": "Expedición Española 1499",
                "bio": "Don Paco revela que lo conoció en un casino de Las Vegas en 1989 y lo hipnotizó para adelantar la expedición tres años y permitir que Gil desviara el curso de la historia.",
            },
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Anomalía temporal viviente diseñada por Don Paco.",
            "libro_2": "Su regreso a Europa junto a Gil para encubrir la desaparición de las tribus.",
            "libro_3": "Efecto mariposa de su reporte en la historia moderna.",
        },
        "notas": ["Uno de los giros de trama más sorprendentes del Capítulo 9."],
    },
    {
        "id": "dulcehe",
        "nombre": "Dulcehe La Biriteca",
        "archivo": "dulcehe_la_biriteca",
        "categoria": "Personaje secundario",
        "faccion": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
        "primera_aparicion": 7,
        "capitulos_presente": [7],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Dulcehe La Biriteca",
            "alias": "La Biriteca, Hermana de Shilea",
            "edad": "Joven / Adulta en el siglo XVI",
            "apariencia": "Mujer guerrera y sabia de sangre indígena costarricense",
            "personalidad": "Valiente, guardiana de la memoria y las raíces",
            "trasfondo": "Hermana de Ditsowe Shilea y tía materna de Cisco, Gil y Nawa; mencionada en la carta sagrada de Shilea en la Isla de Nicoya",
            "motivacion": "Preservar las raíces en el Valle Central (Cartago) para que el futuro no colapse por el anacronismo de la partida de las tribus",
            "habilidades": "Sabiduría ancestral, resistencia cultural y liderazgo",
            "arco": "Encomendada por Shilea a Gil como misión clave para el futuro inmediato de la saga",
            "relaciones": "Shilea, Gil, Cisco, Nawa",
        },
        "atributos": {
            "caracteristicas": ["Sabia", "Guerrera", "Raíz ancestral", "Clave del futuro"],
            "estadisticas": {"fuerza": 6, "inteligencia": 8, "agilidad": 7, "resistencia": 8, "espiritu": 9},
            "puntos_salud": 85,
            "habilidades_especiales": ["Custodia del linaje en el Valle Central"],
            "poderes": [],
            "funciones": ["Eslabón hacia el Libro 2", "Tía de los protagonistas"],
            "color": "Violeta",
            "hex": "#9333ea",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Hermana de Shilea y Misión Futura de Gil en Cartago",
                "faccion_visible": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
                "bio": "Revelada en la carta de Shilea (Cap. 7.4): Gil deberá buscarla cuando regrese al Valle Central (Cartago) para evitar que el anacronismo borre sus raíces.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Semilla narrativa plantada en la carta de Shilea en el Templo del Oeste.",
            "libro_2": "Personaje central junto a Gil en la trama del Valle Central y Cartago.",
            "libro_3": "Ancestro directo de la resistencia cultural que recibe a las Esferas en 2033.",
        },
        "notas": ["Conecta el Libro 1 Canon directamente con el Libro 2 de la Saga."],
    },
    {
        "id": "quepoa",
        "nombre": "Rey Quepoa Corrohore",
        "archivo": "quepoa_corrohore",
        "categoria": "Personaje secundario",
        "faccion": "Fuerzas del Bucle / Antagonistas",
        "primera_aparicion": 7,
        "capitulos_presente": [7],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Quepoa Corrohore",
            "alias": "El Rey Huetar",
            "edad": "Adulto",
            "apariencia": "Cacique de porte regio que porta ofrendas de chicha de maíz",
            "personalidad": "Calculador y traicionero",
            "trasfondo": "Rey Huetar invitado por el padre de Curré 240 lunas atrás a la gran reunión de unión de los pueblos",
            "motivacion": "Impedir la hegemonía del Valle mediante el envenenamiento del padre de Curré",
            "habilidades": "Diplomacia engañosa y uso de venenos",
            "arco": "Aparece en la visión de la esfera de agua salada de Curré (Cap. 7.3), revelando la verdadera causa de la fractura entre las tribus",
            "relaciones": "Rey Curré",
        },
        "atributos": {
            "caracteristicas": ["Astuto", "Traicionero", "Político"],
            "estadisticas": {"fuerza": 6, "inteligencia": 7, "agilidad": 6, "resistencia": 6, "espiritu": 4},
            "puntos_salud": 78,
            "habilidades_especiales": ["Intriga política"],
            "poderes": [],
            "funciones": ["Catalizador del trauma pasado del Rey Curré"],
            "color": "Rojo",
            "hex": "#b91c1c",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Rey Huetar de la Visión del Pasado",
                "faccion_visible": "Fuerzas del Bucle / Antagonistas",
                "bio": "Envenenó la chicha de maíz del padre de Curré durante el consejo de unión de las tribus 240 lunas atrás, desatando décadas de rencor que Curré finalmente sana en el Templo del Este.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Explica el origen de la división de las tribus antes de la llegada de Cisco.",
            "libro_2": "El destino de los pueblos que decidieron no cruzar el portal estelar.",
            "libro_3": "Reconciliación histórica definitiva.",
        },
        "notas": ["Pieza clave del trasfondo político indígena en el Capítulo 7.3."],
    },
    {
        "id": "chamanes",
        "nombre": "Chamanes de las cuatro tribus",
        "archivo": "chamanes_de_las_cuatro_tribus",
        "categoria": "Grupo secundario",
        "faccion": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
        "primera_aparicion": 4,
        "capitulos_presente": [4, 6, 7, 8, 9, 10],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Chamanes de las tribus Diquís, Cabécares, Bribris y Borucas",
            "alias": "El Consejo de Ancianos, Guardianes del Templo del Este",
            "edad": "Ancianos centenarios (destacando el Chamán Supremo Cabécar de piel como corteza)",
            "apariencia": "Pinturas ceremoniales, collares de jade, tocados de plumas y más tarde túnicas de fibra de luz en 2033",
            "personalidad": "Sabios, severos ante la soberbia, pero profundamente justos y fraternales ante la humildad",
            "trasfondo": "Custodios de la Esfera de Granito en Talamanca y de la Gema Naranja de la Sabiduría",
            "motivacion": "Guiar espiritualmente a los pueblos hacia la unión y hacia las estrellas",
            "habilidades": "Rituales ancestrales, astronomía, prueba de la esfera de agua salada y navegación estelar",
            "arco": "Juzgan la soberbia de Curré, lo perdonan con lágrimas al ver su humildad y en 2033 reaparecen riendo junto a él en la transmisión mundial",
            "relaciones": "Rey Curré, Cisco, Nawa, Gil",
        },
        "atributos": {
            "caracteristicas": ["Sabios", "Tradicionales", "Espirituales", "Justos"],
            "estadisticas": {"fuerza": 3, "inteligencia": 8, "agilidad": 2, "resistencia": 4, "espiritu": 9},
            "puntos_salud": 80,
            "habilidades_especiales": ["Ritual Shkina", "Astronomía Diquís/Cabécar", "Custodia de la Esfera"],
            "poderes": ["Sabiduría ancestral"],
            "funciones": ["Consejo espiritual", "Custodios del Templo del Este"],
            "color": "Naranja",
            "hex": "#fb923c",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Consejo de Sabios de las Cuatro Tribus",
                "faccion_visible": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
                "bio": "Custodios de la tradición y del Templo del Este en Talamanca. Someten al Rey Curré a la prueba de la esfera de agua salada y le entregan la Gema Naranja.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Unificadores espirituales del éxodo hacia Alfa Centauri.",
            "libro_2": "Sabios de las túnicas de fibra de luz en las Esferas Madre.",
            "libro_3": "Acompañan al Rey Curré en la transmisión global de 2033.",
        },
        "notas": ["En el sueño de cumpleaños de Cisco son los ancianos del vecindario que leen hojas de café."],
    },
    {
        "id": "tribu_diquis",
        "nombre": "Tribu Diquís y Pueblos Aliados",
        "archivo": "tribu_diquis",
        "categoria": "Grupo secundario",
        "faccion": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
        "primera_aparicion": 2,
        "capitulos_presente": [2, 4, 6, 7, 8, 9, 10],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Pueblos Diquís, Cabécares, Bribris y Borucas",
            "alias": "El Pueblo de las Esferas, La Semilla Humana",
            "edad": "Colectivo de todas las edades",
            "apariencia": "Guerreros, mujeres, niños y sabios con adornos de oro y jade, máscaras de jaguar y macanas de piedra",
            "personalidad": "Valientes, resilientes, hospitalarios y unidos frente a la adversidad",
            "trasfondo": "Herederos de los Jawas Ancestrales en el Valle del Río Grande de Térraba y las cordilleras de Costa Rica",
            "motivacion": "Sobrevivir al genocidio inminente y llevar la semilla humana hacia Alfa Centauri, Orión y las Pléyades",
            "habilidades": "Talla de esferas de piedra, astronomía, agricultura y combate en falange con arcos y macanas",
            "arco": "Luchan valientemente en las repeticiones de la Playa del Encuentro y ascienden de ocho en ocho a través de las esferas-cápsula durante la Luna Carmesí",
            "relaciones": "Rey Curré, Cisco, Nawa, Gil, Tamanco",
        },
        "atributos": {
            "caracteristicas": ["Valientes", "Resilientes", "Astrónomos", "Unidos"],
            "estadisticas": {"fuerza": 7, "inteligencia": 7, "agilidad": 6, "resistencia": 8, "espiritu": 8},
            "puntos_salud": 85,
            "habilidades_especiales": ["Talla de esferas", "Defensa del Valle", "Viaje interestelar"],
            "poderes": [],
            "funciones": ["Pueblo protagonista", "Viajeros de las Esferas Madre"],
            "color": "Naranja",
            "hex": "#f59e0b",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Los Cuatro Pueblos Unidos del Valle y las Montañas",
                "faccion_visible": "Alianza Indígena (Diquís, Cabécares, Bribris, Borucas)",
                "bio": "Habitantes ancestrales de Costa Rica que se unen bajo el liderazgo de Curré y los tres hermanos para vencer a Ramsés y partir hacia las estrellas en las cápsulas de transferencia.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Protagonistas colectivos del gran éxodo de la Luna Carmesí.",
            "libro_2": "Florecimiento de su civilización avanzada en Alfa Centauri.",
            "libro_3": "Regreso a la Tierra en octubre de 2033.",
        },
        "notas": ["Las esferas de piedra de Costa Rica son los cascarones inertes que dejaron sus naves al partir."],
    },
    {
        "id": "espanoles",
        "nombre": "Españoles y marineros de la expedición",
        "archivo": "espanoles_y_marineros_de_la_expedicion",
        "categoria": "Grupo secundario",
        "faccion": "Expedición Española 1499",
        "primera_aparicion": 1,
        "capitulos_presente": [1, 5, 6, 7, 8, 9],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Marineros y soldados de la expedición adelantada de 1499",
            "alias": "Hombres de Metal",
            "edad": "Adultos",
            "apariencia": "Hombres barbudos con cascos y armaduras de metal, espadas, cañones y tres carabelas (La Pinta, La Niña y La Santa María)",
            "personalidad": "Ambiciosos por el oro de El Dorado, aunque los subordinados de Gil le son leales",
            "trasfondo": "Llegados en 1499 (tres años antes de la historia oficial) debido a la intervención temporal de Don Paco y las manipulaciones de Pipo",
            "motivacion": "Encontrar oro y regresar a España",
            "habilidades": "Combate naval, artillería de cañones y navegación",
            "arco": "Una facción leal a Gil combate junto a las tribus en la Playa del Encuentro y luego zarpa con él para desviar el rastro histórico",
            "relaciones": "Gil, Cristóbal Colón, Pipo/Ramsés",
        },
        "atributos": {
            "caracteristicas": ["Organizados", "Navegantes", "Armados"],
            "estadisticas": {"fuerza": 6, "inteligencia": 5, "agilidad": 4, "resistencia": 6, "espiritu": 3},
            "puntos_salud": 75,
            "habilidades_especiales": ["Artillería naval", "Navegación"],
            "poderes": [],
            "funciones": ["Fuerza naval en 1499", "Subordinados de Gil"],
            "color": "Rojo",
            "hex": "#ef4444",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Expedición Adelantada de 1499",
                "faccion_visible": "Expedición Española 1499",
                "bio": "Tripulación de las carabelas cuya llegada anticipada a 1499 forma parte del tablero temporal entre Don Paco, Gil y Ramsés.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Presencia naval en la costa del Pacífico y la Playa del Encuentro.",
            "libro_2": "Expediciones del siglo XVI que Gil desvía para proteger el secreto de las Esferas.",
            "libro_3": "Reacción de Madrid en el Epílogo de 2033 ante la broma del Rey Curré.",
        },
        "notas": ["Subdivididos entre la flota de las carabelas y la tripulación leal al barco de vapor de Gil."],
    },
    {
        "id": "la_banshee",
        "nombre": "La Banshee",
        "archivo": "la_banshee",
        "categoria": "Entidad secundaria",
        "faccion": "Guardianes de los Templos",
        "primera_aparicion": 7,
        "capitulos_presente": [7],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "La Banshee del Gran Ceibo",
            "alias": "El Alma en Pena, El Eco de los Caídos",
            "edad": "Centenaria",
            "apariencia": "Inicialmente adopta la forma de Shilea; luego se transforma en un espectro traslúcido de cuencas vacías, garras de hueso y sudarios de hojas",
            "personalidad": "Dolorosa, vengativa y nacida del miedo de quienes fracasaron antes",
            "trasfondo": "Conglomerado del dolor de las madres y de los siete guerreros petrificados que intentaron tomar la Gema Verde por la fuerza",
            "motivacion": "Quebrar la voluntad de Nawa con la herida de no conocer su identidad",
            "habilidades": "Alarido psíquico, intangibilidad y tentáculos de sombra",
            "arco": "Es derrotada y purificada cuando Nawa y Loky combinan lo físico (cuchillo de obsidiana) y lo espiritual, liberando las almas atrapadas",
            "relaciones": "Nawa, Loky, Shilea",
        },
        "atributos": {
            "caracteristicas": ["Espectral", "Dolorosa", "Intangible", "Prueba del corazón"],
            "estadisticas": {"fuerza": 5, "inteligencia": 7, "agilidad": 6, "resistencia": 6, "espiritu": 9},
            "puntos_salud": 70,
            "habilidades_especiales": ["Alarido de frecuencia", "Ilusión materna"],
            "poderes": ["Manipulación del dolor acumulado"],
            "funciones": ["Guardiana del Templo del Sur (Gema Verde)"],
            "color": "Verde",
            "hex": "#059669",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Guardiana Espectral del Templo del Sur",
                "faccion_visible": "Guardianes de los Templos",
                "bio": "Manifestación del dolor de los caídos en el Gran Ceibo de Osa. Nawa y Loky la vencen y liberan a las siete almas petrificadas para obtener la Gema Verde.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Prueba espiritual superada por Nawa y Loky en el Capítulo 7.2.",
            "libro_2": "Referencia de las pruebas de los templos ancestrales.",
            "libro_3": "Memoria de los guerreros liberados.",
        },
        "notas": ["Representa el dolor heredado que solo se corta con voluntad y compañía."],
    },
    {
        "id": "guardian_norte",
        "nombre": "Guardián del Templo del Norte",
        "archivo": "guardian_del_templo_del_norte",
        "categoria": "Entidad secundaria",
        "faccion": "Guardianes de los Templos",
        "primera_aparicion": 7,
        "capitulos_presente": [7],
        "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "descripcion": {
            "nombre_completo": "Guardián del Templo del Norte",
            "alias": "El Gólem de Granito, Espíritu de la Transformación",
            "edad": "Milenaria",
            "apariencia": "Coloso de granito de tres metros de altura alimentado por el calor del volcán, con ojos de brasa y la Gema Blanca en el pecho",
            "personalidad": "Implacable, solemne y justo",
            "trasfondo": "Guardián elemental de la Cordillera Volcánica Central que custodia la Gema Blanca de la Transformación",
            "motivacion": "Exigir que el aspirante demuestre su capacidad de transformarse y vencer sus temores",
            "habilidades": "Fuerza tectónica, inmunidad al calor extremo y resistencia al sonido",
            "arco": "Es derrotado por el choque térmico entre el torrente de agua subterránea de Tamanco y el nitrógeno líquido de Cisco/Droid, dividiéndose en ocho esferas lisas perfectas",
            "relaciones": "Cisco, Tamanco, Droid",
        },
        "atributos": {
            "caracteristicas": ["Colosal", "Elemental", "Inamovible", "Justo"],
            "estadisticas": {"fuerza": 9, "inteligencia": 4, "agilidad": 2, "resistencia": 10, "espiritu": 5},
            "puntos_salud": 95,
            "habilidades_especiales": ["Fuerza sísmica", "Coraza de granito volcánico"],
            "poderes": ["Gema Blanca de la Transformación"],
            "funciones": ["Guardián del Templo del Norte (Gema Blanca)"],
            "color": "Blanco",
            "hex": "#94a3b8",
        },
        "evolucion_por_capitulo": [
            {
                "hasta_capitulo": 10,
                "rol_visible": "Gólem de Granito del Volcán",
                "faccion_visible": "Guardianes de los Templos",
                "bio": "Coloso de tres metros que protege la Gema Blanca en el volcán. Al ser vencido mediante choque térmico por Cisco y Tamanco, su cuerpo se divide en ocho esferas de piedra perfectas.",
            }
        ],
        "proyeccion_saga": {
            "libro_1_canon": "Prueba del Templo del Norte en el Capítulo 7.1.",
            "libro_2": "Clave sobre la composición física y alquímica de las Esferas.",
            "libro_3": "Vínculo con la tecnología de granito negro de las Esferas Madre.",
        },
        "notas": ["Su colapso en ocho esferas anticipa el secreto de las cápsulas de transferencia."],
    },
]


RELACIONES_CANON = [
    {
        "origen": "don_paco",
        "destino": "cisco",
        "tipo": "familia_mentor",
        "etiqueta": "Padre adoptivo y Maestro",
        "capitulo_minimo": 0,
        "descripcion": "Don Paco rescata y adopta a Cisco la noche de su nacimiento en 1990 y lo prepara para su misión.",
    },
    {
        "origen": "cisco",
        "destino": "droid",
        "tipo": "alianza",
        "etiqueta": "Creador y Compañero IA",
        "capitulo_minimo": 1,
        "descripcion": "Cisco construyó a Droid a los 8 años; son inseparables en cada salto temporal.",
    },
    {
        "origen": "don_paco",
        "destino": "doctor_miranda",
        "tipo": "alianza",
        "etiqueta": "Carta profética y pacto",
        "capitulo_minimo": 0,
        "descripcion": "Don Paco le deja la carta del 13 de diciembre de 1990 y el Dr. Miranda le confía al bebé de ojos azules.",
    },
    {
        "origen": "shilea",
        "destino": "cisco",
        "tipo": "familia",
        "etiqueta": "Madre biológica",
        "capitulo_minimo": 0,
        "descripcion": "Shilea da a luz a Cisco y Gil en San José tras haber viajado desde 1499.",
    },
    {
        "origen": "shilea",
        "destino": "gil",
        "tipo": "familia",
        "etiqueta": "Madre biológica",
        "capitulo_minimo": 0,
        "descripcion": "Shilea es la madre de Gil y le deja la carta sagrada en la Isla de Nicoya.",
    },
    {
        "origen": "cisco",
        "destino": "gil",
        "tipo": "familia",
        "etiqueta": "Hermanos gemelos",
        "capitulo_minimo": 0,
        "descripcion": "Nacidos con dos minutos de diferencia en 1990 (ojos azules y ojos amarillos) y reunidos en 1499 (Cap. 6).",
    },
    {
        "origen": "cisco",
        "destino": "nawa",
        "tipo": "alianza",
        "etiqueta": "Compañeros Jawa",
        "capitulo_minimo": 2,
        "descripcion": "Nawa salva a Cisco en la cascada y se convierte en su protectora y guía en 1499.",
    },
    {
        "origen": "don_paco",
        "destino": "nawa",
        "tipo": "familia_mentor",
        "etiqueta": "Maestro Jawa y padre adoptivo",
        "capitulo_minimo": 2,
        "descripcion": "El Jawa Paco acogió a Nawa de bebé en 1499 y la entrenó para recibir a Cisco.",
    },
    {
        "origen": "pipo_ramses",
        "destino": "cisco",
        "tipo": "mentor_aparente",
        "etiqueta": "Falso Mentor Jawa",
        "capitulo_minimo": 2,
        "capitulo_maximo": 4,
        "descripcion": "Pipo finge ser el aliado y mentor de Cisco en la aldea Diquís para que localice las gemas.",
    },
    {
        "origen": "cisco",
        "destino": "curre",
        "tipo": "alianza",
        "etiqueta": "Aliados del Valle",
        "capitulo_minimo": 4,
        "descripcion": "Cisco se gana el respeto del Rey Curré al sanar al jaguar y decirle la verdad sobre el futuro.",
    },
    {
        "origen": "cisco",
        "destino": "loky",
        "tipo": "vinculo_espiritual",
        "etiqueta": "Sanador y Guardián",
        "capitulo_minimo": 4,
        "descripcion": "Cisco extrae la Gema Roja infectada del lomo del jaguar y le da el nombre de Loky.",
    },
    {
        "origen": "nawa",
        "destino": "loky",
        "tipo": "vinculo_espiritual",
        "etiqueta": "Vínculo simbiótico de batalla",
        "capitulo_minimo": 5,
        "descripcion": "Nawa cura a Loky con hierbas medicinales y combaten juntos como una sola alma en el Templo del Sur y la playa.",
    },
    {
        "origen": "pipo_ramses",
        "destino": "cisco",
        "tipo": "conflicto",
        "etiqueta": "Traición y Bucle de Ramsés II",
        "capitulo_minimo": 5,
        "descripcion": "Pipo roba la Gema Roja y en el Cap. 8 revela ser el Faraón Ramsés II enfrentándose a los hermanos.",
    },
    {
        "origen": "pipo_ramses",
        "destino": "loky",
        "tipo": "conflicto",
        "etiqueta": "Herida de la Gema Roja",
        "capitulo_minimo": 5,
        "descripcion": "Pipo incrustó la Gema Roja en Loky; el jaguar le desgarra el brazo cuando intenta robarla.",
    },
    {
        "origen": "cristobal_colon",
        "destino": "gil",
        "tipo": "familia_mentor",
        "etiqueta": "Padre adoptivo en la expedición",
        "capitulo_minimo": 6,
        "descripcion": "El navegante del catalejo crió a Gil y viajó con él a 1499 mediante el Cubo Amarillo.",
    },
    {
        "origen": "cisco",
        "destino": "tamanco",
        "tipo": "alianza",
        "etiqueta": "Equipo del Templo del Norte",
        "capitulo_minimo": 6,
        "descripcion": "Tamanco guía a Cisco al volcán y derriba el torrente de agua subterránea para derrotar al Gólem.",
    },
    {
        "origen": "shilea",
        "destino": "nawa",
        "tipo": "familia",
        "etiqueta": "Madre biológica (Revelado en Cap. 7)",
        "capitulo_minimo": 7,
        "descripcion": "La carta de Nicoya revela que Shilea es la madre de Nawa, Cisco y Gil, y le dejó los aretes de jade.",
    },
    {
        "origen": "nawa",
        "destino": "gil",
        "tipo": "familia",
        "etiqueta": "Hermanos de sangre",
        "capitulo_minimo": 7,
        "descripcion": "Descubren en el Capítulo 7 que ambos, junto con Cisco, son hijos de Ditsowe Shilea.",
    },
    {
        "origen": "shilea",
        "destino": "dulcehe",
        "tipo": "familia",
        "etiqueta": "Hermanas (Linaje Biriteca)",
        "capitulo_minimo": 7,
        "descripcion": "Shilea encomienda a Gil buscar a su hermana Dulcehe La Biriteca en el Valle Central.",
    },
    {
        "origen": "curre",
        "destino": "chamanes",
        "tipo": "alianza",
        "etiqueta": "Reconciliación y Gema Naranja",
        "capitulo_minimo": 7,
        "descripcion": "Curré se inclina ante los Chamanes Cabécares pidiendo perdón y unifica a las cuatro tribus.",
    },
    {
        "origen": "don_paco",
        "destino": "cristobal_colon",
        "tipo": "manipulacion_temporal",
        "etiqueta": "Hipnosis en Las Vegas (1989)",
        "capitulo_minimo": 9,
        "descripcion": "Don Paco hipnotizó al navegante en 1989 para que creyera ser Colón y adelantara el viaje a 1499.",
    },
]


class BibliaPersonajes:
    def __init__(
        self,
        carpeta_destino: str | Path = "proyecto_proton/biblia_personajes",
        carpeta_saga: str | Path = "saga/personajes",
    ):
        self.carpeta_destino = Path(carpeta_destino)
        self.carpeta_saga = Path(carpeta_saga)

    def limpiar_carpeta(self) -> None:
        self.carpeta_destino.mkdir(parents=True, exist_ok=True)
        for archivo in self.carpeta_destino.glob("*.json"):
            if archivo.name != "indice.json":
                archivo.unlink()

    @staticmethod
    def _subcarpeta_categoria(categoria: str) -> str:
        cat = categoria.lower()
        if "principal" in cat:
            return "principales"
        if "grupo" in cat or "entidad" in cat:
            return "grupos_y_entidades"
        return "secundarios"

    def _renderizar_markdown_personaje(self, item: Dict) -> str:
        desc = item["descripcion"]
        attr = item["atributos"]
        stats = attr["estadisticas"]
        proy = item.get("proyeccion_saga", {})

        lineas = [
            f"# {item['nombre']}",
            "",
            f"- **ID Canon**: `{item['id']}`",
            f"- **Categoría**: {item['categoria']}",
            f"- **Facción**: {item['faccion']}",
            f"- **Color / Frecuencia**: {attr.get('color', 'N/A')} (`{attr.get('hex', '#ffffff')}`)",
            f"- **Primera aparición**: Capítulo {item['primera_aparicion']}",
            f"- **Capítulos donde interviene**: {', '.join(str(c) for c in item['capitulos_presente'])}",
            "",
            "---",
            "",
            "## 1. Perfil y Descripción Canon",
            "",
            f"- **Nombre completo**: {desc['nombre_completo']}",
            f"- **Alias / Títulos**: {desc['alias']}",
            f"- **Edad**: {desc['edad']}",
            f"- **Apariencia**: {desc['apariencia']}",
            f"- **Personalidad**: {desc['personalidad']}",
            f"- **Trasfondo**: {desc['trasfondo']}",
            f"- **Motivación**: {desc['motivacion']}",
            f"- **Habilidades**: {desc['habilidades']}",
            f"- **Arco en el Libro 1 (Canon)**: {desc['arco']}",
            f"- **Relaciones clave**: {desc['relaciones']}",
            "",
            "## 2. Atributos y Estadísticas",
            "",
            "| Fuerza | Inteligencia | Agilidad | Resistencia | Espíritu | Puntos de Salud |",
            "| :---: | :---: | :---: | :---: | :---: | :---: |",
            f"| {stats['fuerza']}/10 | {stats['inteligencia']}/10 | {stats['agilidad']}/10 | {stats['resistencia']}/10 | {stats['espiritu']}/10 | {attr['puntos_salud']} HP |",
            "",
            f"- **Características**: {', '.join(attr['caracteristicas'])}",
            f"- **Habilidades especiales**: {', '.join(attr['habilidades_especiales']) if attr['habilidades_especiales'] else 'Ninguna registrada'}",
            f"- **Poderes / Gemas vinculadas**: {', '.join(attr['poderes']) if attr['poderes'] else 'Ninguno directo'}",
            f"- **Funciones narrativas**: {', '.join(attr['funciones'])}",
            "",
            "## 3. Progresión sin Spoilers (Por Capítulo)",
            "",
        ]

        for etapa in item.get("evolucion_por_capitulo", []):
            lineas.extend(
                [
                    f"### Hasta el Capítulo {etapa['hasta_capitulo']} — *{etapa['rol_visible']}*",
                    f"- **Facción visible**: {etapa['faccion_visible']}",
                    f"- **Resumen**: {etapa['bio']}",
                    "",
                ]
            )

        lineas.extend(
            [
                "## 4. Proyección en la Trilogía (Saga Proyecto Protón)",
                "",
                f"- **Libro 1 (Proyecto Protón — CANON)**: {proy.get('libro_1_canon', 'Completado en el manuscrito canon.')}",
                f"- **Libro 2 (Continuación de la Saga)**: {proy.get('libro_2', 'Espacio reservado para desarrollo del Libro 2.')}",
                f"- **Libro 3 (Cierre de la Saga — 2033)**: {proy.get('libro_3', 'Espacio reservado para desarrollo del Libro 3.')}",
                "",
                "## 5. Notas del Autor y Apuntes de Lore",
                "",
            ]
        )
        for nota in item.get("notas", []):
            lineas.append(f"- {nota}")
        lineas.extend(
            [
                "- *(Espacio abierto para agregar transcripciones de apuntes a mano y bocetos del personaje)*",
                "",
            ]
        )
        return "\n".join(lineas)

    def generar_espacios_markdown(self) -> None:
        for sub in ("principales", "secundarios", "grupos_y_entidades"):
            (self.carpeta_saga / sub).mkdir(parents=True, exist_ok=True)

        lineas_indice = [
            "# Biblia y Espacio de Personajes — Saga Proyecto Protón",
            "",
            "Este directorio organiza las fichas de referencia de todos los personajes, grupos y entidades del **Libro 1 CANON (*Proyecto Protón*)** y su proyección hacia los **Libros 2 y 3** de la saga.",
            "",
            "## Estructura de Carpetas",
            "",
            "- [`principales/`](./principales/): Protagonistas y pilares del arco temporal (Cisco, Nawa, Gil y Don Paco).",
            "- [`secundarios/`](./secundarios/): Aliados clave, figuras históricas, mentores y antagonistas (Rey Curré, Droid, Loky, Pipo/Ramsés II, Shilea, Tamanco, Dr. Miranda, Obstetra Rodríguez, Cristóbal Colón, Dulcehe La Biriteca, Quepoa Corrohore).",
            "- [`grupos_y_entidades/`](./grupos_y_entidades/): Colectivos culturales y guardianes de los templos (Chamanes de las cuatro tribus, Tribu Diquís, Expedición Española, La Banshee, Guardián del Templo del Norte).",
            "",
            "## Catálogo Rápido de Personajes",
            "",
            "| Personaje | Categoría | Facción | 1ª Aparición | Color / Gema | Ficha |",
            "| :--- | :--- | :--- | :---: | :--- | :--- |",
        ]

        for item in PERSONAJES_SELECCIONADOS:
            sub = self._subcarpeta_categoria(item["categoria"])
            ruta_md = self.carpeta_saga / sub / f"{item['archivo']}.md"
            contenido_md = self._renderizar_markdown_personaje(item)
            ruta_md.write_text(contenido_md, encoding="utf-8")

            poderes = ", ".join(item["atributos"]["poderes"]) or item["atributos"]["color"]
            rel_link = f"`{sub}/{item['archivo']}.md`"
            lineas_indice.append(
                f"| **{item['nombre']}** | {item['categoria']} | {item['faccion']} | Cap. {item['primera_aparicion']} | {poderes} | [{rel_link}](./{sub}/{item['archivo']}.md) |"
            )

        lineas_indice.append("")
        (self.carpeta_saga / "INDICE_PERSONAJES.md").write_text("\n".join(lineas_indice), encoding="utf-8")

        # Sincronizar también la ficha de Jawa Pipo en Proyecto-Proton/Personajes/
        carpeta_legacy = Path("Proyecto-Proton/Personajes")
        if carpeta_legacy.exists():
            pipo = next((p for p in PERSONAJES_SELECCIONADOS if p["id"] == "pipo_ramses"), None)
            if pipo:
                (carpeta_legacy / "Jawa_Pipo.md").write_text(
                    self._renderizar_markdown_personaje(pipo), encoding="utf-8"
                )

    def generar(self) -> List[Dict]:
        self.limpiar_carpeta()
        personajes_creados: List[Dict] = []
        for item in PERSONAJES_SELECCIONADOS:
            archivo = self.carpeta_destino / f"{item['archivo']}.json"
            with open(archivo, "w", encoding="utf-8") as handle:
                json.dump(item, handle, ensure_ascii=False, indent=2)
            personajes_creados.append(
                {
                    "id": item["id"],
                    "nombre": item["nombre"],
                    "categoria": item["categoria"],
                    "faccion": item["faccion"],
                    "primera_aparicion": item["primera_aparicion"],
                    "archivo": archivo.name,
                }
            )

        indice = {
            "libro": "Proyecto Proton (Canon - Libro 1 de la Saga)",
            "cantidad": len(personajes_creados),
            "personajes": personajes_creados,
            "gemas": GEMAS_CANON,
            "relaciones": RELACIONES_CANON,
        }
        with open(self.carpeta_destino / "indice.json", "w", encoding="utf-8") as handle:
            json.dump(indice, handle, ensure_ascii=False, indent=2)

        self.generar_espacios_markdown()
        return personajes_creados


if __name__ == "__main__":
    biblia = BibliaPersonajes()
    personajes = biblia.generar()
    print(f"Se generaron {len(personajes)} fichas JSON y Markdown para la biblia de personajes.")
    print("Carpeta JSON:", biblia.carpeta_destino)
    print("Carpeta Saga Markdown:", biblia.carpeta_saga)
