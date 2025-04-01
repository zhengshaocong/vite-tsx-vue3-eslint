export type ImageType = {
  date: string
  url: string
  width?: number
}

export type TrackItem = {
  date: string
  url: string
}

export type IocationData = {
  width: number
  scrollWidth: number
}

export type stageViewDataType = {
  [key: string]: {
    [one: string]: string[]
  }
}
