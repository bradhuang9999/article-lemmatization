var epubUtil = (()=>{
  var thisUtil = {};
  
  var book = ePub();

  thisUtil.init = async function(bookFile) {
    book.open(bookFile);
  };
  
  /**
   * return array of all chapter text
   * @returns Array
   */
  thisUtil.getAllChapterText = async function() {
    //https://github.com/futurepress/epub.js/issues/659
    var chapterTextArr = [];
    var spine = await book.loaded.spine;
    for (const spineItem of spine.spineItems) {
        let chapterText = await thisUtil.getChapterText(spineItem);
        if(chapterText!==null && chapterText!=='') {
            chapterTextArr.push(chapterText);
        }
    }
    return chapterTextArr;
  }

  /**
   * return single chapter text
   * @param {*} spineItem 
   * @returns text
   */
  thisUtil.getChapterText = async function(spineItem) {
    var contentHtml = await spineItem.load(book.load.bind(book));
    var htmlBody = contentHtml.parentNode.body;
    if(htmlBody==null) {
        return null;
    }

    var chapterText = htmlBody.innerText.trim();//extract text start from body or might get metadata
    //chapterText = chapterText.replaceAll(`\\n`, '\n');
    if(chapterText==='') {
        return '';
    }

    return chapterText;
  }
  
  return thisUtil;
})();

export default epubUtil;