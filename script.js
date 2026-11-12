const PRODUCTS = [
  {id:1, name:"Rangeen Blocks Set (100 pcs)", cat:"blocks", age:"4-6", price:1850, emoji:"🧱", bg:"#ffe3df"},
  {id:2, name:"Lakri ki Train", cat:"gaarian", age:"0-3", price:2400, emoji:"🚂", bg:"#dfe6ff"},
  {id:3, name:"Remote Control Car", cat:"gaarian", age:"7-10", price:3900, emoji:"🏎️", bg:"#fff3c4"},
  {id:4, name:"Jigsaw Puzzle Jungle (60 pcs)", cat:"puzzle", age:"4-6", price:1200, emoji:"🧩", bg:"#d8f5e6"},
  {id:5, name:"Naram Teddy Bear", cat:"dolls", age:"0-3", price:1600, emoji:"🧸", bg:"#ffe3df"},
  {id:6, name:"Gudiya Dream House", cat:"dolls", age:"4-6", price:4500, emoji:"🏠", bg:"#dfe6ff"},
  {id:7, name:"Robot Banao Kit", cat:"puzzle", age:"7-10", price:3200, emoji:"🤖", bg:"#fff3c4"},
  {id:8, name:"Patang aur Dor", cat:"outdoor", age:"7-10", price:450, emoji:"🪁", bg:"#d8f5e6"},
  {id:9, name:"Football (Size 3)", cat:"outdoor", age:"4-6", price:900, emoji:"⚽", bg:"#ffe3df"},
  {id:10, name:"Bade Blocks (Soft Foam)", cat:"blocks", age:"0-3", price:1400, emoji:"🔷", bg:"#dfe6ff"},
  {id:11, name:"Fire Truck", cat:"gaarian", age:"4-6", price:2100, emoji:"🚒", bg:"#fff3c4"},
  {id:12, name:"Space Puzzle (200 pcs)", cat:"puzzle", age:"7-10", price:1700, emoji:"🚀", bg:"#d8f5e6"}
];
const WHATSAPP = "923000000000"; // apna number yahan likhein (country code ke sath, + ke baghair)

const $ = s => document.querySelector(s);
const fmt = n => "Rs " + n.toLocaleString("en-PK");
let cart = {};
try { cart = JSON.parse(localStorage.getItem("kg-cart")) || {}; } catch(e){ cart = {}; }
let cat = "all", age = null;

const ageText = {
  "0-3":"0–3 saal: naram, bade aur mehfooz khilone.",
  "4-6":"4–6 saal: blocks, gaarian aur kahani wale khilone.",
  "7-10":"7–10 saal: puzzles, robots aur bahar khelne ke khilone."
};

function renderProducts(){
  $("#productGrid").innerHTML = PRODUCTS
    .filter(p => cat === "all" || p.cat === cat)
    .map(p => `
      <article class="card ${age && p.age !== age ? "dim" : ""}">
        <div class="pic" style="background:${p.bg}" aria-hidden="true">${p.emoji}</div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <span class="meta">Umar: ${p.age} saal</span>
          <span class="price">${fmt(p.price)}</span>
          <button class="add" data-id="${p.id}">Cart mein daalein</button>
        </div>
      </article>`).join("");
}

function save(){ try { localStorage.setItem("kg-cart", JSON.stringify(cart)); } catch(e){} }

function renderCart(){
  const ids = Object.keys(cart);
  let count = 0, total = 0, msg = "Assalam o Alaikum! Mujhe ye khilone order karne hain:%0A";
  const html = ids.map(id => {
    const p = PRODUCTS.find(x => x.id == id), q = cart[id];
    count += q; total += p.price * q;
    msg += `- ${encodeURIComponent(p.name)} x${q} (${fmt(p.price*q)})%0A`;
    return `<div class="line">
      <span class="em">${p.emoji}</span>
      <div><b>${p.name}</b>
        <div class="qty">
          <button data-dec="${id}" aria-label="Kam karein">−</button>
          <span>${q}</span>
          <button data-inc="${id}" aria-label="Barhayein">+</button>
        </div></div>
      <span class="lp">${fmt(p.price*q)}</span></div>`;
  }).join("");
  $("#cartItems").innerHTML = html || `<p class="empty">Cart khali hai. Koi khilona chun kar "Cart mein daalein" dabayein.</p>`;
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = fmt(total);
  msg += `%0AKul: ${fmt(total)}`;
  const btn = $("#checkout");
  btn.href = count ? `https://wa.me/${WHATSAPP}?text=${msg}` : "#";
  btn.style.opacity = count ? 1 : .5;
  btn.style.pointerEvents = count ? "auto" : "none";
}

function openCart(open){
  $("#drawer").classList.toggle("open", open);
  $("#drawer").setAttribute("aria-hidden", !open);
  $("#overlay").hidden = !open;
}

document.addEventListener("click", e => {
  const t = e.target;
  if (t.matches(".chip")){
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    t.classList.add("active"); cat = t.dataset.cat; renderProducts();
  }
  if (t.closest(".age")){
    const b = t.closest(".age"), same = b.classList.contains("active");
    document.querySelectorAll(".age").forEach(a => a.classList.remove("active"));
    age = same ? null : b.dataset.age;
    if (age) b.classList.add("active");
    $("#ageNote").textContent = age ? ageText[age] : "Ek umar chunein, hum us ke khilone upar dikha denge.";
    renderProducts();
    if (age) $("#shop").scrollIntoView({behavior:"smooth"});
  }
  if (t.matches(".add")){
    const id = t.dataset.id; cart[id] = (cart[id] || 0) + 1;
    save(); renderCart();
    const cb = $("#openCart"); cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump");
    t.textContent = "Cart mein daal diya"; setTimeout(() => t.textContent = "Cart mein daalein", 1200);
  }
  if (t.dataset.inc){ cart[t.dataset.inc]++; save(); renderCart(); }
  if (t.dataset.dec){ if(--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; save(); renderCart(); }
  if (t.matches(".blk")){ t.classList.remove("knock"); void t.offsetWidth; t.classList.add("knock"); }
});
$("#openCart").onclick = () => openCart(true);
$("#closeCart").onclick = () => openCart(false);
$("#overlay").onclick = () => openCart(false);
document.addEventListener("keydown", e => { if (e.key === "Escape") openCart(false); });

renderProducts(); renderCart();
