/**
 * Membaca file gambar dan mengubahnya menjadi data URL (base64)
 * dengan ukuran diperkecil agar hemat kuota localStorage.
 */
export function fileToResizedDataUrl(file, maxSize = 800, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar.'))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Gambar tidak dapat dibaca.'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('File tidak dapat dibaca.'))
    reader.readAsDataURL(file)
  })
}
