var dfa_transitions = [];
var full_dfa_transitions = [];
function dfa() {
  var dfa_states = [];
  var dfa_final_states = [];
  dfa_transitions = [];
  full_dfa_transitions = [];

  tmp = regular.getTerminals()
  var path = [...new Set(tmp)];
  console.log(nfawe);

  dfa_states.push(regular.getStartVar());
  var stack = getAllComb(regular.getNonTerminals()); // get all combinations from the non terminals

  while (stack.length > 0) {
    var state = stack.pop();
    console.log("Pop'd state: " + state);

    var states;

    if (isMultiState(state)) {
      states = separateStates(state);
    } else {
      states = [];
      states = state;
    }
    // console.log(states)
    // console.log(path)

    for (var i = 0; i < path.length; i++) { 
      var next_states_union = [];

      console.log(states.length);
      for (var j = 0; j < states.length; j++) {
        var ns = findNextStates(states[j], path[i], nfawe);
        console.log("Next states for " + states[j] + ", " + path[i] + " -> " + ns);
        for (var k = 0; k < ns.length; k++){
          if (!next_states_union.includes(ns[k]))
            next_states_union.push(ns[k]);
        }
      }
      // console.log(next_states_union)
      state = combineStates(states);
      var combinedStatesUnion = combineStates(next_states_union);
      console.log(combinedStatesUnion);

      if (combinedStatesUnion != null) {
        console.log("Combined union of " + next_states_union + " (" + next_states_union.length + "): " + combinedStatesUnion + " | " + Array.isArray(combinedStatesUnion));
        console.log(state + ", " + path[i] + " -> " + combinedStatesUnion);
        var pr = new Production();
        pr.setProperties(state, path[i], combinedStatesUnion)
        // console.log(pr);
        full_dfa_transitions.push(pr);

        if (!dfa_states.includes(combinedStatesUnion)) {
          dfa_states.push(combinedStatesUnion);
        }
      }
      else {
        console.log("Z state needed");

        if (!dfa_states.includes('Z')) {
          for (var n = 0; n < path.length; n++){
            var pr = new Production();
            pr.setProperties('Z', path[n], 'Z')
            // console.log(pr);
            full_dfa_transitions.push(pr);
          }
          dfa_states.push('Z');
        }
        var pr = new Production();
        pr.setProperties(state, path[i], 'Z')
        // console.log(pr);
        full_dfa_transitions.push(pr);
      }
    }
  }

  var dfa_states = [];
  var dfa_final_states = [];

  var stack = [];

  dfa_states.push(regular.getStartVar());
  stack.push(regular.getStartVar()); // States we need to check/convert

  while (stack.length > 0) {
    var state = stack.pop();
    console.log("Pop'd state: " + state);

    var states;

    if (isMultiState(state)) {
      states = separateStates(state);
    } else {
      states = [];
      states.push(state);
    }
    // console.log(states)
    // console.log(path)

    for (var i = 0; i < path.length; i++) { 
      var next_states_union = [];

      console.log(states.length);
      for (var j = 0; j < states.length; j++) { // to check whether the combined state is reachable
        var ns = findNextStates(states[j], path[i], nfawe);
        console.log("Next states for " + states[j] + ", " + path[i] + " -> " + ns);
        for (var k = 0; k < ns.length; k++){
          if (!next_states_union.includes(ns[k]))
            next_states_union.push(ns[k]);
        }
      }
      // console.log(next_states_union)

      var combinedStatesUnion = combineStates(next_states_union);
      console.log(combinedStatesUnion);

      if (combinedStatesUnion != null) {
        console.log("Combined union of " + next_states_union + " (" + next_states_union.length + "): " + combinedStatesUnion + " | " + Array.isArray(combinedStatesUnion));
        console.log(state + ", " + path[i] + " -> " + combinedStatesUnion);
        var pr = new Production();
        pr.setProperties(state, path[i], combinedStatesUnion)
        // console.log(pr);
        dfa_transitions.push(pr);

        if (!dfa_states.includes(combinedStatesUnion)) {
          dfa_states.push(combinedStatesUnion);
          stack.push(combinedStatesUnion);
        }
      }
      else {
        console.log("Z state needed");
        //If the combined states are not reachable, it adds a transition to a "Z" state. 

        if (!dfa_states.includes('Z')) {
          for (var n = 0; n < path.length; n++){
            var pr = new Production();
            pr.setProperties('Z', path[n], 'Z')
            // console.log(pr);
            dfa_transitions.push(pr);
          }
          dfa_states.push('Z');
        }
        var pr = new Production();
        pr.setProperties(state, path[i], 'Z')
        // console.log(pr);
        dfa_transitions.push(pr);
      }
    }
  }

  console.log("--- NFA Final States ---");
  console.log(regular.getFinalVar());
  console.log("-----");

  for (var i = 0; i < dfa_states.length; i++) { // to create transitions or productions
    var dfa_sep_states = separateStates(dfa_states[i]);

    for (var j = 0; j < regular.getFinalVar().length; j++) {
      console.log(
        "Does " + dfa_sep_states + " include " + regular.getFinalVar()[j] + "?"
      );

      if (dfa_sep_states.includes(regular.getFinalVar()[j])) {
        dfa_final_states.push(formatDotState(dfa_states[i]));
        break;
      }
    }
  }
  console.log(dfa_transitions);
  console.log(full_dfa_transitions)
  /* --------------------------------
            create table
  ---------------------------------*/
  var tr = dfa_transitions;
  console.log(tr)

  var state2 = []
  var term = []

  for (var i = 0; i<tr.length; i++){
    state2.push(tr[i].currentState)
    term.push(tr[i].symbol)
  }

  var state3 = [...new Set(state2)]
  var term2 = [...new Set(term)]
  state3 = state3.sort()
  term2 = term2.sort()
  console.log(state3)
  console.log(term2)

  var dfa = {}
  for (var i = 0; i<state3.length; i++){
    console.log(state3.length)
    var rstate = [];
    var state4 = state3[i];
    dfa[state4] = {};
    for (var j = 0; j<tr.length; j++){
      if (state4 == tr[j].currentState){
        var path2 = tr[j].symbol;
        var k = j + 1;
        if (k < tr.length){
          if (tr[j].symbol == tr[k].symbol){
            rstate.push(tr[j].nextState);
            dfa[state4][path2] = rstate;
            rstate = [];
          }
          else if (tr[j].symbol != tr[k].symbol){
            rstate.push(tr[j].nextState);
            dfa[state4][path2] = rstate;
            console.log(rstate);
            rstate = [];
          }
        }
        else {
          rstate.push(tr[j].nextState)
          dfa[state4][path2] = rstate;
          console.log(rstate);
          rstate = [];
        }
      }
    }
  }

  console.log(dfa)

  //////////////////////////////////////////////////
  //FULL DFA////////////////////////////////////////
  //////////////////////////////////////////////////
  var tr1 = full_dfa_transitions;

  var state6 = []
  var term3 = []

  for(var i = 0; i<tr1.length; i++){
    state6.push(tr1[i].currentState)
    term3.push(tr1[i].symbol)
  }

  var state7 = [...new Set(state6)]
  var term4 = [...new Set(term3)]
  state7 = state7.sort()
  term4 = term4.sort()
  console.log(state7)
  console.log(term4)

  var fdfa = {}
  for (var i = 0; i<state7.length; i++){
    console.log(state7.length)
    var rstate2 = [];
    var state8 = state7[i];
    fdfa[state8] = {};
    for (var j = 0; j<tr1.length; j++){
      if (state8 == tr1[j].currentState){
        var path3 = tr1[j].symbol;
        var k = j + 1;
        if (k < tr1.length){
          if (tr1[j].symbol == tr1[k].symbol){
            rstate2.push(tr1[j].nextState);
            fdfa[state8][path3] = rstate2;
            rstate2 = [];
          }
          else if (tr1[j].symbol != tr1[k].symbol){
            rstate2.push(tr1[j].nextState);
            fdfa[state8][path3] = rstate2;
            console.log(rstate2);
            rstate2 = [];
          }
        }
        else {
          rstate2.push(tr1[j].nextState)
          fdfa[state8][path3] = rstate2;
          console.log(rstate2);
          rstate2 = [];
        }
      }
    }
  }

  console.log(fdfa)
  /////////////////////////////////////////
  //DRAW TABLE FOR SIMPLIFY FULL DFA  WITHOUT RENAME//////
  /////////////////////////////////////////
  var tabl2 = "<table class = 'tabl2'><tr>";
  tabl2 += "<h5>" + "Transition Table" + "</h5>";
  tabl2 += "<td>" + "DFA" + "</td>";

  var start = regular.getStartVar();
  var final = regular.getFinalVar();

  console.log
  var state8 = Object.keys(fdfa)
  var tr2 = Object.values(fdfa)

  console.log(Object.keys(tr2[0]))

  for (var i = 0; i<term4.length; i++){
		tabl2 += "<td>" + term4[i] + "</td>";
  }

  for (var j = 0; j<tr2.length; j++){
    tabl2 += "<tr>"

    var symb = Object.keys(tr2[j]);
	  var next = Object.values(tr2[j]);

    var fin = state8[j];
    //console.log(fin)
    //console.log(typeof(fin))
    //console.log(final.some(f => fin.includes(f)))
    //state5[j].some(r=> final.indexOf(r) >= 0)
    if (state8[j] == start && final.indexOf(state8[j]) > -1){
			tabl2 += "<td>" + ">*" + state8[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term4.length; i++) {  // each state
				// console.log(i)
				// console.log("f&s term", term2[i])
				// console.log("f&s symb", symb[i])
				// console.log("f&s next", next[i])
				if (term4[i] == symb[i]) {
					if (next[i]=='')
						tabl2 += "<td>∅</td>";
					else
						tabl2 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (term4[i] !== symb[i]){
					tabl2 += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl2 += "<td>∅</td>"
				}
			}
		}
		else if (state8[j] == start){
			tabl2 += "<td>" + ">" + state8[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term4.length; i++) {
				// console.log(i)
				// console.log("s term", term2[i])
				// console.log("s symb", symb[i])
				// console.log("s next", next[i])
				if (term4[i] == symb[i]) {
					if (next[i]=='')
						tabl2 += "<td>∅</td>";
					else
						tabl2 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (term4[i] !== symb[i]){
					tabl2 += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl2 += "<td>∅</td>"
				}
			}
		}
		else if (final.some(f => fin.includes(f))){
			tabl2 += "<td>" + "*" + state8[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term4.length; i++) {
				// console.log(i)
				// console.log("f term", term2[i])
				// console.log("f symb", symb[i])
				// console.log("f next", next[i])
				if (term4[i] == symb[i]) {
					if (next[i]=='')
						tabl2 += "<td>∅</td>";
					else
						tabl2 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (term4[i] !== symb[i]){
					tabl2 += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl2 += "<td>∅</td>"
				}
			}
		}
		else{
			tabl2 += "<td>" + state8[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term4.length; i++) {
				// console.log(i)
				// console.log("term", term2[i])
				// console.log("symb", symb[i])
				// console.log("next", next[i])
				if (term4[i] == symb[i]) {
					if (next[i]=='')
						tabl2 += "<td>∅</td>";
					else
						tabl2 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (term4[i] !== symb[i]){
					tabl2 += "<td>∅</td>"
					// console.log("before assign " + symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
					// console.log("after assign " + symb[i+1])
				}
				else if (symb[i]=='e'){
					tabl2 += "<td>∅</td>"
				}
			}
		}
  }

  /////////////////////////////////////////
  //DRAW TABLE FOR SIMPLIFY DFA WITHOUT RENAME///////////
  /////////////////////////////////////////
  
  var ftr = [];
  console.log(ftr)

  var tmp = new Production();
  console.log(full_dfa_transitions)
  for (var i=0; i<full_dfa_transitions.length; i++) {
      tmp.setProperties(full_dfa_transitions[i].getCurrentState(), full_dfa_transitions[i].symbol, full_dfa_transitions[i].getNextState());
      console.log(full_dfa_transitions[i].getCurrentState(), full_dfa_transitions[i].symbol, full_dfa_transitions[i].getNextState())
      console.log(tmp)
      ftr.push(tmp);
      tmp = new Production();
  }

  console.log(ftr);
  var states = getAllComb(regular.getNonTerminals());
  for (var i=0; i<states.length; i++) {
      states[i] = combineStates(states[i])
  }
  console.log(states)
  var statesEnum = new Object();
  for (var i = 0; i<states.length; i++){
      statesEnum[states[i]] = String.fromCharCode(65+i)
  }
  statesEnum['Z'] = 'Z';

  console.log(Object.values(statesEnum));

  for (var i=0; i<Object.keys(statesEnum).length; i++) {
    console.log(Object.keys(statesEnum)[i]);
    if (final.some(function(v) { return Object.keys(statesEnum)[i].indexOf(v) >= 0; }) && final.some(function(v) { return Object.keys(statesEnum)[i] != v; })) {
      regular.pushFinalVar(Object.values(statesEnum)[i]);
    }
  }
  
  console.log(Object.keys(statesEnum))
  for (var i=0; i<ftr.length; i++){
    ftr[i].currentState = Object.values(statesEnum)[getKeyByValue(Object.keys(statesEnum), ftr[i].currentState)];
    ftr[i].nextState = Object.values(statesEnum)[getKeyByValue(Object.keys(statesEnum), ftr[i].nextState)];
  }
  var sta = []
  var te = []

  for (var i = 0; i<ftr.length; i++){
    sta.push(ftr[i].currentState)
    te.push(ftr[i].symbol)
  }

  var sta2 = [...new Set(sta)]
  var te2 = [...new Set(te)]
  sta2 = sta2.sort()
  te2 = te2.sort()
  console.log(sta2)
  console.log(te2)

  var dfa = {}
  for (var i = 0; i<sta2.length; i++){
    console.log(sta2.length)
    var rsta = [];
    var sta3 = sta2[i];
    dfa[sta3] = {};
    for (var j = 0; j<ftr.length; j++){
      if (sta3 == ftr[j].currentState){
        var path2 = ftr[j].symbol;
        var k = j + 1;
        if (k < ftr.length){
          if (ftr[j].symbol == ftr[k].symbol){
            rsta.push(ftr[j].nextState);
            dfa[sta3][path2] = rsta;
            rsta = [];
          }
          else if (ftr[j].symbol != ftr[k].symbol){
            rsta.push(ftr[j].nextState);
            dfa[sta3][path2] = rsta;
            console.log(rsta);
            rsta = [];
          }
        }
        else {
          rsta.push(ftr[j].nextState)
          dfa[sta3][path2] = rsta;
          console.log(rsta);
          rsta = [];
        }
      }
    }
  }

  var tabl = "<table class = 'tabl';><tr>";
  tabl += "<h5>" + "Transition Table" + "</h5>";
  tabl += "<td>" + "DFA" + "</td>";

  var start = regular.getStartVar();
  var final = regular.getFinalVar();

  var state5 = Object.keys(dfa)
  var tr1 = Object.values(dfa)

  console.log(Object.keys(tr1[0]))

  for (var i = 0; i<term2.length; i++){
		tabl += "<td>" + term2[i] + "</td>";
  }

  for (var j = 0; j<tr1.length; j++){
    tabl += "<tr>"

    var symb = Object.keys(tr1[j]);
		var next = Object.values(tr1[j]);

    var fin = state5[j];
    //console.log(fin)
    //onsole.log(typeof(fin))
    //console.log(final.some(f => fin.includes(f)))

    if (state5[j] == start && final.indexOf(state5[j]) > -1){
			tabl += "<td>" + ">*" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term2.length; i++) {  // each state
				// console.log(i)
				// console.log("f&s term", term2[i])
				// console.log("f&s symb", symb[i])
				// console.log("f&s next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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
		else if (state5[j] == start){
			tabl += "<td>" + ">" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("s term", term2[i])
				// console.log("s symb", symb[i])
				// console.log("s next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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
		else if (final.some(f => fin.includes(f))){
			tabl += "<td>" + "*" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("f term", term2[i])
				// console.log("f symb", symb[i])
				// console.log("f next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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
			tabl += "<td>" + state5[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<term2.length; i++) {
				// console.log(i)
				// console.log("term", term2[i])
				// console.log("symb", symb[i])
				// console.log("next", next[i])
				if (term2[i] == symb[i]) {
					if (next[i]=='')
						tabl += "<td>∅</td>";
					else
						tabl += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
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

  /////////////////////////////////////////
  //DRAW TABLE FOR SIMPLIFY DFA AFTER RENAME///////////
  /////////////////////////////////////////
  var trr = [];
  console.log(trr)

  var tmp = new Production();
  console.log(dfa_transitions)
  for (var i=0; i<dfa_transitions.length; i++) {
      tmp.setProperties(dfa_transitions[i].getCurrentState(), dfa_transitions[i].symbol, dfa_transitions[i].getNextState());
      console.log(dfa_transitions[i].getCurrentState(), dfa_transitions[i].symbol, dfa_transitions[i].getNextState())
      console.log(tmp)
      trr.push(tmp);
      tmp = new Production();
  }
  console.log(trr);
  var states = getAllComb(regular.getNonTerminals());
  for (var i=0; i<states.length; i++) {
      states[i] = combineStates(states[i])
  }
  console.log(states)
  var statesEnum = new Object();
  for (var i = 0; i<states.length; i++){
      statesEnum[states[i]] = String.fromCharCode(65+i)
  }
  statesEnum['Z'] = 'Z';

  console.log(Object.values(statesEnum));

  for (var i=0; i<Object.keys(statesEnum).length; i++) {
    console.log(Object.keys(statesEnum)[i]);
    if (final.some(function(v) { return Object.keys(statesEnum)[i].indexOf(v) >= 0; }) && final.some(function(v) { return Object.keys(statesEnum)[i] != v; })) {
      regular.pushFinalVar(Object.values(statesEnum)[i]);
    }
  }
  
  console.log(Object.keys(statesEnum))
  for (var i=0; i<trr.length; i++){
    trr[i].currentState = Object.values(statesEnum)[getKeyByValue(Object.keys(statesEnum), trr[i].currentState)];
    trr[i].nextState = Object.values(statesEnum)[getKeyByValue(Object.keys(statesEnum), trr[i].nextState)];
  }
  console.log(trr);

  var sta = []
  var te = []

  for (var i = 0; i<trr.length; i++){
    sta.push(trr[i].currentState)
    te.push(trr[i].symbol)
  }

  var sta2 = [...new Set(sta)]
  var te2 = [...new Set(te)]
  sta2 = sta2.sort()
  te2 = te2.sort()
  console.log(sta2)
  console.log(te2)

  var dfa = {}
  for (var i = 0; i<sta2.length; i++){
    console.log(sta2.length)
    var rsta = [];
    var sta3 = sta2[i];
    dfa[sta3] = {};
    for (var j = 0; j<trr.length; j++){
      if (sta3 == trr[j].currentState){
        var path2 = trr[j].symbol;
        var k = j + 1;
        if (k < trr.length){
          if (trr[j].symbol == trr[k].symbol){
            rsta.push(trr[j].nextState);
            dfa[sta3][path2] = rsta;
            rsta = [];
          }
          else if (trr[j].symbol != trr[k].symbol){
            rsta.push(trr[j].nextState);
            dfa[sta3][path2] = rsta;
            console.log(rsta);
            rsta = [];
          }
        }
        else {
          rsta.push(trr[j].nextState)
          dfa[sta3][path2] = rsta;
          console.log(rsta);
          rsta = [];
        }
      }
    }
  }

  console.log(dfa)


  var tabl3 = "<table class = 'tabl3';><tr>";
  tabl3 += "<h5>" + "Transition Table" + "</h5>";
  tabl3 += "<td>" + "DFA" + "</td>";

  var start = regular.getStartVar();
  var final2 = regular.getFinalVar();

  var sta4 = Object.keys(dfa)
  var trr1 = Object.values(dfa)

  console.log(Object.keys(trr1[0]))

  for (var i = 0; i<te2.length; i++){
		tabl3 += "<td>" + te2[i] + "</td>";
  }

  for (var j = 0; j<trr1.length; j++){
    tabl3 += "<tr>"

    var symb = Object.keys(trr1[j]);
		var next = Object.values(trr1[j]);

    var fin = sta4[j];

    if (sta4[j] == start && final.indexOf(sta4[j]) > -1){
			tabl3 += "<td>" + ">*" + sta4[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<te2.length; i++) {  // each state
				// console.log(i)
				// console.log("f&s term", term2[i])
				// console.log("f&s symb", symb[i])
				// console.log("f&s next", next[i])
				if (te2[i] == symb[i]) {
					if (next[i]=='')
						tabl3 += "<td>∅</td>";
					else
						tabl3 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (te2[i] !== symb[i]){
					tabl3 += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl3 += "<td>∅</td>"
				}
			}
		}
		else if (sta4[j] == start){
			tabl3 += "<td>" + ">" + sta4[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<te2.length; i++) {
				// console.log(i)
				// console.log("s term", term2[i])
				// console.log("s symb", symb[i])
				// console.log("s next", next[i])
				if (te2[i] == symb[i]) {
					if (next[i]=='')
						tabl3 += "<td>∅</td>";
					else
						tabl3 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (te2[i] !== symb[i]){
					tabl3 += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl3 += "<td>∅</td>"
				}
			}
		}
		else if (final.some(f => fin.includes(f))){
			tabl3 += "<td>" + "*" + sta4[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<te2.length; i++) {
				// console.log(i)
				// console.log("f term", term2[i])
				// console.log("f symb", symb[i])
				// console.log("f next", next[i])
				if (te2[i] == symb[i]) {
					if (next[i]=='')
						tabl3 += "<td>∅</td>";
					else
						tabl3 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (te2[i] !== symb[i]){
					tabl3 += "<td>∅</td>"
					// console.log(symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
				}
				else if (symb[i]=='e'){
					tabl3 += "<td>∅</td>"
				}
			}
		}
		else{
			tabl3 += "<td>" + sta4[j].replace(/[\])}[{(,]/g, '') + "</td>";
			for (var i = 0; i<te2.length; i++) {
				// console.log(i)
				// console.log("term", term2[i])
				// console.log("symb", symb[i])
				// console.log("next", next[i])
				if (te2[i] == symb[i]) {
					if (next[i]=='')
						tabl3 += "<td>∅</td>";
					else
						tabl3 += "<td>{" + next[i][0].replace(/[\])}[{(,]/g, '') + "}</td>";
				}
				else if (te2[i] !== symb[i]){
					tabl3 += "<td>∅</td>"
					// console.log("before assign " + symb[i+1])
					symb.splice(i+1,0,symb[i])
					next.splice(i+1,0,next[i])
					// console.log("after assign " + symb[i+1])
				}
				else if (symb[i]=='e'){
					tabl3 += "<td>∅</td>"
				}
			}
		}
  }
  document.getElementById('rcorners2').innerHTML = tabl2 + "</tr></table>" + tabl + "</tr></table>" + tabl3 + "</tr></table>";
}



function isMultiState(state) {
  state = state.toString();
  return state.startsWith("{") && state.endsWith("}");
}

function separateStates(state) {
  if (isMultiState(state)) {
    return state.substring(1, state.length - 1).split(",");
  } else {
    return state;
  }
}

function combineStates(states) {
  if (!Array.isArray(states)) {
    throw new Error("Array expected for combineStates() function");
  }

  // Remove null entries from array
  states = states.filter(function (e) {
    return e != null;
  });

  if (states.length > 0 && Array.isArray(states[0])) {
    console.warn("Sub-arrays are not expected for combineStates() function");
    states = states[0];
  }

  if (states.length === 0) return null;

  states.sort();

  if (states.length === 1) return states[0].toString();

  //console.log("-- Combining --");
  //console.log(states);
  //console.log("Combine length: " + states.length);

  var state = "{";
  for (var i = 0; i < states.length; i++) {
    state += states[i] +',';
  }
  state = state.trim().replace(/,+$/, "");
  state += "}";

  //console.log("Return " + state);
  //console.log("----");

  return state;
}

function formatDotState(state_str) {
  state_str = state_str.toString();
  if (isMultiState(state_str)) {
    state_str = state_str.substring(1, state_str.length - 1);
    state_str = state_str.replace(/,/g, "");
    return state_str;
  } else {
    return state_str;
  }
}

function getAllComb(arr){
  var fn = function(n, src, got, all) {
    if (n == 0) {
        if (got.length > 0) {
            all[all.length] = got;
        }
        return;
    }
    for (var j = 0; j < src.length; j++) {
        fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  }
  var all = [];

  for (var i = 0; i < arr.length; i++) {
      fn(i, arr, [], all);
  }
  all.push(arr);

  return all;
}