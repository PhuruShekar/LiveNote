//mergePhrases.js
module.exports = 
{
    mergePhrases: function(sentence1, sentence2){
            var stru1 = (sentence1+'').split(" ");
            var stru2 = (sentence2+'').split(" ");
            
            var shared = [];
            
        //	console.log("first sentence: " + stru1);
        //	console.log("second sentence: " + stru2);
            
            var start = 0;
            
            for (var i = 0; i < stru1.length; i++) 
            {	
                for(var j = 0;j<stru2.length;j++)
                {	
                    if(stru1[i].toLowerCase()==stru2[j].toLowerCase())
                    {
                        shared.push(stru1[i]);
                        //freqList.push(2);
                        start = j;
                        break;
                    }
                }
            }
            
        // Output the shared array
        //console.log("shared: " + shared);
            
            
            //assuming that stru1 has the priority
            var final = [];
            var count1 = 0;
            var count2 = 0;
            for (var i=0; i<shared.length; i++) 
            {
                while (count1<stru1.length && stru1[count1].toLowerCase()!==shared[i].toLowerCase()) 
                {
           //         console.log("1: "+stru1[count1]);
                    final.push(stru1[count1]);
                    count1++;
                }
                while (count2<stru2.length && stru2[count2].toLowerCase()!==shared[i].toLowerCase()) 
                {
           //         console.log("2: " + stru2[count2]);
                    final.push(stru2[count2]);
                    count2++;
                }
           //     console.log("3: "+shared[i]);
                final.push(shared[i]);
                count1++;
                count2++;
            }
            
            while (count1<stru1.length) 
            {
                final.push(stru1[count1]);
                count1++;
            }
            while (count2<stru2.length) 
            {
                final.push(stru2[count2]);
                count2++;
            } //do the ending condition
            
        //	console.log("final ordering: " + final);
        
        //	console.log("shared: " + shared);
            
            //frequency array
            var freqArray = [];
            for (var i=0; i<final.length; i++) 
            {
                if (shared.includes(final[i])) { // the assumption is that there are no two exact same words in a phrase
                    freqArray.push(2);
                } else {
                    freqArray.push(1);
                }
            }
            
        //	console.log("freqArray: " + freqArray);
            return final;	
    }
};

