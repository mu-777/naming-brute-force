(function(){"use strict";self.onmessage=async()=>{try{const o=await(await fetch("/naming-brute-force/kanji.json")).json(),r={},e={};o.kanji.forEach(s=>{r[s.character]={stroke:s.stroke,linkpath:s.linkpath},e[s.stroke]||(e[s.stroke]=[]),e[s.stroke].push(s.character)}),self.postMessage({kanjiDict:r,strokeGroupedKanji:e})}catch(t){self.postMessage({error:t.message})}}})();
