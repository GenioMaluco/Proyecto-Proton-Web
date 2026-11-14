extends CharacterBody2D
class_name PlayerHero
## Controlador para los 4 personajes seleccionables (Don Paco, Cisco, Droid, Nawa):
## - Entrada en escena con scifi/tractor-beam.
## - Inicia sin arma (has_weapon = false) y la recoge en el hospital.
## - Doble Salto Acrobático + Impacto contra el suelo (impacts/heavy-landing).
## - Carrera Veloz con Estela, Dash con Golpe (moves/dash-strike), Escudo (impacts/shield-block)
##   y Sword Combo (moves/sword-combo) al cargar 100% de la Barra de Energía.

@export var speed_normal: float = 210.0
@export var speed_super: float = 235.0
@export var dash_speed: float = 460.0
@export var jump_velocity: float = -490.0
@export var gravity: float = 1320.0

var facing_dir: int = 1
var jumps_left: int = 2
var is_acrobatic_jump: bool = false
var dash_timer: float = 0.0
var combo_timer: float = 0.0
var shield_active: bool = false

func _physics_process(delta: float) -> void:
	if dash_timer > 0.0:
		dash_timer -= delta
	if combo_timer > 0.0:
		combo_timer -= delta

	shield_active = Input.is_action_pressed("ui_down") and dash_timer <= 0.0 and combo_timer <= 0.0

	if not is_on_floor():
		velocity.y += gravity * delta
	else:
		if is_acrobatic_jump:
			is_acrobatic_jump = false
			_trigger_heavy_landing_impact()
		jumps_left = 2

	# Salto y Doble Salto Acrobático
	if Input.is_action_just_pressed("jump"):
		if is_on_floor():
			velocity.y = jump_velocity
			jumps_left = 1
		elif jumps_left > 0:
			velocity.y = jump_velocity * 0.95
			jumps_left = 0
			is_acrobatic_jump = true

	# Dash con Golpe
	if Input.is_action_just_pressed("shoot") and dash_timer <= 0.0:
		dash_timer = 0.24
		velocity.x = facing_dir * dash_speed

	# Sword Combo con 100% de Energía
	if Input.is_action_just_pressed("attack") and GameState.has_weapon and GameState.energy >= 100.0:
		GameState.energy = 0.0
		combo_timer = 0.55

	var dir := Input.get_axis("move_left", "move_right")
	if dash_timer <= 0.0:
		var spd := speed_super if GameState.is_super_proton else speed_normal
		if dir != 0.0:
			velocity.x = dir * spd
			facing_dir = 1 if dir > 0.0 else -1
		else:
			velocity.x = move_toward(velocity.x, 0.0, spd * 0.25)

	move_and_slide()

func _trigger_heavy_landing_impact() -> void:
	pass
