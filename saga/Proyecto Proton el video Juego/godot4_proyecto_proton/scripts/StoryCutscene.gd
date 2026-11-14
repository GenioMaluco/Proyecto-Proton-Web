extends CanvasLayer
class_name StoryCutscene
## Gestor de escenas de historia (Cutscenes) usando las ilustraciones oficiales
## de la página web (assets/img/capitulos/cap_00.jpg..cap_10.jpg y retratos).

signal cutscene_finished(sequence_id: String)

const SEQUENCES := {
	"intro": [
		{
			"chapter": "Cap. 1 — Una Noche de Tormenta (1995)",
			"speaker": "Francisco «Cisco» Miranda",
			"bg": "res://../../assets/img/capitulos/cap_01.jpg",
			"portrait": "res://../../assets/img/personajes/cisco.jpg",
			"text": "¡La tormenta eléctrica hizo estallar el reactor del laboratorio de papá! La esfera de piedra del Diquís está abriendo un vórtice..."
		},
		{
			"chapter": "Cap. 0 — El Legado de Ámbar",
			"speaker": "Doctor Miranda (Grabación)",
			"bg": "res://../../assets/img/capitulos/cap_00.jpg",
			"portrait": "res://../../assets/img/personajes/doctor_miranda.jpg",
			"text": "«Cisco, busca los bloques rúnicos [?]: la Semilla de Ámbar activará tu Modo Super Protón y la Gema Azul despertará tu Pulso Cuántico.»"
		}
	],
	"vortex": [
		{
			"chapter": "Cap. 2 — Un Nuevo Mundo",
			"speaker": "Droid",
			"bg": "res://../../assets/img/capitulos/cap_02.jpg",
			"portrait": "res://../../assets/img/personajes/droid.jpg",
			"text": "¡Anomalía cruzada! Hemos saltado de 1995 a la selva precolombina del Valle del Diquís. ¡Cuidado con el Guardián del Umbral!"
		}
	],
	"victory": [
		{
			"chapter": "Fin del Nivel 1-1 — Rumbo al Nivel 1-2",
			"speaker": "Protón (Don Paco)",
			"bg": "res://../../assets/img/capitulos/cap_10.jpg",
			"portrait": "res://../../assets/img/personajes/paco.jpg",
			"text": "¡Bien hecho, muchacho! Has purificado la primera Esfera del Mundo 1. Aún nos aguardan 8 Mundos y las 8 Gemas del Arcoíris."
		}
	]
}

var active_sequence: String = ""
var slide_index: int = 0

func play_sequence(seq_id: String) -> void:
	if not SEQUENCES.has(seq_id):
		return
	active_sequence = seq_id
	slide_index = 0
	visible = true
	get_tree().paused = true

func next_slide() -> void:
	var list: Array = SEQUENCES.get(active_sequence, [])
	slide_index += 1
	if slide_index >= list.size():
		visible = false
		get_tree().paused = false
		emit_signal("cutscene_finished", active_sequence)
