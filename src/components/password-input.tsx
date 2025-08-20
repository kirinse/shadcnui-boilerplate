import { Eye, EyeOff } from "lucide-react"
import * as React from "react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

function generatePassword(length = 10, includeUppercase = true, includeNumbers = true, includeSymbols = false) {
  let characters = "abcdefghijklmnopqrstuvwxyz"
  const reg = []
  reg.push(/[a-z]/)
  if (includeUppercase) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    reg.push(/[A-Z]/)
  }
  if (includeNumbers) {
    characters += "0123456789"
    reg.push(/\d/)
  }
  if (includeSymbols) {
    characters += "!@#$%^&*()_+[]{}|;:,.<>?"
    reg.push(/[!@#$%^&*()_+[\]{}|;:,.<>?]/)
  }

  for (; ;) {
    let password = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      password += characters.charAt(randomIndex)
    }
    if (reg.every((re) => re.test(password))) {
      return password
    }
  }
}

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const { setValue } = useFormContext()
    return (
      <div className={cn("relative rounded-md", className)}>
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled}
            className="size-6 rounded-md text-muted-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
          {!name?.startsWith("confirm_") && (
            <Button
              type="button"
              variant="link"
              size="icon"
              // disabled={disabled}
              className="rounded-md text-muted-foreground"
              onClick={() => {
                setValue(name!, generatePassword(), { shouldValidate: true, shouldDirty: true })
              }}
            >
              生成
            </Button>
          )}
        </div>
      </div>
    )
  },
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
