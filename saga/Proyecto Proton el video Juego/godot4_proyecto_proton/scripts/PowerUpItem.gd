extends Area2D
class_name PowerUpItem
## Ítem emergente de los bloques rúnicos [?] al estilo Super Mario Bros:
## - "amber_mushroom": Semilla de Ámbar que camina por las plataformas y hace crecer a Cisco (Modo Super Protón 1.48x).
## - "blue_gem": Gema Azul del Diquís que desbloquea el disparo de Pulso Cuántico.

@export_enum("amber_mushroom", "blue_gem") var item_type: String = "amber_mushroom"
@export var move_speed: float = 65.0

var dir: int = 1
var emerging_timer: float = 0.35

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _physics_process(delta: float) -> void:
	if emerging_timer > 0.0:
		emerging_timer -= delta
		position.y -= 42.0 * delta
		return
	if item_type == "amber_mushroom":
		position.x += dir * move_speed * delta

func _on_body_entered(body: Node) -> void:
	if not body.is_in_group("player"):
		return
	if item_type == "amber_mushroom":
		GameState.activate_super_proton()
	elif item_type == "blue_gem":
		GameState.unlock_blue_gem()
	queue_free()
