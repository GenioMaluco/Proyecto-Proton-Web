extends CharacterBody2D
class_name MobEnemy
## Criaturas del Hospital Nocturno con IA Buscadora (Homing/Aggro):
## - "flyer": Criatura voladora que persigue la posición (x, y) del jugador.
## - "crawler": Criatura que se arrastra por el suelo acelerando hacia el jugador.
## - "hopper": Criatura que camina haciendo saltos hacia el jugador.
## - "boss": Guardián Espectral del Ala de Maternidad.

@export_enum("flyer", "crawler", "hopper", "boss") var mob_kind: String = "crawler"
@export var hp: int = 2
@export var aggro_range: float = 290.0

var jump_timer: float = 0.8
var gravity: float = 1120.0

func _physics_process(delta: float) -> void:
	var player := get_tree().get_first_node_in_group("player") as Node2D
	if player == null:
		return
	var dx := player.global_position.x - global_position.x
	var dir := 1.0 if dx >= 0.0 else -1.0
	var is_aggro := absf(dx) < aggro_range

	if mob_kind == "flyer":
		velocity.x = dir * (96.0 if is_aggro else 64.0)
		if is_aggro:
			velocity.y = (player.global_position.y - global_position.y) * 2.5
	elif mob_kind == "crawler":
		velocity.x = dir * (105.0 if is_aggro else 55.0)
	elif mob_kind in ["hopper", "boss"]:
		velocity.x = dir * (90.0 if is_aggro else 58.0)
		jump_timer -= delta
		if is_on_floor() and jump_timer <= 0.0:
			velocity.y = -320.0
			jump_timer = 1.15 if is_aggro else 1.8
		if not is_on_floor():
			velocity.y += gravity * delta

	move_and_slide()
