/* Storm Emeralda M6: complete 113-print searchable index.
   Sources: public set metadata / TCGdex, verified names:
   https://limitlesstcg.com/cards/jp/M6
   https://exploretcgsets.com/pokemon/en-ja/sets/M6/
   This is metadata only; no artwork is stored locally. M6 image display uses remote image files hosted by TCG Journal, not a private API.
   Non-official English translations may differ from future TPCi names. */
(function(global){
'use strict';
const names=["Heracross","Surskit","Masquerain","Cacnea","Cacturne","Combee","Vespiquen","Wimpod","Mega Golisopod ex","Growlithe","Arcanine","Magmar","Magmortar","Torkoal","Heat Rotom ex","Heatmor","Mantine","Kyogre","Frillish","Jellicent","Wishiwashi ex","Electabuzz","Electivire","Raikou ex","Thundurus","Pincurchin","Wattrel","Kilowattrel","Drowzee","Hypno","Giratina","Golett","Mega Golurk ex","Enamorus","Sandshrew","Sandslash","Onix","Steelix","Groudon","Landorus","Nidoran♀","Nidorina","Nidoqueen","Spinarak","Ariados","Sableye","Inkay","Mega Malamar ex","Druddigon","Jangmo-o","Hakamo-o","Kommo-o","Cyclizar","Azurill","Swablu","Altaria","Kecleon","Mega Rayquaza ex","Tornadus","Fletchling","Fletchinder","Talonflame ex","Delicious Onigiri","Adventuring Lantern","Special Vest","Mega Rayquaza Cap","MC's Excitement","Aarune","Zinnia's Trust","Tate & Liza's Training","Legendary Ocean Trench","Legendary Ocean Trench","Legendary Summit","Legendary Summit","Legendary Lava Cave","Legendary Lava Cave","Masquerain","Growlithe","Magmortar","Kyogre","Electivire","Pincurchin","Enamorus","Groudon","Inkay","Azurill","Altaria","Kecleon","Mega Golisopod ex","Heat Rotom ex","Wishiwashi ex","Raikou ex","Mega Golurk ex","Mega Malamar ex","Mega Rayquaza ex","Talonflame ex","Adventuring Lantern","Special Vest","Pokémon Catcher","MC's Excitement","Aarune","Zinnia's Trust","Tate & Liza's Training","Growth Grass Energy","Nitro Fire Energy","Bubble Water Energy","Mega Golisopod ex","Raikou ex","Mega Golurk ex","Mega Rayquaza ex","Aarune","Zinnia's Trust","Mega Rayquaza ex"];
const jpTrainers={63:'おいしいおむすび',64:'ぼうけんのランタン',65:'とくちゅうチョッキ',66:'メガレックウザキャップ',67:'MCの盛り上げ',68:'ギリー',69:'ヒガナの信頼',70:'フウとランの修行',71:'伝説の海溝',72:'伝説の海溝',73:'伝説の山頂',74:'伝説の山頂',75:'伝説の溶岩洞',76:'伝説の溶岩洞',99:'ポケモンキャッチャー',104:'グロウ草エネルギー',105:'ニトロ炎エネルギー',106:'バブル水エネルギー'};
const aliases={
'Delicious Onigiri':['onigiri delicioso','bola de arroz deliciosa'],
'Adventuring Lantern':['linterna aventurera','linterna de aventura'],
'Special Vest':['chaleco especial'],
'Mega Rayquaza Cap':['gorra mega rayquaza'],
"MC's Excitement":['entusiasmo del presentador','entusiasmo del mc'],
'Aarune':['arún','arune','guille'],
"Zinnia's Trust":['confianza de zinnia'],
"Tate & Liza's Training":['entrenamiento de vito y leta','entrenamiento de tate y liza'],
'Legendary Ocean Trench':['fosa oceánica legendaria','fosa legendaria','trinchera legendaria','legendary trench'],
'Legendary Summit':['cima legendaria','cumbre legendaria'],
'Legendary Lava Cave':['cueva de lava legendaria'],
'Growth Grass Energy':['energia planta crecimiento','energia planta','grow grass energy'],
'Nitro Fire Energy':['energia fuego nitro','energia nitro'],
'Bubble Water Energy':['energia agua burbuja','energia burbuja'],
'Pokémon Catcher':['capturador pokemon','capturador pokémon'],
'Heat Rotom ex':['rotom calor ex','rotom de calor ex'],
'Mega Rayquaza ex':['mega rayquaza','レックウザ','メガレックウザ']};
const normalize=s=>String(s??'').normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase().replace(/[‐‑‒–—]/g,'-').trim();
function category(n){if(n>=104&&n<=106)return 'Energías';if((n>=63&&n<=76)||(n>=97&&n<=103)||n===111||n===112)return 'Entrenadores';return 'Pokémon'}
const cards=Object.freeze(names.map((name,i)=>{const number=i+1;const localId=String(number).padStart(3,'0');return Object.freeze({id:'jp:m6-'+localId,localId,name,category:category(number),japanese:true,setName:'Storm Emeralda (JP)',altNames:[...(aliases[name]||[]),...(jpTrainers[number]?[jpTrainers[number]]:[])],image:'https://tcgjournal.de/kartenbilder/tpc/M6/'+localId+'/low.webp',basic:false})}));
function find(q){const n=normalize(q);if(n.length<2)return [];if(['storm emeralda','esmeralda','delta reign','dominio delta','m6'].includes(n))return [...cards];return cards.filter(c=>[c.name,...c.altNames,c.localId].some(t=>normalize(t).includes(n)))}
const energyData=[
['Grass','Planta','🌿','#328b54','草'],['Fire','Fuego','🔥','#c8583b','炎'],['Water','Agua','💧','#3578c0','水'],['Lightning','Rayo','⚡','#b48a21','雷'],['Psychic','Psíquica','✦','#8457ac','超'],['Fighting','Lucha','✊','#a36b40','闘'],['Darkness','Oscuridad','☾','#41425d','悪'],['Metal','Metálica','⬡','#70818b','鋼']];
// Canonical SVE #001–008 card images; exact published JPEG URLs, one per basic energy.
// SVE 001–008: eight card-face images, confirmed individually on PokemonCard's public image CDN.
const energyImages=["https://images.pokemoncard.io/images/sve/sve-1.png","https://images.pokemoncard.io/images/sve/sve-2.png","https://images.pokemoncard.io/images/sve/sve-3.png","https://images.pokemoncard.io/images/sve/sve-4.png","https://images.pokemoncard.io/images/sve/sve-5.png","https://images.pokemoncard.io/images/sve/sve-6.png","https://images.pokemoncard.io/images/sve/sve-7.png","https://images.pokemoncard.io/images/sve/sve-8.png"];
// Alternative hosts are only attempted when the preferred card image fails to load.
const energyImageAlternates=[["https://assets.tcgdex.net/en/sv/sve/1/low.webp","https://archives.bulbagarden.net/media/upload/f/f0/BasicGrassEnergySVEEnergy1.jpg"],["https://assets.tcgdex.net/en/sv/sve/2/low.webp","https://archives.bulbagarden.net/media/upload/2/24/BasicFireEnergySVEEnergy2.jpg"],["https://assets.tcgdex.net/en/sv/sve/3/low.webp","https://archives.bulbagarden.net/media/upload/c/c2/BasicWaterEnergySVEEnergy3.jpg"],["https://assets.tcgdex.net/en/sv/sve/4/low.webp","https://archives.bulbagarden.net/media/upload/7/7b/BasicLightningEnergySVEEnergy4.jpg"],["https://assets.tcgdex.net/en/sv/sve/5/low.webp","https://archives.bulbagarden.net/media/upload/a/a6/BasicPsychicEnergySVEEnergy5.jpg"],["https://assets.tcgdex.net/en/sv/sve/6/low.webp","https://archives.bulbagarden.net/media/upload/8/84/BasicFightingEnergySVEEnergy6.jpg"],["https://assets.tcgdex.net/en/sv/sve/7/low.webp","https://archives.bulbagarden.net/media/upload/b/ba/BasicDarknessEnergySVEEnergy7.jpg"],["https://assets.tcgdex.net/en/sv/sve/8/low.webp","https://archives.bulbagarden.net/media/upload/8/82/BasicMetalEnergySVEEnergy8.jpg"]];
const basicEnergies=Object.freeze(energyData.map(([en,es,symbol,color,jp],i)=>Object.freeze({id:'basic-energy:'+en.toLowerCase(),name:en+' Energy',category:'Energías',setName:'Energía básica',localId:String(i+1).padStart(3,'0'),japanese:false,altNames:['Energía '+es,'Energia '+es,es+' Energy','Basic '+en+' Energy','Basic '+en, 'Basic '+en+' Energy',jp+'エネルギー'],color,symbol,basic:true,image:energyImages[i],imageAlternates:energyImageAlternates[i]})));
function findEnergies(q){const n=normalize(q);if(n.length<2)return [];const all=['energia','energias','energy','energies','energia basica','basic energy'];if(all.includes(n))return [...basicEnergies];return basicEnergies.filter(c=>[c.name,...c.altNames].some(x=>normalize(x).includes(n)))}
global.CronoM6={cards,find,findEnergies,basicEnergies,normalize};
})(window);
