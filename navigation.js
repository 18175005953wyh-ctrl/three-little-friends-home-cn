(function(root){
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function inside(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>p[1])!==(b[1]>p[1]))&&(p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]))c=!c}return c}
function segmentDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;const t=l?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l)):0;return dist(p,[a[0]+dx*t,a[1]+dy*t])}
function create(data){
 const n=data.nodes,e=data.edges;
 function walkable(p,floor){if(data.floors.some(f=>f.floor===floor&&inside(p,f.poly)))return true;return e.some(([u,v])=>n[u][2]===floor&&n[v][2]===floor&&segmentDistance(p,n[u],n[v])<=.85)}
 function visible(a,b,f){const steps=Math.ceil(dist(a,b)/.25);for(let i=0;i<=steps;i++){const t=steps?i/steps:0;if(!walkable([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],f))return false}return true}
 function route(start,goal){const nodes={...n,START:start,GOAL:goal};const links=e.map(x=>[...x]);for(const id of Object.keys(n)){if(n[id][2]===start[2]&&visible(start,n[id],start[2]))links.push(['START',id]);if(n[id][2]===goal[2]&&visible(goal,n[id],goal[2]))links.push([id,'GOAL'])}if(start[2]===goal[2]&&visible(start,goal,start[2]))links.push(['START','GOAL']);const costs={START:0},prev={},done=new Set();while(true){const u=Object.keys(costs).filter(x=>!done.has(x)).sort((a,b)=>costs[a]-costs[b])[0];if(!u)return null;if(u==='GOAL')break;done.add(u);for(const [a,b]of links){const v=a===u?b:b===u?a:null;if(!v)continue;const score=costs[u]+dist(nodes[u],nodes[v]);if(score<(costs[v]??Infinity)){costs[v]=score;prev[v]=u}}}const result=[];let at='GOAL';while(at!=='START'){result.unshift({id:at,p:nodes[at]});at=prev[at]}return result}
 return {walkable,visible,route,inside,dist};
}root.HomeNav={create,inside,dist};if(typeof module!=='undefined')module.exports=root.HomeNav;
})(typeof window!=='undefined'?window:globalThis);
