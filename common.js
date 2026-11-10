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
// 内訳スタックバー＋凡例のHTMLを返す。
// segs: [{label:"手取り", value:3942067, cls:"sg-net"}, ...]（clsはstyle.cssの sg-* クラス）
function stackBar(segs){
  var total = 0, i;
  for(i=0;i<segs.length;i++) total += Math.max(0, segs[i].value);
  if(total <= 0) return "";
  var bar = "<div class='stackbar' aria-hidden='true'>", leg = "<div class='legend'>";
  for(i=0;i<segs.length;i++){
    var s = segs[i], pct = Math.max(0, s.value) / total * 100;
    if(pct > 0) bar += "<i class='" + s.cls + "' style='width:" + pct.toFixed(2) + "%'></i>";
    leg += "<span><i class='" + s.cls + "'></i>" + s.label + " <b>" + pct.toFixed(1) + "％</b></span>";
  }
  return bar + "</div>" + leg + "</div>";
}
// 金額プリセットチップを input の直下に差し込む。values は数値の配列、fmt は表示変換関数。
function presets(inputId, values, fmt){
  var inp = document.getElementById(inputId); if(!inp) return;
  var wrap = document.createElement("div"); wrap.className = "chips";
  values.forEach(function(v){
    var b = document.createElement("button"); b.type = "button"; b.textContent = fmt ? fmt(v) : yen(v);
    b.addEventListener("click", function(){
      inp.value = v;
      inp.dispatchEvent(new Event("input", {bubbles:true}));
      inp.focus();
    });
    wrap.appendChild(b);
  });
  var host = inp.closest(".stepper") || inp;
  host.parentNode.insertBefore(wrap, host.nextSibling);
}
// 数値入力に − ＋ ステッパーを自動付与（form.calc 内の type=number のみ）
document.addEventListener("DOMContentLoaded", function(){
  var inputs = document.querySelectorAll("form.calc input[type=number]:not([data-nostep])");
  inputs.forEach(function(inp){
    if(inp.parentNode.classList.contains("stepper")) return;
    var step = parseFloat(inp.getAttribute("step")) || 1;
    var min = inp.getAttribute("min") !== null ? parseFloat(inp.getAttribute("min")) : null;
    var max = inp.getAttribute("max") !== null ? parseFloat(inp.getAttribute("max")) : null;
    var wrap = document.createElement("div"); wrap.className = "stepper";
    var minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "減らす");
    var plus = document.createElement("button"); plus.type = "button"; plus.textContent = "＋"; plus.setAttribute("aria-label", "増やす");
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(minus); wrap.appendChild(inp); wrap.appendChild(plus);
    function bump(dir){
      var v = parseFloat(inp.value); if(isNaN(v)) v = 0;
      v += dir * step;
      if(min !== null && v < min) v = min;
      if(max !== null && v > max) v = max;
      inp.value = v;
      inp.dispatchEvent(new Event("input", {bubbles:true}));
    }
    minus.addEventListener("click", function(){ bump(-1); });
    plus.addEventListener("click", function(){ bump(1); });
  });
});
