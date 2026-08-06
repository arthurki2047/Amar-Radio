
"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useApp } from "@/context/app-context"
import type { Language } from "@/types"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languageOptions: { label: string; value: Language }[] = [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" },
    { label: "বাংলা", value: "bn" },
]

export function LanguageSwitcher() {
  const { setLanguage } = useApp()

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => (
            <DropdownMenuItem key={lang.value} onClick={() => handleLanguageChange(lang.value)}>
                <span>{lang.label}</span>
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
