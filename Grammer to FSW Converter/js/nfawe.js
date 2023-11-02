var nfawe = {};
var nextStates = [];
var production = [];
var nonTerminal = [];

function eClosure() {
    var start = regular.getStartVar()
    var final = regular.getFinalVar()
    console.log(final)
    for (var i = 0; i < regular.productions.length; i++) {
      console.log(regular.productions[i].currentState, "->", regular.productions[i].symbol+regular.productions[i].nextState);
      if(regular.productions[i].currentState == start && regular.productions[i].symbol == "e" && final.indexOf(regular.productions[i].nextState) > -1){
        final.push(regular.productions[i].currentState)
      }
    }
    console.log(final)
    document.getElementById('rcorners2').innerHTML = ''
    production = regular.getProductions();
    nonTerminal = regular.getNonTerminals();
    console.log(production);
    var hasLambda = false;
    for (var p of production) {
      if (p.symbol == 'e') {
        hasLambda = true;
        break;
      }
    }

    console.log(hasLambda);
    var tmp = [];
    tmp.push(production[0].getNextState())
    console.log(production[0].getNextState())
    for (var i=1; i < production.length; i++) {
        if (tmp.indexOf(production[i].getCurrentState()) == -1){
            tmp.push(production[i].getNextState());
        }
        console.log(tmp)
        if(i+1 < production.length){
            if (production[i].getCurrentState() != production[i+1].getCurrentState()){
                nextStates.push(tmp);
                tmp = [];
            }
        }
    }
    nextStates.push(tmp);

    tmp = regular.getTerminals()
    var path = [...new Set(tmp)];
    
    console.log(path);
    // If we don't have lambda transitions, don't do anything to it
    var state = [];
    var state_closure = [];

    var nfa_closed_transitions = [];
  
    for (var i = 0; i < nonTerminal.length; i++) {
        state = nonTerminal[i]
        state_closure = fetch_E_Closure(state, production);

        for (var j=0; j < path.length;j++) {
            var symbol = path[j];
            var symbol_next_states = [];

            for (var k=0; k < state_closure.length; k++) {
                var next_states = findNextStates(
                    state_closure[k],
                    symbol,
                    production
                );
                if (next_states.length !== 0) {
                    for (var n=0; n < next_states.length; n++) {
                        var closure = fetch_E_Closure(next_states[n], production);

                        for (var m = 0; m < closure.length; m++) {
                            var to_add = closure[m];
                
                            if (!symbol_next_states.includes(to_add))
                                symbol_next_states.push(to_add);
                        }
                    }
                }
            }

            symbol_next_states.sort();

            console.log(
                "NFA Closure: " +
                state +
                " -> " +
                symbol +
                " = " +
                symbol_next_states +
                " (Length " +
                symbol_next_states.length +
                ")"
            );
            
            pr = new Production();
            pr.setProperties(state, symbol, symbol_next_states)
            nfa_closed_transitions.push(pr)
        }
    }
    nfawe = nfa_closed_transitions;

    var initial_state_closure = fetch_E_Closure(
        regular.getStartVar(),
        production
    );
    var init_closure_has_final_state = false;

    for (let final_state of regular.getFinalVar()) {
        if (initial_state_closure.includes(final_state)) {
          init_closure_has_final_state = true;
          break;
        }
    }

    var tr = nfa_closed_transitions;
    console.log(tr)
    var start = regular.getStartVar();
    var final = regular.getFinalVar();

    //try
    var nfawe2 = {}
    for (var i = 0; i < nonTerminal.length; i++) {
      var rstate = []
      var state = nonTerminal[i]
      nfawe2[state] = {};
      for (var j = 0; j < tr.length; j++) {
        if(state == tr[j].currentState){
          var path = tr[j].symbol
          var k = j + 1;
          if (k < tr.length){
            if (tr[j].symbol == tr[k].symbol){
              rstate.push(tr[j].nextState);
              nfawe2[state][path] = rstate;
              rstate = [];
            }
            else if (tr[j].symbol != tr[k].symbol){
              rstate.push(tr[j].nextState);
              nfawe2[state][path] = rstate;
              rstate = [];
            }
          }
          else{
            rstate.push(tr[j].nextState)
            nfawe2[state][path] = rstate;
            rstate = [];
          }
        }
      }
    }
    console.log(nfawe2)
    //
    var state = Object.keys(nfawe2)
    var tr1 = Object.values(nfawe2)
    console.log(state)
    
    var term = []
    for (var i = 0; i<tr.length; i++) {
      console.log(tr[i].symbol);
      term.push(tr[i].symbol);
    }
    var term2 = [...new Set(term)]
    term2 = term2.sort()
    console.log(term2)

    var tabl = "<table><tr>";
        tabl += "<h5>" + "Transition Table" + "</h5>";
        tabl += "<td>" + "NFA" + "</td>";
    
    for (var i = 0; i<term2.length; i++){
		  tabl += "<td>" + term2[i] + "</td>";
    }

    for (var j = 0; j<tr1.length; j++){ //each line
		// console.log(leng.length)
		tabl += "<tr>";

		var symb = Object.keys(tr1[j]);
		var next = Object.values(tr1[j]);

		
		console.log("OIIIIIIIIIIIIIIIIIIIIII", symb)
		/*
		console.log("OIIIIIIIIIIIIIIIIIIIIII", symb2)
		console.log("OIIIIIIIIIIIIIIIIIIIIII", Object.keys(tr[tr.length-1]))
		*/

		if (state[j] == start && final.indexOf(state[j]) > -1){
			tabl += "<td>" + ">*" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {  // each state
				// console.log(i)
				// console.log("f&s term", term2[i])
				// console.log("f&s symb", symb[i])
				// console.log("f&s next", next[i])
        var v1 = JSON.stringify(next[i])
        v1 = v1.replace("null", "");
        v1 = v1.replace(/[\])}[{(""]/g, '')
        if (v1.includes(","))
          v1 = v1.substring(0, v1.length - 1);
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + v1 + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
		else if (state[j] == start){
			tabl += "<td>" + ">" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("s term", term2[i])
				// console.log("s symb", symb[i])
        var v1 = JSON.stringify(next[i])
        v1 = v1.replace("null", "");
        v1 = v1.replace(/[\])}[{(""]/g, '')
        if (v1.includes(","))
          v1 = v1.substring(0, v1.length - 1);
				console.log("s next", next[i])
				if (term2[i] == symb[i]) {  
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + v1 + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
		else if (final.indexOf(state[j]) > -1){
			tabl += "<td>" + "*" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("f term", term2[i])
				// console.log("f symb", symb[i])
				// console.log("f next", next[i])
        var v1 = JSON.stringify(next[i])
        v1 = v1.replace("null", "");
        v1 = v1.replace(/[\])}[{(""]/g, '')
        if (v1.includes(","))
          v1 = v1.substring(0, v1.length - 1);
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + v1 + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
		else{
			tabl += "<td>" + state[j] + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("term", term2[i])
				// console.log("symb", symb[i])
				// console.log("next", next[i])
        var v1 = JSON.stringify(next[i])
        v1 = v1.replace("null", "");
        v1 = v1.replace(/[\])}[{(""]/g, '')
        if (v1.includes(","))
          v1 = v1.substring(0, v1.length - 1);
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + v1 + "}</td>";
				}
				else if (term2[i] !== symb[i]){
					tabl += "<td>∅</td>"
					// console.log("before assign " + symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
					// console.log("after assign " + symb[i+1])
				}
				else if (symb[i]=='e'){
					tabl += "<td>∅</td>"
				}
			}
		}
	}

  final = [...new Set(final)]
  final = final.sort()
  var output = "<b>M = {Q, Σ, σ, p0, F} </b>" +
	"<br>Q = {" + state + "}" +
	"<br>Σ = {" + term2.sort() + "}" +
	"<br>σ = {Q x Σe -> Pow(Q)}" +
	"<br>p0 = " + start +
	"<br>F = {" + final + "}";
  document.getElementById('rcorners2').innerHTML = tabl + "</tr></table>" + output;

    // if (init_closure_has_final_state) {
    //     // Make the initial state final
    //     nfa.finalStates.push(nfa.initialState);
    // }
}

function fetch_E_Closure(state, productions) {
  var e_closure = [];
  e_closure.push(state);
  //console.log("--- Add to e_closure 1 ---");
  //console.log(state);
  //console.log("-----");

  for (var i = 0; i < productions.length; i++) {
    var p = productions[i];

    // Lambda transition
    if ((p.symbol == 'e') || (p.nextState == '')) {
      // The transition is going from our state
      if (state == p.currentState) {

        for (var j = 0; j < nextStates.length; j++) {
          // See if the state is part of the closure
          if (!e_closure.includes(p.nextState[j])) {
            // If not, add it to the closure
            e_closure.push(p.nextState[j]);
            ///console.log("--- Add to e_closure 2 ---");
            //console.log(t.nextStates[j]);
            //console.log("-----");

            // Then check the closure for the newly added state (recursive)
            //console.log("RECURSIVE");
            var sub_e_closure = fetch_E_Closure(p.nextState[j], productions);

            for (var j = 0; j < sub_e_closure.length; j++) {
              if (!e_closure.includes(sub_e_closure[j])) {
                e_closure.push(sub_e_closure[j]);
                //console.log("--- Add to e_closure 3 ---");
                //console.log(sub_e_closure[j]);
                //console.log("-----");
              }
            }
          }
        }
      }
    }
  }

  return e_closure;
}

function findNextStates(state, symbol, productions) {
  var next_states = [];

  for (var i = 0; i < productions.length; i++) {
    var p = productions[i];

    if (p.currentState == state && p.symbol == symbol) {
      for (var j = 0; j < p.nextState.length; j++) {
        if (!next_states.includes(p.nextState[j])) {
          next_states.push(p.nextState[j]);
        }
      }
    }
  }

  return next_states;
}