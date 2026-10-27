import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { cardAspect, displayedImageSize, outputSize, sourceRect } from '../domain/crop.ts'

type ImageCropDialogProps = {
  src: string
  name: string
  type: string
  startingCrop?: Crop
  onCancel: () => void
  onConfirm: (src: string, crop: Crop) => void
}

function outputType(type: string) {
  if (type === 'image/png' || type === 'image/webp') return type
  return 'image/jpeg'
}

function windowCap() {
  return {
    width: Math.max(240, window.innerWidth - 64),
    height: Math.max(240, window.innerHeight - 210),
  }
}

function defaultCrop(width: number, height: number): Crop {
  return centerCrop(makeAspectCrop({ unit: '%', width: 72 }, cardAspect, width, height), width, height)
}

function usableCrop(crop: Crop | undefined): crop is Crop {
  return Boolean(crop && crop.width > 0 && crop.height > 0)
}

export function ImageCropDialog({ src, name, type, startingCrop, onCancel, onConfirm }: ImageCropDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [natural, setNatural] = useState({ width: 0, height: 0 })
  const [cap, setCap] = useState(windowCap)
  const [error, setError] = useState<string | null>(null)
  const [broken, setBroken] = useState(false)
  const display =
    natural.width > 0 ? displayedImageSize(natural.width, natural.height, cap.width, cap.height) : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.showModal()
  }, [])

  useEffect(() => {
    function onResize() {
      setCap(windowCap())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function applyCrop() {
    const photo = imageRef.current
    if (!photo || !crop || photo.naturalWidth === 0) return
    const rendered = { width: photo.clientWidth, height: photo.clientHeight }
    const pixel = convertToPixelCrop(crop, rendered.width, rendered.height)
    const mapped = sourceRect(pixel, rendered, { width: photo.naturalWidth, height: photo.naturalHeight })
    const x = Math.max(0, Math.min(mapped.x, photo.naturalWidth - 1))
    const y = Math.max(0, Math.min(mapped.y, photo.naturalHeight - 1))
    const width = Math.max(1, Math.min(mapped.width, photo.naturalWidth - x))
    const height = Math.max(1, Math.min(mapped.height, photo.naturalHeight - y))
    const size = outputSize(width, height)
    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    const context = canvas.getContext('2d')
    if (!context) {
      setError('Could not crop that image.')
      return
    }
    try {
      context.drawImage(photo, x, y, width, height, 0, 0, size.width, size.height)
    } catch {
      setError('Could not crop that image.')
      return
    }
    const cropped = canvas.toDataURL(outputType(type), 0.92)
    if (!cropped.startsWith('data:image/')) {
      setError('Could not crop that image.')
      return
    }
    onConfirm(cropped, crop)
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="crop-dialog"
      aria-labelledby="crop-image-title"
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
    >
      <h2 id="crop-image-title">Crop image</h2>
      <p>Drag the box to move it. Drag a corner to resize it. The box stays the shape of the card.</p>
      <p className="crop-dialog__name">{name}</p>
      {broken ? (
        <img
          src="/images/out-of-bounds.jpg"
          alt="Image out of bounds"
          style={displayedImageSize(896, 1200, cap.width, cap.height)}
        />
      ) : (
        <ReactCrop
          crop={crop}
          aspect={cardAspect}
          keepSelection
          minWidth={48}
          onChange={(_pixel, percent) => setCrop(percent)}
        >
          <img
            ref={imageRef}
            src={src}
            alt=""
            draggable={false}
            style={{
              width: display?.width,
              height: display?.height,
              maxWidth: cap.width,
              maxHeight: cap.height,
            }}
            onLoad={(event) => {
              const photo = event.currentTarget
              setNatural({ width: photo.naturalWidth, height: photo.naturalHeight })
              setCrop(
                (current) =>
                  current ?? (usableCrop(startingCrop) ? startingCrop : defaultCrop(photo.naturalWidth, photo.naturalHeight)),
              )
            }}
            onError={() => setBroken(true)}
          />
        </ReactCrop>
      )}
      {error ? <p className="field-error">{error}</p> : null}
      <div className="dialog__actions">
        <button type="button" className="btn btn-muted" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={applyCrop} disabled={!crop || broken}>
          Use photo
        </button>
      </div>
    </dialog>,
    document.body,
  )
}
