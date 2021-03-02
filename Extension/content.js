var oldmsg = ""
document.body.addEventListener('DOMSubtreeModified', function (e) {
  try {
    //ndfHFb-c4YZDc-Wrql6b-V1ur5d ndfHFb-c4YZDc-Wrql6b-V1ur5d-hpYHOb
    //var msg = document.getElementsByClassName("a-b-K-T a-b-cg-Zf")[0] != undefined && document.getElementsByClassName("a-b a-b-ja-el-db a-b-Oe-n a-b-L a-b-Na")[0] != undefined ? document.getElementsByClassName("a-b-K-T a-b-cg-Zf")[0].innerHTML : "Browsing..."
    var msg = innerHTMLCheck()
    if(msg != oldmsg) {
      chrome.runtime.sendMessage({ message: msg }, function (response) {
        console.log(response)
      });
      oldmsg = msg
    }
  }
  catch {
    
  }
}, false);

function innerHTMLCheck() {
  if(document.getElementsByClassName("a-b a-b-ja-el-db a-b-Oe-n a-b-L a-b-Na")[0] != undefined) {
    if(document.getElementsByClassName("a-b-K-T a-b-cg-Zf")[0] != undefined) {
      return document.getElementsByClassName("a-b-K-T a-b-cg-Zf")[0].innerHTML
    }
  }else if(document.getElementsByClassName("ndfHFb-c4YZDc-Wrql6b-V1ur5d ndfHFb-c4YZDc-Wrql6b-V1ur5d-hpYHOb")[0] != undefined) {
    return document.getElementsByClassName("ndfHFb-c4YZDc-Wrql6b-V1ur5d ndfHFb-c4YZDc-Wrql6b-V1ur5d-hpYHOb")[0].innerHTML
  }else {
    return "Browsing..."
  }
}