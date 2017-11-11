
//the Score functions should return what the user should gain in function due to their contribution and edit actions
function contributionScore(words, totalWords, time, supply, scalingFactor=1) {
	//the score should be within a reasonable range
	return (words/totalWords)*(Math.pow(e, -time*supply/10)+0.5);
	
}

function editScore(arrayContributions, arrayDomainSize, time, supply, scalingFactor=)1 {
	//score should be within a reasonable range
	var score = 0;
	for (i=0; i<arrayContributions.length; i++) {
		score += arrayContributions[i]/arrayDomainSize[i];
	}
	return score * ((1/(1+Math.pow(e, -x))-0.5)*Math.pow(e, -y)+.5);
}