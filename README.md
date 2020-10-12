# coffee-ahk

## Toolkit

### type

```typescript
type Point = [number, number]
```

### basic

#### length(input: string | array | object): number

#### type(input: unknown): 'number' | 'object' | 'string'

### finder

#### findColor(color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation: number): Point

### getter

#### getColor(point?: Point): number

#### getPosition(): Point

#### getState(key: string): string

### other

#### now(): number

#### random(min: number = 0, max: number = 1): number

### setter

#### click(input?: string): void

#### move(point: Point, speed: number = 0): void

### speaker

#### alert(message: string): string

#### beep(): void

#### info(message: string, point?: Point): string

### string

#### replace(input: string, searchment: string, replacement: string, limit: number = -1): string

#### toLowerCase(input: string): string

#### toString(input: unknown): string

#### toUpperCase(input: string): string

#### trim(input: string, omitting: string): string

#### trimEnd(input: string, omitting: string): string

#### trimStart(input: string, omitting: string): string

### system

#### exit(): void

#### off(key: string, fn: string): void

#### on(key, string, fn: string): void

#### reload(): void

#### sleep(time: number): void

### timer

#### clearInterval(fn: string): void

#### clearTimeout(fn: string): void

#### setInterval(fn: string, time: number): void

#### setTimeout(fn, string, time: number): void

### math

#### abs(n: number): number
  
#### ceil(n: number): number

#### floor(n: number): number

#### round(n: number): number