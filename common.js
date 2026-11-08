// 計算ラボ 共通ユーティリティ
function yen(n){ if(!isFinite(n)) return "—"; return Math.round(n).toLocaleString("ja-JP"); }
function num(id){ var v = parseFloat(document.getElementById(id).value); return isNaN(v) ? 0 : v; }
function setSeg(id, attr, cb){
  var seg = document.getElementById(id); if(!seg) return;
  seg.addEventListener("click", function(e){
    if(e.target.tagName !== "BUTTON") return;
    var bs = seg.querySelectorAll("button");
    for(var i=0;i<bs.length;i++) bs[i].classList.remove("on");
    e.target.classList.add("on");
    seg.dataset[attr] = e.target.dataset.v;
    if(cb) cb();
  });
}
