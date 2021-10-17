$('btn-need-login').hide();
$(document).ready(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      reg.installing; // the installing worker, or undefined
      reg.waiting; // the waiting worker, or undefined
      reg.active; // the active worker, or undefined
    
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          msgUtil.showInfo('newWorker.state:'+newWorker.state);
        });
      });
    });
  }

  registerHandleBarHelper();
  registerEvent();
  
});

function registerHandleBarHelper() {
  Handlebars.registerHelper('eq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });
}

function registerEvent() {  
  document.getElementById("btnExtract").onclick = articleToLemma;
  document.getElementById("inputFile").onchange = articleToLemma;
}

import langUtil from './langUtil.js';
import epubUtil from './epubUtil.js';
async function articleToLemma(e) {
  var bookFile = document.getElementById("inputFile").files[0];
  epubUtil.init(bookFile);

  var chapterTextArr = await epubUtil.getAllChapterText();
  let wordMap = langUtil.articleToWordMap(chapterTextArr);
  wordMapToXlsx(wordMap);
}

function wordMapToXlsx(wordMap) {
  var wordSheetDataArr = [];
  //wordSheetDataArr.push(['Word', 'Sentenct', 'num']);
  for(let word in wordMap) {
    let wordInfo = wordMap[word];
    wordSheetDataArr.push([word, wordInfo.sentenceArr.join('\n'), wordInfo.num]);
  }

  wordSheetDataArr.sort((a,b) => (a[2] > b[2]) ? -1 : ((b[2] > a[2]) ? 1 : 0))
  wordSheetDataArr.unshift(['Word', 'Sentenct', 'num']);

  var workbook = XLSX.utils.book_new();
  var sheet = XLSX.utils.aoa_to_sheet(wordSheetDataArr);
  workbook.SheetNames.push('VOC');
  workbook.Sheets["VOC"] = sheet;
  XLSX.writeFile(workbook, "VOC.xlsx");
}