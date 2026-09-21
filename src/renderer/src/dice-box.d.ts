declare module '@3d-dice/dice-box' {
  interface DiceBoxOptions {
    container: string
    assetPath: string
    theme?: string
    themeColor?: string
    scale?: number
    gravity?: number
    [key: string]: unknown
  }

  interface DieResult {
    sides: number
    value: number
    groupId: number
    rollId: number
  }

  interface RollResultGroup {
    sides: number
    qty: number
    value: number
    rolls: DieResult[]
  }

  export default class DiceBox {
    constructor(options: DiceBoxOptions)
    init(): Promise<void>
    roll(notation: string): Promise<RollResultGroup[]>
    clear(): void
    onRollComplete?: (results: RollResultGroup[]) => void
  }
}
