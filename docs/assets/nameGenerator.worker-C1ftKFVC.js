(function(){"use strict";var l=(n=>(n.START_WITH="START_WITH",n.END_WITH="END_WITH",n.CONTAIN="CONTAIN",n))(l||{}),m=(n=>(n[n.TWO=2]="TWO",n[n.THREE=3]="THREE",n))(m||{});self.onmessage=async n=>{const{kanjiInput:a,searchMode:r,charCount:p,strokeCounts:d}=n.data.searchParams,{kanjiDict:f,strokeGroupedKanji:y}=n.data.kanjiCache,u=a.reduce((i,e)=>i+f[e].stroke,0),s=a.join(""),g=new Set(n.data.excludedKanji.map(i=>i.character)),T=(p-a.length===1&&d.length>0?d.reduce((i,e)=>{const t=e-u;return t in y&&i.push(...y[t]),i},[]):Object.keys(f)).filter(i=>!g.has(i)).sort(()=>Math.random()-.5);T.length===0&&self.postMessage({type:"partial",results:[]});function*k(){if(p===m.TWO||a.length===2)for(const e of T){if(a.length===1&&e===a[0]||a.length===2&&(e===a[0]||e===a[1]))continue;const t=u+f[e].stroke;r===l.START_WITH?yield{name:s+e,totalStrokes:t}:r===l.END_WITH?yield{name:e+s,totalStrokes:t}:r===l.CONTAIN&&(yield{name:s+e,totalStrokes:t},yield{name:e+s,totalStrokes:t})}else for(const e of T)for(const t of T){const o=u+f[e].stroke+f[t].stroke;d.length>0&&!d.includes(o)||e===t||e===a[0]||t===a[0]||(r===l.START_WITH?(yield{name:s+e+t,totalStrokes:o},yield{name:s+t+e,totalStrokes:o}):r===l.END_WITH?(yield{name:e+t+s,totalStrokes:o},yield{name:t+e+s,totalStrokes:o}):r===l.CONTAIN&&(yield{name:s+e+t,totalStrokes:o},yield{name:s+t+e,totalStrokes:o},yield{name:e+t+s,totalStrokes:o},yield{name:t+e+s,totalStrokes:o},yield{name:e+s+t,totalStrokes:o},yield{name:t+s+e,totalStrokes:o}))}}const h=k(),j=100,I=10;let c=[];for(const i of h)console.log(i),c.push(i),c.length>=j&&(self.postMessage({type:"partial",results:c}),c=[],await new Promise(e=>setTimeout(e,I)));c.length>0&&self.postMessage({type:"partial",results:c}),self.postMessage({type:"complete"})}})();
