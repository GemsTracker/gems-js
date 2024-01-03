const useCopyToClipboard = (() => {

  const fallbackCopyTextToClipboard = ((text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log(`Fallback: Copying text command was ${msg}`);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  });

  const copy = ((element) => {
    console.log(element);
    console.log(navigator.clipboard);
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(element.innerHTML);
      return;
    }

    navigator.clipboard.writeText(element.innerHTML).then(() => {
      console.log('Copied using navigator clipboard');
    }, (err) => {
      console.error('navigator clipboard could not copy text: ', err);

      // Try the fallback
      fallbackCopyTextToClipboard(element.innerHTML);
    });
  });

  const copyValueToClipboard = ((element) => {
    console.log(element);
    if (element) {
      console.log('HI!');
      console.log(element);
      copy(element);
    }
  });

  return {
    copyValueToClipboard,
  };
});

export default useCopyToClipboard;
