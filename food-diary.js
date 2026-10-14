/* Food diary v2: estimates from a local food list; never transmits personal logs. */
(function () {
  'use strict';
  // Values are approximate per reference serving, not nutrition-label guarantees.
  // Format: [display name, aliases, serving grams/ml, kcal, protein g, carbs g, fat g, serving unit, grams per cup (optional)]
  const FOOD = [
    ['Cooked white rice',['white rice','cooked rice','rice'],158,205,4.3,44.5,0.4,'cup',158],
    ['Brown rice',['brown rice'],195,216,5,45,1.8,'cup',195],
    ['Fried rice',['fried rice'],250,450,13,65,15,'plate',180],
    ['Chicken fried rice',['chicken fried rice'],300,540,24,75,17,'plate',180],
    ['Biryani',['chicken biryani','biryani','biriyani'],300,530,23,68,18,'plate',180],
    ['Grilled chicken breast',['grilled chicken breast','chicken breast','grilled chicken','roasted chicken'],150,248,46.5,0,5.4,'serving'],
    ['Fried chicken',['fried chicken','chicken strips'],150,390,34,17,21,'serving'],
    ['Chicken curry',['chicken curry','kukulhu riha','chicken riha'],200,340,28,10,20,'serving'],
    ['Chicken thigh',['chicken thigh'],150,315,39,0,17,'serving'],
    ['Chicken sandwich',['chicken sandwich'],180,365,24,37,13,'sandwich'],
    ['Chicken wrap',['chicken wrap'],220,440,30,46,15,'wrap'],
    ['Chicken burger',['chicken burger','chicken sandwich burger'],200,470,25,44,21,'burger'],
    ['Beef burger',['beef burger','hamburger','burger'],220,510,27,43,25,'burger'],
    ['Grilled fish',['grilled fish','fihunu mas','baked fish'],150,200,35,0,6,'serving'],
    ['Fish curry',['fish curry','mas riha'],200,250,27,8,12,'serving'],
    ['Garudhiya',['garudhiya','fish broth'],250,100,19,2,1,'bowl',250],
    ['Canned tuna in water',['canned tuna','tuna in water','tuna'],120,139,31,0,1.2,'can'],
    ['Mas huni',['mas huni','mashuni'],100,195,15,6,12,'serving',180],
    ['Roshi',['roshi','roti','flatbread'],65,160,4,29,3.5,'piece'],
    ['Chapati',['chapati','chappati'],45,120,3.5,22,2.5,'piece'],
    ['Paratha',['paratha','parotta'],85,260,5,34,11,'piece'],
    ['Masroshi',['masroshi','mas roshi'],120,280,12,32,10,'piece'],
    ['Bajiya',['bajiya','bajia'],55,135,4,17,6,'piece'],
    ['Gulha',['gulha'],35,90,4,11,3.5,'piece'],
    ['Kulhi boakibaa',['kulhi boakibaa','boakibaa'],100,240,13,24,10,'piece'],
    ['Bis keemiya',['bis keemiya','keemiya'],85,200,7,24,8,'piece'],
    ['Samosa',['samosa'],90,240,5,28,12,'piece'],
    ['Pasta cooked',['cooked pasta','plain pasta','pasta'],180,285,10,56,2,'cup',140],
    ['Pasta with sauce',['spaghetti bolognese','pasta bolognese','pasta with sauce'],300,500,22,62,18,'plate'],
    ['Instant noodles',['instant noodles','ramen','noodles'],85,380,9,53,15,'packet'],
    ['Vegetable curry',['vegetable curry','mixed veg curry'],200,220,6,24,12,'serving'],
    ['Dhal curry',['dhal curry','dal curry','lentil curry','dhal','dal'],180,225,12,29,6,'bowl'],
    ['Potato curry',['potato curry'],200,250,5,35,10,'serving'],
    ['Boiled potato',['boiled potato','potato'],150,130,3,30,0.2,'serving'],
    ['French fries',['french fries','fries','chips'],120,365,4,48,18,'serving'],
    ['Boiled egg',['boiled egg','egg','eggs'],50,78,6.3,0.6,5.3,'piece'],
    ['Scrambled eggs',['scrambled eggs'],120,210,14,3,16,'serving'],
    ['Bread',['bread slice','sliced bread','bread','toast'],32,85,3,15,1.2,'slice'],
    ['Oats',['oatmeal','rolled oats','oats'],40,152,5,27,3,'serving',80],
    ['Greek yogurt',['greek yogurt','greek yoghurt'],170,120,17,6,3,'cup',225],
    ['Plain yogurt',['plain yogurt','yoghurt','yogurt'],170,115,7,11,4,'cup',245],
    ['Milk',['whole milk','full fat milk','milk'],250,155,8,12,8,'glass',250],
    ['Skim milk',['skim milk','low fat milk'],250,90,9,13,0.2,'glass',250],
    ['Whey protein',['protein shake','whey protein','protein powder','whey'],30,120,24,3,2,'scoop'],
    ['Banana',['banana','bananas'],118,105,1.3,27,0.4,'piece'],
    ['Apple',['apple','apples'],180,95,0.5,25,0.3,'piece'],
    ['Orange',['orange'],130,62,1.2,15.4,0.2,'piece'],
    ['Dates',['dates','date fruit'],24,67,0.5,18,0.1,'piece'],
    ['Watermelon',['watermelon'],150,45,1,11,0.2,'cup',150],
    ['Mango',['mango'],165,100,1.4,25,0.6,'cup',165],
    ['Salad',['green salad','vegetable salad','salad'],100,35,2,7,0.4,'bowl',100],
    ['Cooked vegetables',['vegetables','mixed vegetables','veggies'],150,75,4,13,1,'serving',150],
    ['Peanut butter',['peanut butter'],16,95,4,3.5,8,'tablespoon'],
    ['Cooking oil',['olive oil','coconut oil','cooking oil','oil'],14,120,0,0,14,'tablespoon'],
    ['Butter',['butter'],14,100,0.1,0,11,'tablespoon'],
    ['Sugar',['white sugar','sugar'],4,16,0,4,0,'teaspoon'],
    ['Mayonnaise',['mayonnaise','mayo'],14,95,0,0.1,10,'tablespoon'],
    ['Cheese',['cheddar cheese','cheese'],28,110,7,0.5,9,'slice'],
    ['Black coffee',['black coffee','americano','espresso','coffee without sugar'],240,3,0,0,0,'cup',240],
    ['Coffee with milk',['latte','cappuccino','milk coffee','coffee with milk'],250,130,7,13,5,'cup',250],
    ['Sweetened tea',['milk tea','tea with milk','sweet tea'],250,110,4,16,3,'cup',250],
    ['Plain tea',['black tea','green tea','plain tea','tea'],250,2,0,0,0,'cup',250],
    ['Orange juice',['orange juice','fruit juice','juice'],250,112,1,26,0,'glass',250],
    ['Soft drink',['coca cola','coke','pepsi','soda','soft drink'],330,139,0,35,0,'can',240],
    ['Diet soda',['diet coke','coke zero','pepsi max','diet soda'],330,1,0,0,0,'can',240],
    ['Chocolate',['chocolate'],40,215,3,23,13,'bar'],
    ['Biscuits',['biscuits','cookies','cookie'],30,145,2,20,6.5,'serving'],
    ['Cake',['cake'],100,350,5,48,15,'slice'],
    ['Pizza',['pizza'],110,285,12,36,11,'slice'],
    ['Water',['water'],250,0,0,0,0,'glass',250]
  ];
  // Longest aliases first, so "chicken fried rice" wins over "rice".
  const MATCHES = FOOD.flatMap((row,i)=>row[1].map(alias=>({alias,food:row,i}))).sort((a,b)=>b.alias.length-a.alias.length);
  const style=document.createElement('style');
  style.textContent=`
    .food-card{border-color:#3c6255}.food-header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .food-total{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:13px 0}
    .food-stat{background:#1f3042;padding:12px;border-radius:12px}.food-stat strong{display:block;font-size:1.25rem;margin-top:4px}
    .food-stat small{font-size:.76rem}.food-card textarea{resize:vertical}
    .food-msg{margin:8px 0;padding:11px;border-radius:10px;background:#253446;color:#d5e2f0;font-size:.87rem;line-height:1.4}
    .food-warn{background:#463622;color:#ffe3b3}.food-part{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid #314257;padding:7px 0;font-size:.89rem}
    .food-entry{border-bottom:1px solid #324057;padding:12px 0}.food-entry:last-child{border-bottom:0}
    .food-entryhead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.food-entryhead span{font-size:.79rem;color:#acc4d3}
    .food-entry p{margin:6px 0 8px;overflow-wrap:anywhere}.food-entry-actions{display:flex;gap:7px;justify-content:flex-end}
    .food-entry-actions button{padding:8px 11px;font-size:.81rem}
    .food-card [hidden]{display:none!important}.food-mini{font-size:.79rem;line-height:1.5;color:#b4c4d5}
    .food-edit{background:#253e59;border-radius:10px;padding:12px;margin-top:10px}
    @media(max-width:520px){.food-total{gap:5px}.food-stat{padding:9px}.food-stat strong{font-size:1.05rem}}
  `;
  document.head.appendChild(style);
  const card=document.createElement('section');card.className='card food-card';
  card.innerHTML=`
    <div class="food-header"><h2 style="margin:0">🍽️ Food diary</h2><span class="pill">Write it. Estimate it. Log it.</span></div>
    <p class="food-mini">Enter what you ate. Calories and macros are estimated from an offline list of common foods, including Maldivian meals. Confirm portions and edit estimates if needed.</p>
    <p id="foodDateLabel" class="food-mini"></p>
    <div class="food-total">
      <div class="food-stat"><small>Calories today</small><strong id="foodTotalCal">0 / 2,000</strong></div>
      <div class="food-stat"><small>Protein today</small><strong id="foodTotalPro">0 / 170 g</strong></div>
      <div class="food-stat"><small>Remaining</small><strong id="foodRemaining">2,000</strong></div>
    </div>
    <div class="progress"><div id="foodBar" style="width:0%"></div></div>
    <label for="foodMeal">Meal</label>
    <select id="foodMeal"><option>First meal</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Drink</option></select>
    <label for="foodText">What did you eat?</label>
    <textarea id="foodText" rows="3" maxlength="600" placeholder="e.g. 2 roshi, 100g mas huni and 1 cup black coffee"></textarea>
    <p class="food-mini">Tips: Use quantities like “1 cup rice, 150g grilled chicken, 1 tsp oil”. Include drinks, sugar and sauces. Commas or “and” separate foods.</p>
    <button id="foodEstimate" type="button">Estimate calories & protein</button>
    <div id="foodPreview" hidden>
      <div id="foodParts" style="margin-top:12px"></div>
      <div id="foodAlert" class="food-msg" hidden></div>
      <div class="food-edit">
        <strong>Review estimate before logging</strong>
        <div class="two"><div><label for="foodKcal">Calories (kcal)</label><input id="foodKcal" type="number" min="0" max="5000" step="1"></div>
        <div><label for="foodProtein">Protein (g)</label><input id="foodProtein" type="number" min="0" max="500" step="0.1"></div></div>
        <div class="two"><div><label for="foodCarbs">Carbs (g)</label><input id="foodCarbs" type="number" min="0" max="800" step="0.1"></div>
        <div><label for="foodFat">Fat (g)</label><input id="foodFat" type="number" min="0" max="400" step="0.1"></div></div>
        <div class="row" style="margin-top:12px"><button type="button" id="foodAdd">Save food entry</button><button type="button" class="secondary" id="foodCancel">Cancel</button></div>
      </div>
    </div>
    <div style="margin-top:18px"><strong>Logged meals</strong><div id="foodEntries"></div></div>
    <div class="food-msg">Food nutrition is an estimate, not a precise measurement or an AI analysis. Restaurant portions, oils and homemade recipes can vary substantially. Foods not recognized are <strong>excluded</strong> from the automatic total until you adjust it.</div>
  `;
  document.querySelector('#date').closest('.card').after(card);
  const el=id=>document.getElementById(id);
  let editing=null,estimation=null;
  function safeNumber(v){let n=Number(v);return Number.isFinite(n)?n:0}
  function round1(n){return Math.round(n*10)/10}
  function numberFromWord(s){if(!s)return 1;let words={half:.5,one:1,two:2,three:3,four:4,five:5}; if(words[s.toLowerCase()]!==undefined)return words[s.toLowerCase()];if(s.includes('/')){let parts=s.split('/');return Number(parts[0])/Number(parts[1])}return Number(s)}
  function matchFood(segment){const lower=segment.toLowerCase();return MATCHES.find(x=>new RegExp('(^|[^a-z])'+x.alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z])','i').test(lower))}
  function portion(segment,found){
    const row=found.food,unit=row[7],g=row[2];
    const s=segment.toLowerCase().replace(/(\d)(g|kg|ml)\b/g,'$1 $2');
    const qty=s.match(/(?:^|\s)(\d+(?:\.\d+)?|\d+\s*\/\s*\d+|half|one|two|three|four|five)\s*(kilograms?|kg|grams?|g|millilit(?:er|re)s?|ml|cups?|tablespoons?|tbsp|teaspoons?|tsp|pieces?|pcs?|slices?|bowls?|plates?|scoops?|cans?|packets?|servings?|glasses?|bars?|wraps?|burgers?|sandwiches?)?\b/i);
    if(!qty)return {factor:1,description:'1 '+unit};
    const n=numberFromWord(qty[1].replace(/\s/g,''));if(!Number.isFinite(n)||n<=0||n>1000)return {factor:1,description:'1 '+unit};
    const u=(qty[2]||unit).toLowerCase();let grams=null;
    if(/^(g|gram)/.test(u))grams=n;
    else if(/^(kg|kilogram)/.test(u))grams=n*1000;
    else if(/^(ml|milliliter|millilitre)/.test(u))grams=n;
    else if(/^(cup)/.test(u))grams=n*(row[8]||170);
    else if(/^(glass)/.test(u))grams=n*(row[8]||250);
    else if(/^(tbsp|tablespoon)/.test(u))grams=n*(row[0]==='Cooking oil'?14:row[0]==='Sugar'?12:15);
    else if(/^(tsp|teaspoon)/.test(u))grams=n*(row[0]==='Cooking oil'?4.7:row[0]==='Sugar'?4:5);
    else if(/^(bowl)/.test(u))grams=n*(row[8]||250);
    else if(/^(plate)/.test(u))grams=n*(row[8]||300);
    else if(/^(scoop)/.test(u))grams=n*(row[0]==='Whey protein'?30:g);
    else if(/^(piece|pcs|slice|can|packet|serving|bar|wrap|burger|sandwich)/.test(u))grams=n*g;
    else grams=n*g;
    return {factor:grams/g,description:`${qty[1]} ${qty[2]||unit}`};
  }
  function estimate(text){
    const parts=text.trim().split(/\s*(?:,|;|\+|\n|\band\b|\bwith\b)\s*/i).map(x=>x.trim()).filter(Boolean);
    const hits=[],misses=[];
    for(const part of parts){const found=matchFood(part);if(!found){misses.push(part);continue}const serving=portion(part,found),r=found.food,f=serving.factor;
      hits.push({input:part,name:r[0],serving:serving.description,kcal:Math.round(r[3]*f),protein:round1(r[4]*f),carbs:round1(r[5]*f),fat:round1(r[6]*f)});
    }
    return {hits,misses,kcal:hits.reduce((a,x)=>a+x.kcal,0),protein:round1(hits.reduce((a,x)=>a+x.protein,0)),carbs:round1(hits.reduce((a,x)=>a+x.carbs,0)),fat:round1(hits.reduce((a,x)=>a+x.fat,0))};
  }
  function preview(){const val=el('foodText').value.trim();if(!val){alert('Write what you ate first.');return}
    estimation=estimate(val);el('foodParts').replaceChildren();
    for(const h of estimation.hits){const div=document.createElement('div');div.className='food-part';const a=document.createElement('span');a.textContent=`${h.name} (${h.serving})`;const b=document.createElement('strong');b.textContent=`~${h.kcal} kcal`;div.append(a,b);el('foodParts').append(div)}
    const alert=el('foodAlert');alert.hidden=false;alert.className='food-msg'+(estimation.misses.length?' food-warn':'');
    if(estimation.misses.length)alert.textContent=`Not recognized: ${estimation.misses.join('; ')}. These are not included. Adjust the calorie and macro totals manually, or simplify your description.`;
    else alert.textContent='Approximate total based on common reference portions. Edit quantities and totals if your serving or recipe was different.';
    for(const [k,v] of Object.entries({foodKcal:estimation.kcal,foodProtein:estimation.protein,foodCarbs:estimation.carbs,foodFat:estimation.fat}))el(k).value=estimation.hits.length?v:'';
    el('foodPreview').hidden=false;el('foodAdd').textContent=editing?'Update food entry':'Save food entry';
  }
  function totalsFor(d){const foods=Array.isArray(d.foods)?d.foods:[];return {
    kcal:foods.reduce((a,v)=>a+safeNumber(v.kcal),0),
    protein:round1(foods.reduce((a,v)=>a+safeNumber(v.protein),0)),
    carbs:round1(foods.reduce((a,v)=>a+safeNumber(v.carbs),0)),
    fat:round1(foods.reduce((a,v)=>a+safeNumber(v.fat),0))};}
  function syncTotals(d){if(Array.isArray(d.foods)&&d.foods.length){let t=totalsFor(d);d.calories=t.kcal;d.protein=t.protein;d.carbs=t.carbs;d.fat=t.fat}else if(d.priorManualTotals){d.calories=d.priorManualTotals.calories;d.protein=d.priorManualTotals.protein;delete d.priorManualTotals;delete d.carbs;delete d.fat}else{d.calories=null;d.protein=null;delete d.carbs;delete d.fat}}
  function resetForm(){editing=null;estimation=null;el('foodText').value='';el('foodPreview').hidden=true;el('foodParts').replaceChildren();}
  function saveFood(){const val=el('foodText').value.trim();if(!val||!estimation){alert('Estimate the food first.');return}
    const nums={};for(const k of ['foodKcal','foodProtein','foodCarbs','foodFat']){let v=el(k).value;if(v===''||!Number.isFinite(Number(v))||Number(v)<0){alert('Enter valid calories, protein, carbs and fat.');el(k).focus();return}nums[k]=Number(v)}
    if(nums.foodKcal>5000||nums.foodProtein>500||nums.foodCarbs>800||nums.foodFat>400){alert('Check your numbers before saving.');return}
    const date=el('date').value;const d=db.days[date]||{};if(!Array.isArray(d.foods))d.foods=[];
    if(!d.foods.length&&!d.priorManualTotals&&(d.calories!=null||d.protein!=null))d.priorManualTotals={calories:d.calories??null,protein:d.protein??null};
    const food={id:editing||String(Date.now())+'-'+Math.random().toString(36).slice(2,7),meal:el('foodMeal').value,text:val,kcal:nums.foodKcal,protein:nums.foodProtein,carbs:nums.foodCarbs,fat:nums.foodFat,uncertain:estimation.misses.length>0};
    const pos=editing?d.foods.findIndex(f=>f.id===editing):-1;if(pos>=0)d.foods[pos]=food;else d.foods.push(food);
    syncTotals(d);db.days[date]=d;persist();loadDay();render();resetForm();
  }
  function editFood(id){const d=db.days[el('date').value]||{},f=(d.foods||[]).find(x=>x.id===id);if(!f)return;
    editing=id;estimation={hits:[],misses:[]};el('foodMeal').value=f.meal||'Lunch';el('foodText').value=f.text;
    for(const [k,v] of Object.entries({foodKcal:f.kcal,foodProtein:f.protein,foodCarbs:f.carbs,foodFat:f.fat}))el(k).value=v??0;
    el('foodParts').replaceChildren();el('foodAlert').hidden=false;el('foodAlert').className='food-msg';el('foodAlert').textContent='Editing a saved estimate. Review the values and save. To re-estimate the description, press Estimate calories & protein.';
    el('foodPreview').hidden=false;el('foodAdd').textContent='Update food entry';card.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function removeFood(id){const date=el('date').value;const d=db.days[date]||{};if(!Array.isArray(d.foods))return;d.foods=d.foods.filter(x=>x.id!==id);syncTotals(d);db.days[date]=d;persist();loadDay();render();resetForm()}
  function render(){const date=el('date').value;const d=db.days[date]||{};const foods=Array.isArray(d.foods)?d.foods:[];const totals=foods.length?totalsFor(d):{kcal:safeNumber(d.calories),protein:safeNumber(d.protein)};
    el('foodDateLabel').textContent='Selected date: '+new Date(date+'T12:00:00').toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
    el('foodTotalCal').textContent=`${Math.round(totals.kcal)} / 2,000`;
    el('foodTotalPro').textContent=`${round1(totals.protein)} / 170 g`;
    el('foodRemaining').textContent=`${Math.round(2000-totals.kcal)} kcal`;
    el('foodBar').style.width=Math.min(100,Math.max(0,totals.kcal/2000*100))+'%';
    el('calories').readOnly=foods.length>0;el('protein').readOnly=foods.length>0;
    el('calories').title=foods.length?'Calculated from your food diary':'';
    el('protein').title=foods.length?'Calculated from your food diary':'';
    const entries=el('foodEntries');entries.replaceChildren();
    if(!foods.length){const p=document.createElement('p');p.className='food-mini';p.textContent='No meals logged for this date. Add your first meal above.';entries.append(p)}
    foods.forEach(f=>{const wrap=document.createElement('div');wrap.className='food-entry';
      const top=document.createElement('div');top.className='food-entryhead';const m=document.createElement('strong');m.textContent=f.meal||'Meal';const t=document.createElement('span');t.textContent=`${Math.round(safeNumber(f.kcal))} kcal · ${round1(safeNumber(f.protein))} g protein`;top.append(m,t);
      const desc=document.createElement('p');desc.textContent=f.text;
      const actions=document.createElement('div');actions.className='food-entry-actions';const edit=document.createElement('button');edit.className='secondary';edit.textContent='Edit';edit.onclick=()=>editFood(f.id);
      const remove=document.createElement('button');remove.className='danger';remove.textContent='Remove';remove.onclick=()=>removeFood(f.id);actions.append(edit,remove);wrap.append(top,desc,actions);entries.append(wrap)
    });
  }
  el('foodEstimate').addEventListener('click',preview);
  el('foodAdd').addEventListener('click',saveFood);
  el('foodCancel').addEventListener('click',resetForm);
  el('date').addEventListener('change',()=>{resetForm();render()});
  // The original tracker owns the clear/import/reset controls; listen after its handlers.
  el('clear').addEventListener('click',()=>{resetForm();render()});
  el('reset').addEventListener('click',()=>{resetForm();render()});
  // Existing import handler is async, so let it call this hook when complete.
  window.renderFoodDiary=render;
  window.estimateFoodLocally=estimate; // Supports simple offline smoke tests in browser console.
  render();
})();