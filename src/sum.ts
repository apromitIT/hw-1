const sum = (...nums: any[]) => {

	let sum: number = 0
	if (nums.length < 2) {
			 throw new Error('INVALID_ARGUMENTS_COUNT')    
					
	} else {
			for (let i = 0; i < nums.length; i++) {
					if (typeof nums[i] != 'number') {
							throw new Error('INVALID_ARGUMENT')
					} else sum = sum + nums[i]               
					
			}
	}
return sum;
};

export default sum;
