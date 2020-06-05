export default {
  resizeCrop(src, width, height) {
    const crop = width === 0 || height === 0

    if (src.width <= width && height === 0) {
      width = src.width
      height = src.height
    }

    if (src.width > width && height === 0) {
      height = src.height * (width / src.width)
    }

    const xscale = width / src.width
    const yscale = height / src.height
    const scale = crop ? Math.min(xscale, yscale) : Math.max(xscale, yscale)

    const canvas = document.createElement('canvas')
    canvas.width = width ? width : Math.round(src.width * scale)
    canvas.height = height ? height : Math.round(src.height * scale)
    canvas.getContext('2d').scale(scale, scale)

    canvas.getContext('2d').drawImage(src, ((src.width * scale) - canvas.width) * -.5, ((src.height * scale) - canvas.height) * -.5)
    return canvas
  },
  createObjectURL(i) {
    const URL = window.URL || window.webkitURL || window.mozURL || window.msURL
    return URL.createObjectURL(i)
  },
  dataURItoBlob(dataURI) {
    // doesn't handle URLEncoded DataURIs
    const byteString = atob(dataURI.split(',')[1])

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab])
  }
}
