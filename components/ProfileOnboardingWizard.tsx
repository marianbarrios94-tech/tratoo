'use client'

import { useRef, useState } from 'react'
import type { VERTICALS } from '@/lib/constants/categories'

type Category = { id: string; slug: string; name: string; vertical: string }

export function ProfileOnboardingWizard({
  action,
  verticals,
  categoriesByVertical,
  provinces,
  defaults,
}: {
  action: (formData: FormData) => void
  verticals: readonly (typeof VERTICALS)[number][]
  categoriesByVertical: Map<string, Category[]>
  provinces: readonly string[]
  defaults: {
    businessName: string
    categoryId: string
    customProfession: string
    city: string
    province: string
    phone: string
  }
}) {
  const [step, setStep] = useState(1)
  const [stepError, setStepError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function goNext() {
    const data = new FormData(formRef.current!)
    if (step === 1) {
      if (!(data.get('business_name') as string)?.trim()) {
        setStepError('Contanos tu nombre o el de tu negocio')
        return
      }
      if (
        !(data.get('category_id') as string) &&
        !(data.get('custom_profession') as string)?.trim()
      ) {
        setStepError('Elegí una categoría o contanos tu profesión')
        return
      }
    }
    if (step === 2) {
      if (!(data.get('province') as string)) {
        setStepError('Elegí tu provincia')
        return
      }
    }
    setStepError('')
    setStep((s) => s + 1)
  }

  function goBack() {
    setStepError('')
    setStep((s) => s - 1)
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900'
  const labelClass = 'block text-sm font-medium'

  return (
    <form ref={formRef} action={action} className="flex max-w-lg flex-col gap-4">
      <div>
        <p className="text-sm text-zinc-500">Paso {step} de 3</p>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className={step === 1 ? 'flex flex-col gap-4' : 'hidden'}>
        <h2 className="text-lg font-semibold">¿Qué servicio ofrecés?</h2>
        <div>
          <label htmlFor="business_name" className={labelClass}>
            Nombre o marca
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            defaultValue={defaults.businessName}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="category_id" className={labelClass}>
            Categoría
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={defaults.categoryId}
            className={inputClass}
          >
            <option value="">Ninguna de estas</option>
            {verticals.map((v) => (
              <optgroup key={v.slug} label={v.label}>
                {categoriesByVertical.get(v.slug)?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="custom_profession" className={labelClass}>
            ¿Tu profesión no está en la lista?
          </label>
          <input
            id="custom_profession"
            name="custom_profession"
            type="text"
            placeholder="Ej: Profesor de inglés"
            defaultValue={defaults.customProfession}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Escribila acá y aparece tal cual en tu perfil. Necesitás elegir una categoría o
            completar esto.
          </p>
        </div>
      </div>

      <div className={step === 2 ? 'flex flex-col gap-4' : 'hidden'}>
        <h2 className="text-lg font-semibold">¿Dónde trabajás?</h2>
        <div>
          <label htmlFor="city" className={labelClass}>
            Ciudad
          </label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={defaults.city}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="province" className={labelClass}>
            Provincia
          </label>
          <select
            id="province"
            name="province"
            defaultValue={defaults.province}
            className={inputClass}
          >
            <option value="" disabled>
              Elegí tu provincia
            </option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={step === 3 ? 'flex flex-col gap-4' : 'hidden'}>
        <h2 className="text-lg font-semibold">¿Cómo pueden contactarte?</h2>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Teléfono (WhatsApp)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            defaultValue={defaults.phone}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Incluí el código de país. Solo lo ven los clientes cuya solicitud aceptaste.
          </p>
        </div>
      </div>

      {stepError && <p className="text-sm text-red-600 dark:text-red-400">{stepError}</p>}

      <div className="mt-2 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-zinc-300 px-5 py-2.5 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Atrás
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Siguiente
          </button>
        )}
        {step === 3 && (
          <button
            type="submit"
            className="rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Crear mi perfil
          </button>
        )}
      </div>
    </form>
  )
}
