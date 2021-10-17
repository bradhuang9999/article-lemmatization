import tokenizer from '../libs/wink-tokenizer/browserify/wink-tokenizer.js';
import Lemmatizer from '../libs/javascript-lemmatizer/js/lemmatizer.js';

var langUtil = (()=>{
  var thisUtil = {};
    
  var myTokenizer = tokenizer();
  var lemmatizer = new Lemmatizer();

  thisUtil.articleToSentanceArr = function(article) {
    return article.match( /[^\.!\?]+[\.!\?]+/g );
  };

  thisUtil.articleToWordMap = function(chapterTextArr) {
    var wordInfoMap = {};
    for(let chapterText of chapterTextArr) {
      var sentenceArr = thisUtil.articleToSentanceArr(chapterText);
      console.log(chapterText);
      if(sentenceArr===null) {
        continue;
      }

      for (let sentence of sentenceArr) {
        sentence = sentence.trim()
        sentence = sentence.replaceAll(`\n`, ' ');//sentenct should not wraped
        sentence = sentence.replace(/[\s]+/s, ' ');//remove extra space
        var tokenArr = myTokenizer.tokenize(sentence);
        for(let tokenEle of tokenArr) {
          if(tokenEle.tag==='word') {
            let lemma = lemmatizer.only_lemmas(tokenEle.value.toLowerCase())[0];
            if(lemma===undefined) {
              continue;
            }
  
            if(wordInfoMap[lemma]===undefined) {
              wordInfoMap[lemma] = {sentenceArr:[], num:0};
            }
            
            wordInfoMap[lemma].num = wordInfoMap[lemma].num + 1;
            if(wordInfoMap[lemma].sentenceArr.length===0) {
              wordInfoMap[lemma].sentenceArr.push(sentence);
            }
            else if(wordInfoMap[lemma].sentenceArr.length===1 && wordInfoMap[lemma].sentenceArr[0] !== sentence) {//Can not duplicate
              wordInfoMap[lemma].sentenceArr.push(sentence);
            }
          }
        }
      }
    }
    

    return wordInfoMap;
  };
  
  return thisUtil
})();

export default langUtil;