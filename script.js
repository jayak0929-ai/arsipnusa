const starterArchives=[
{id:1,title:"Ki Hajar Dewantara",category:"Pendidikan",note:"Tokoh pelopor pendidikan Indonesia dan pendiri Taman Siswa. Pemikirannya menekankan pendidikan yang memerdekakan dan membentuk karakter."},
{id:2,title:"R.A. Kartini",category:"Emansipasi",note:"Tokoh perempuan yang dikenal melalui pemikirannya tentang pendidikan dan kesempatan yang setara bagi perempuan Indonesia."},
{id:3,title:"Mohammad Hatta",category:"Kemerdekaan",note:"Salah satu proklamator kemerdekaan Indonesia yang juga dikenal sebagai Wakil Presiden pertama Republik Indonesia."}
];
const KEY="arsipnusa_entries_v2";
let archives=(()=>{try{return JSON.parse(localStorage.getItem(KEY))||starterArchives}catch{return starterArchives}})();
const $=id=>document.getElementById(id);
const grid=$("archiveGrid"),search=$("searchInput"),empty=$("emptyState");
$("todayLabel").textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
function save(){localStorage.setItem(KEY,JSON.stringify(archives))}
function render(){
 const term=search.value.trim().toLowerCase();
 const list=archives.filter(x=>(x.title+" "+x.category+" "+x.note).toLowerCase().includes(term));
 grid.innerHTML="";
 list.forEach(item=>{
  const card=document.createElement("article");card.className="archive-card";
  const cat=document.createElement("div");cat.className="card-category";cat.textContent=(item.category||"Catatan").toUpperCase();
  const title=document.createElement("h3");title.textContent=item.title;
  const note=document.createElement("p");note.textContent=item.note;
  card.append(cat,title,note);
  if(item.id>3){const del=document.createElement("button");del.className="delete-card";del.textContent="Hapus catatan";del.onclick=()=>{archives=archives.filter(x=>x.id!==item.id);save();render()};card.append(del)}
  grid.append(card);
 });
 empty.classList.toggle("hidden",list.length>0);
 $("totalArchives").textContent=archives.length;
 $("totalCategories").textContent=new Set(archives.map(x=>(x.category||"Catatan").toLowerCase())).size;
 $("resultCount").textContent=list.length+" catatan";
}
render();search.addEventListener("input",render);
const form=$("archiveForm");
$("showFormBtn").onclick=()=>{form.classList.remove("hidden");$("archiveTitle").focus()};
function hideForm(){form.classList.add("hidden")}
$("closeFormBtn").onclick=hideForm;$("cancelFormBtn").onclick=hideForm;
form.addEventListener("submit",e=>{
 e.preventDefault();
 archives.unshift({id:Date.now(),title:$("archiveTitle").value.trim(),category:$("archiveCategory").value.trim()||"Catatan",note:$("archiveNote").value.trim()});
 save();render();form.reset();hideForm();
});
function caesar(value,shift){
 return [...value].map(char=>{
  const code=char.charCodeAt(0);
  if(code>=65&&code<=90)return String.fromCharCode((code-65+shift+26)%26+65);
  if(code>=97&&code<=122)return String.fromCharCode((code-97+shift+26)%26+97);
  return char;
 }).join("");
}
function values(){
 const message=$("messageInput").value,shift=Number($("shiftInput").value);
 if(!message.trim()){$("cipherStatus").textContent="Masukkan pesan terlebih dahulu.";return null}
 if(!Number.isInteger(shift)||shift<1||shift>25){$("cipherStatus").textContent="Angka pergeseran harus 1 sampai 25.";return null}
 return{message,shift};
}
$("encryptBtn").onclick=()=>{const v=values();if(!v)return;$("resultBox").textContent=caesar(v.message,v.shift);$("cipherStatus").textContent="Pesan berhasil dienkripsi."};
$("decryptBtn").onclick=()=>{const v=values();if(!v)return;$("resultBox").textContent=caesar(v.message,-v.shift);$("cipherStatus").textContent="Pesan berhasil didekripsi."};
$("copyBtn").onclick=async()=>{
 const value=$("resultBox").textContent;
 if(value==="Hasil enkripsi atau dekripsi akan tampil di sini."){$("cipherStatus").textContent="Belum ada hasil untuk disalin.";return}
 try{await navigator.clipboard.writeText(value);$("cipherStatus").textContent="Hasil berhasil disalin."}
 catch{$("cipherStatus").textContent="Silakan salin hasil secara manual."}
};
