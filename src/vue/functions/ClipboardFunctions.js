const useCopyToClipboard = (() => {
  const copy = ((element) => {
    console.log(element);
    if (navigator.clipboard) {
      console.log('Copied using navigator clipboard');
      return navigator.clipboard.writeText(element.innerHtml);
    }
    console.log('Copied using exec command');
    window.getSelection().selectAllChildren(element);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    return true;
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
