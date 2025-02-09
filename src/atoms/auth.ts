import { atomWithStorage, createJSONStorage } from "jotai/utils"

export const authStorage = createJSONStorage(
  () => sessionStorage,
)

export const authTokenAtom = atomWithStorage<Record<string, any>>("auth", {}, authStorage, { getOnInit: true })
