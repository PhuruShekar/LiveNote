//linguisticsCall.js
module.exports = 
{
    formPairs: function(phrases1, phrases2) {
        
            
            if (phrases1[0] === "default" || phrases2[0] === "default") {
                console.log("Words not processed yet");
                return;
            }
            
            var similarityMatrix = new Array(phrases1.length);
            for (var i = 0; i < phrases1.length; i++) {
                similarityMatrix[i] = new Array(phrases2.length);
            }
            
            //console.log(phrases1);
            //console.log(phrases1.length);
            //console.log(phrases2);
            //console.log(phrases2.length);
            //console.log("Ignore Above");
            
            for (var i = 0; i < phrases1.length; i++) {
                //console.log(i);
                for (var j = 0; j < phrases2.length; j++) {
                    //console.log("   "+j);
                    
                    //I have no idea what i just did here
                    // let result = (phrases1[i] + ' ' + phrases2[j])
                    //  .split(' ')
                    //  .filter(
                    //      (w,i,words) => i === words.findIndex(v => v.toUpperCase() === w.toUpperCase())
                    //      ).join(' ')
                    // console.log("result", result);
                    // var words1 = phrases1[i].toString().split(/\s+/g);
                    // var words2 = phrases2[j].toString().split(/\s+/g);
                    // result = result.toString().split(/\s+/g);
                    
                    //console.log(words1 + " : " + words2 + " : " + result);
                    
                    //console.log("words1[0].length " + words1[0].length + "=" + words1[0]);
                    //console.log("words2.length " + words2.length + "=" + words2);
                    
                    
                    // determine the number of elements in the union
                    var obj = {};
                    for (var m = phrases1[i].length-1; m >= 0; -- m)
                        obj[phrases1[i][m]] = phrases1[i][m];
                    for (var m = phrases2[j].length-1; m >= 0; -- m)
                        obj[phrases2[j][m]] = phrases2[j][m];
                    var res = [];
                    for (var k in obj) {
                        if (obj.hasOwnProperty(k)) // <-- optional
                            res.push(obj[k]);
                    }
                    
                    //counter counts how many in common between the phrases
                    var inCommon = 0;
                    for (var m = 0; m < phrases1[i].length; m++) {
                        //console.log("m=", m)
                        for (var n = 0; n < phrases2[j].length; n++) {
                            console.log(phrases1[i] + ";; "+ phrases2[j]);
                            if (phrases1[i][m].toLowerCase() === phrases2[j][n].toLowerCase()) {
                                //console.log('word '+phrases1[i][m]+' was found in both strings');
                                inCommon++;
                            }
                        }
                    }
                    console.log("score======"+inCommon/res.length);
                    similarityMatrix[i][j] = 1- inCommon/res.length;
                }
            }
            
            var pairs = munkres(similarityMatrix);
        
            return pairs; //coordinates of the pairings, should be a nice mapping
        },

//==========================================================

   getPhrases: function(string) {
        var params = {
            
        };

        
            var sentence = string; 
            var body = "{'language' : 'en','analyzerIds' : ['4fa79af1-f22c-408d-98bb-b7d7aeef7f04', '22a6b758-420f-4745-8a3c-46835a67c0d2'],'text' : '" + sentence + "'}";
            
            $.ajax({
                url: "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze?" + $.param(params),
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "6bf14c12f7ce4a23b99a49fd51f56058");
                },
                type: "POST",
                // Request body
                data: body,
            })
            .done(function (data) {
                var first = data[0];
                var second = data[1];
                var result = first.result;
                var x = result[0];
                var tree = data[1].result[0];
                console.log(data);
                console.log(result);
                //console.log(x);
                console.log(tree);
                var depth = 0;
                
                    //remove whitespaces
                    //tree = tree.replace(/\s+/g, '');
                    //console.log(tree);
                    
                    
                    var n = tree.indexOf("TOP");
                    if (n==-1) {
                        console.log("TOP does not exist");
                    }
                    var depth = 0;
                    var phrases = [];
                    var batch = [];
                    //phrases[phrases.length] = something
                    var flag = false;
                    
                    
                    for (var i=0;i<tree.length;i++) {
                        //console.log(depth)
                        var char = tree.charAt(i);
                        if (char=="(") {
                            depth++;
                        } else if (char==")") {
                            depth--;
                        } else if (isLetter(char) || isNumber(char)){
                            //check if the word this starts with is either NP, something with V, or PP
                            var j = 0;
                            while (true) {
                                if (!(isLetter(tree.charAt(i+j+1)) || isNumber(tree.charAt(i+j+1)))) {
                                    break;
                                }
                                j++;
                            } //the word starts at index i and ends at index i+j
                            var word = tree.substring(i,i+j+1);
                            //console.log(":"+word+":");
                            if (sentence.includes(word)) {
                                batch[batch.length] = word;
                            } else if (depth == 3) {
                                if (flag==true) {
                                //console.log("batch goes in  ");
                                phrases[phrases.length] = batch;
                                batch = [];
                            } else {
                                flag = true;
                            }
                        }
                        i=i+j;
                    } else if (char==" " || char==".") {
                        continue;
                    } else {
                        console.log("unhandled character " + char + " at " + i);
                    }
                }
                
                phrases[phrases.length] = batch;
                batch = [];
                
                console.log("Final Results");
                for (var k=0; k<phrases.length; k++){
                    console.log(phrases[k]);
                }
                phrases1 = phrases.slice();
                return phrases;
            })
            .fail(function () {
                alert("error");
            });
    },
  
    isLetter: function(str) {
        return str.length === 1 && /^[A-Z]$/i.test(str);
    },

    isNumber: function(str) {
        return str.length === 1 && /^[0-9]$/i.test(str);
    },
};
