extends Node
## Singleton Autoload (GameState)
## Gestiona los 4 personajes seleccionables (Don Paco, Cisco, Droid, Nawa),
## el temporizador de 240 minutos (14,400 s), las 100 monedas de oro por vida extra,
## la barra de energía (0-100%) para el Sword Combo, el estado del arma,
## el Trozo de la Gema Blanca (crystal-shard) y el rescate del bebé para subir al vehículo blanco.

signal character_changed(char_id: String)
signal super_proton_changed(is_super: bool)
signal weapon_foundChanged(has_weapon: bool)
signal energy_changed(energy: float)
signal coins_changed(coins: int, lives: int)
signal baby_rescued()
signal car_escape_started()

const PLAYABLE_CHARACTERS := ["cisco", "don_paco", "droid", "nawa"]

var selected_character_id: String = "cisco"
var remaining_seconds: float = 240.0 * 60.0 # 240 minutos
var score: int = 0
var gold_coins: int = 0
var lives: int = 3
var energy: float = 0.0
var has_weapon: bool = false
var is_super_proton: bool = false
var is_baby_saved: bool = false

func select_character(char_id: String) -> void:
	if char_id in PLAYABLE_CHARACTERS:
		selected_character_id = char_id
		emit_signal("character_changed", char_id)

func add_gold_coins(amount: int) -> void:
	gold_coins += amount
	score += amount * 25
	if gold_coins >= 100:
		var extra_lives := int(gold_coins / 100)
		gold_coins = gold_coins % 100
		lives += extra_lives
	emit_signal("coins_changed", gold_coins, lives)

func add_energy(amount: float) -> void:
	energy = clampf(energy + amount, 0.0, 100.0)
	emit_signal("energy_changed", energy)

func equip_weapon() -> void:
	has_weapon = true
	score += 400
	emit_signal("weapon_foundChanged", true)

func activate_white_gem_shard() -> void:
	is_super_proton = true
	score += 500
	emit_signal("super_proton_changed", true)

func solve_baby_puzzle() -> void:
	is_baby_saved = true
	score += 1000
	emit_signal("baby_rescued")
