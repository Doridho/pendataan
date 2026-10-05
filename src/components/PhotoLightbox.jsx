export default function PhotoLightbox({ src, onClose }) {
  if (!src) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <img
        src={src}
        alt="Bukti foto laporan"
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
