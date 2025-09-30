import { ref } from 'vue';

const useCopyToClipboard = (() => {

  const copied = ref(false);

  const fallbackCopyText = (text) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  const copyText = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        fallbackCopyText(text)
      }
      copied.value = true
      setTimeout(() => (copied.value = false), 500)
    } catch (err) {
      console.error('Plain copy failed:', err)
      copied.value = false
    }
  }

  const fallbackCopyRich = (html) => {
    const el = document.createElement('div')
    el.innerHTML = html
    el.style.position = 'fixed'
    el.style.left = '-9999px'
    document.body.appendChild(el)

    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)

    document.execCommand('copy')
    document.body.removeChild(el)
  }

  const copyRich = async (html, plainText) => {
    try {
      if (navigator.clipboard?.write && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob(
              [plainText ?? html.replace(/<[^>]+>/g, '')],
              { type: 'text/plain' }
          ),
        })
        await navigator.clipboard.write([item])
      } else {
        fallbackCopyRich(html);
      }

      copied.value = true
      setTimeout(() => (copied.value = false), 500)
    } catch (err) {
      console.error('Rich copy failed:', err)
      copied.value = false
    }
  }

  return { copyText, copyRich, copied }
});

export default useCopyToClipboard;
