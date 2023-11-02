function check() {
  var input = document.getElementById("myTextArea2").value;
  var arr = input.split('\n');  //store each input into an array

  var production = regular.getProductions(); // return array of productions from rg2.js
  var finalStates = regular.getFinalVar();  //return array of final states
  console.log(production.length);
  console.log(production);
  console.log(arr);

  var symbolList=[]
  for(var i=0; i < production.length;i++) {
    symbolList.push(production[i].getSymbol());
  }
  symbolList = symbolList.sort();
  symbolList = symbolList.filter((item, pos) => symbolList.indexOf(item) == pos);
  console.log(symbolList);

  var currentState = regular.getStartVar();  //current state is assigned with the regular start state
  var results = [];  //array of results, ['ok'] @ ['not ok']
  for (var i = 0; i < arr.length; i++) {  //first is loops through each input
    for (var j = 0; j < arr[i].length; j++) {  //loops single number like 0101, access 0 first..then 0
      currentState = regular.getStartVar();  //
      console.log(arr[i].length);
      for (var k = 0; k < production.length; k++) {
        console.log(k +' number of symbol -> '+ production[k].getSymbol(), production[k].getNextState())
        console.log(currentState, production[k].getCurrentState());
        if(currentState == production[k].getCurrentState()) {
          var inputAndCurrentIsChanged = false;
          console.log('000000000000')
          if(production[k].getSymbol() == arr[i][j]) { // if 0011, then arr[i][j] represents each single number
              console.log(currentState  + "->" + arr[i][j] + production[k].getNextState());
              currentState = production[k].getNextState();
              inputAndCurrentIsChanged = true;
              k=-1;
              j += 1;
              console.log(j)
              console.log("11111111111111")
          }
          else if (production[k].getSymbol() == 'e') { // the current state is final state and the input is at last index
            console.log('e');
            if ((j >= arr[i].length) && (finalStates.indexOf(currentState) > -1)){ // if input reach the end and the current state is final state
              console.log(currentState + " is end state");
              inputAndCurrentIsChanged = true;
              console.log("22222222222222")
            }
            else if ((j < arr[i].length) && (finalStates.indexOf(currentState) == -1)) { // if input havent reach the end and the current state is not final state
              console.log(currentState  + "->" + arr[i][j] + production[k].getNextState());
              currentState = production[k].getNextState();
              inputAndCurrentIsChanged = true;
              k=-1; // go back to first production because already change state
              j += 1;
              console.log(j)
              console.log("333333333333333")
            }
            else if ((j < arr[i].length) && (finalStates.indexOf(currentState) > -1)) { // if input havent reach the end and the current state is final state
              inputAndCurrentIsChanged = false;
              j = arr[i].length - 1;
              console.log("444444444444444")
              break;
            }
            else if ((j >= arr[i].length) && (finalStates.indexOf(currentState) == -1)){ // if input reach the end and the current state is not final state
              console.log(currentState  + "->" + arr[i][j] + production[k].getNextState());
              currentState = production[k].getNextState();
              inputAndCurrentIsChanged = true;
              k=-1; // go back to first production because already change state
              j += 1;
              console.log(j)
              console.log("5555555555555555")
            }
          }
          else if (symbolList.indexOf(arr[i][j]) == -1) {
            inputAndCurrentIsChanged = false;
          }
        }
      }

      if(inputAndCurrentIsChanged == false) {
        console.log('not ok')
        results.push('not ok');
        break;
      }
      else if(inputAndCurrentIsChanged == true) {
        console.log('ok')
        results.push('ok');
        break;
      }

    }


  }

  console.log(results);
  var res = "";
  for (var i = 0; i < results.length; i++) {
    res += results[i] + "<br>";
    document.getElementById("disp2").innerHTML = "<b>" + res + "</b>";
  }

}
