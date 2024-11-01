const generatePrefix = async (shirt_key: string, shirt_size: string) => {
	return shirt_key + shirt_size;
};

export default generatePrefix;
