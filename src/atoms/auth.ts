import { atomWithStorage } from "jotai/utils"

export const authTokenAtom = atomWithStorage<string>("token", "", sessionStorage)
