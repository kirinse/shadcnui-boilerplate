import { useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-fetch"
import type { IAlbum } from "@/schema/album"

export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => apiFetch<{
      list: IAlbum[]
    }>("/api/albums"),
  })
}
