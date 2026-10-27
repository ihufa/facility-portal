import { useEffect, useId, useRef, useState } from 'react'
import type { Crop } from 'react-image-crop'
import { imageFileError } from '../domain/schema.ts'
import { CourseImage } from './CourseImage.tsx'
import { CloudIcon, PencilIcon } from './icons.tsx'
import { ImageCropDialog } from './ImageCropDialog.tsx'

function imageType(src: string) {
  if (src.startsWith('data:image/png') || src.endsWith('.png')) return 'image/png'
  if (src.startsWith('data:image/webp') || src.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

export type CourseImageValue = {
  src: string | null
  name: string | null
}

type ImageSource = {
  url: string
  type: string
}

type PendingImage = {
  url: string
  name: string
  type: string
}

type ImageFieldProps = {
  value: CourseImageValue
  onChange: (value: CourseImageValue) => void
  error?: string | null
}

function isBlob(url: string) {
  return url.startsWith('blob:')
}

export function ImageField({ value, onChange, error: formError = null }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const sourceRef = useRef<ImageSource | null>(
    value.src ? { url: value.src, type: imageType(value.src) } : null,
  )
  const pendingRef = useRef<PendingImage | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [pending, setPending] = useState<PendingImage | null>(null)
  const [cropRect, setCropRect] = useState<Crop | null>(null)
  const errorId = useId()
  const error = fileError ?? formError
  const hasImage = Boolean(value.src && value.name)
  pendingRef.current = pending

  useEffect(() => {
    return () => {
      const sourceUrl = sourceRef.current?.url
      const pendingUrl = pendingRef.current?.url
      if (pendingUrl && pendingUrl !== sourceUrl && isBlob(pendingUrl)) URL.revokeObjectURL(pendingUrl)
      if (sourceUrl && isBlob(sourceUrl)) URL.revokeObjectURL(sourceUrl)
    }
  }, [])

  function releasePending(current: PendingImage | null) {
    if (current && current.url !== sourceRef.current?.url && isBlob(current.url)) URL.revokeObjectURL(current.url)
  }

  function takeFile(file: File | undefined) {
    if (!file) return
    const message = imageFileError(file)
    if (message) {
      setFileError(message)
      return
    }
    setFileError(null)
    const url = URL.createObjectURL(file)
    setPending((current) => {
      releasePending(current)
      return { url, name: file.name, type: file.type || 'image/jpeg' }
    })
  }

  function closeCrop() {
    setPending((current) => {
      releasePending(current)
      return null
    })
  }

  function recrop() {
    const source = sourceRef.current
    if (!source || !value.name) return
    setPending({ url: source.url, name: value.name, type: source.type })
  }

  function openPicker() {
    inputRef.current?.click()
  }

  return (
    <div className={error ? 'field is-invalid' : 'field'}>
      <span className="section-title" id="course-image-label">
        Image
        <span aria-hidden="true">*</span>
      </span>
      <div
        className={[
          hasImage ? 'file-row' : 'dropzone',
          active ? 'is-active' : '',
          error ? 'is-invalid' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragEnter={(event) => {
          event.preventDefault()
          setActive(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setActive(true)
        }}
        onDragLeave={() => setActive(false)}
        onDrop={(event) => {
          event.preventDefault()
          setActive(false)
          void takeFile(event.dataTransfer.files[0])
        }}
      >
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          aria-labelledby="course-image-label"
          aria-describedby={error ? errorId : undefined}
          tabIndex={-1}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            void takeFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
        {hasImage ? (
          <>
            {value.src ? (
              <button type="button" className="file-row__thumb" aria-label="Crop image" onClick={recrop}>
                <CourseImage src={value.src} alt="" />
              </button>
            ) : null}
            <button type="button" className="file-row__name" onClick={recrop}>
              {value.name}
            </button>
            <button type="button" className="icon-btn" aria-label="Replace image" onClick={openPicker}>
              <PencilIcon />
            </button>
          </>
        ) : (
          <button type="button" className="dropzone__prompt" onClick={openPicker}>
            <CloudIcon />
            <strong>Drag & Drop</strong>
            <span>Drag & drop or click to browse. JPG, PNG, or WebP.</span>
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
      {pending ? (
        <ImageCropDialog
          src={pending.url}
          name={pending.name}
          type={pending.type}
          startingCrop={pending.url === sourceRef.current?.url ? (cropRect ?? undefined) : undefined}
          onCancel={closeCrop}
          onConfirm={(src, crop) => {
            const previous = sourceRef.current
            if (previous && previous.url !== pending.url && isBlob(previous.url)) URL.revokeObjectURL(previous.url)
            sourceRef.current = { url: pending.url, type: pending.type }
            setCropRect(crop)
            onChange({ src, name: pending.name })
            setPending(null)
          }}
        />
      ) : null}
    </div>
  )
}
