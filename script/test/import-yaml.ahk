global ℓm_ahk_1 := {"name": "yaml-config", "enabled": true, "count": 7, "default": {"name": "yaml-config", "enabled": true, "count": 7}}
global config := ℓm_ahk_1.default
global count := ℓm_ahk_1.count
global enabled := ℓm_ahk_1.enabled
global name := ℓm_ahk_1.name
name := config.name
count := config.count
enabled := config.enabled