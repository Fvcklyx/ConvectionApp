import { useState } from 'react'
import { Package } from 'lucide-react'

export default function ProductArtwork({ product }) {
  const [failedUrl, setFailedUrl] = useState(null)
  return product.image_url && failedUrl !== product.image_url
    ? <img className="store-product-photo" src={product.image_url} alt={product.name} loading="lazy" decoding="async" onError={() => setFailedUrl(product.image_url)} />
    : <><Package size={92} strokeWidth={1} aria-label="Ilustrasi kardus default" /><small>Ilustrasi produk</small></>
}
