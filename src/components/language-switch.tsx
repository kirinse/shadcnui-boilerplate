import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { languages } from "@/i18n"

export const LanguageSwitch = () => {
  const { i18n, t } = useTranslation("common")

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const current_language = useMemo(() => {
    return languages.find((l) => l.value === i18n.resolvedLanguage)
  }, [i18n.resolvedLanguage])

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t("select_language")}>
          {current_language?.icon} {current_language?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.icon} {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
