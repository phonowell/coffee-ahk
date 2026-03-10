global ℓm_ahk_1 := {"name": "test-config", "version": "1.0.0", "desc": "A config file", "enabled": true, "count": 42, "tags": ["tag1", "tag2", "tag3"], "nested": {"key": "value", "num": 123}, "items": ["apple", "banana", "cherry"], "extra1": "val1", "extra2": "val2", "extra3": "val3", "extra4": "val4", "default": {"name": "test-config", "version": "1.0.0", "desc": "A config file", "enabled": true, "count": 42, "tags": ["tag1", "tag2", "tag3"], "nested": {"key": "value", "num": 123}, "items": ["apple", "banana", "cherry"], "extra1": "val1", "extra2": "val2", "extra3": "val3", "extra4": "val4"}}
global config := ℓm_ahk_1.default
global count := ℓm_ahk_1.count
global name := ℓm_ahk_1.name
global version := ℓm_ahk_1.version
name := config.name
version := config.version
count := config.count