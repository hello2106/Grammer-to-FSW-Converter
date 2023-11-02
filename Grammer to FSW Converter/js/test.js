function test() {
    var title = '<h6>Check Strings (Input)</h6><br>';
    var text = '<div class="container"><div id="disp1"><textarea id="myTextArea2" rows="6" cols="53"></textarea></div>';
    var disp = '<div id="disp2"></div></div>';
    var check = '<div class="container2"><button style="width:100px;position:absolote;float:left;" id="check" onClick="check()">Check</button</div>';
    document.getElementById('rcorners2').innerHTML = null;
    document.getElementById('rcorners2').innerHTML += title;            
    document.getElementById('rcorners2').innerHTML += text;
    document.getElementById('rcorners2').innerHTML += disp; 
    document.getElementById('rcorners2').innerHTML += check;                          
}