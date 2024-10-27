const strToBool = (value: string) => {
	if (value && typeof value === "string") {
		if (value.toLowerCase() === "true") return true;
		if (value.toLowerCase() === "false") return false;
	}
	return value;
};

export default strToBool;
