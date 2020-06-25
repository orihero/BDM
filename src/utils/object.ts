export const getObjectProperty = (obj, path) => {
	if (!obj || !path) {
		return null;
	}
	let paths = path.split(".");
	let temp = obj;
	for (let key of paths) {
		if (!temp[key]) {
			return null;
		}
		temp = temp[key];
	}
	return temp;
};

export let normalizeFilters = data => {
	return Object.keys(data).reduce((prev, key) => {
		return `${prev + key}=${data[key] ? data[key] : ""}&`;
	}, "?");
};

export let removeKeyFromObject = (obj, keyToFind) => {
	return Object.keys(obj).reduce((prev, current, index) => {
		if (keyToFind !== current) return { ...prev, [current]: obj[current] };
		return prev;
	}, {});
};

/**
 * Formats the price string
 * @param str
 * The value to be formatted
 * @param chunk
 * (OPTIONAL) Number of digits in one chunk
 * @example
 * normlaizePrice("1000000.00") = "1 000 000.00"
 */
export let normalizePrice = (str: string, chunk: number = 3) => {
	if (!str) {
		return "0";
	}
	//* Localization check
	if (str.indexOf(".") !== -1) {
		//* Seperate decimal and inregral parts
		let [decimalPart, integralPart] = str.split(".");
		//* Make it easy to append to the result
		let reverseDecimal = decimalPart
			.split("")
			.reverse()
			.join("");

		//* Result to store
		let result = "";
		for (let i = 0; i < reverseDecimal.length; i += chunk) {
			//* Apped three digits
			result += reverseDecimal.slice(i, i + chunk);
			//* Append seperating space only if it is not last chunk
			if (i + chunk < reverseDecimal.length) result += " ";
		}
		//* The `.` has been removed so we add it
		return (
			result
				.split("")
				.reverse()
				.join("") +
			"." +
			integralPart
		);
	} else {
		let reverseDecimal = str
			.split("")
			.reverse()
			.join("");
		//* Result to store
		let result = "";
		for (let i = 0; i < reverseDecimal.length; i += chunk) {
			//* Apped three digits
			result += reverseDecimal.slice(i, i + chunk);
			//* Append seperating space only if it is not last chunk
			if (i + chunk < reverseDecimal.length) result += " ";
		}
		return result
			.split("")
			.reverse()
			.join("");
	}
};

export function convertToTypeOf(typevar: string, input: string) {
	let type = typeof typevar;
	switch (type) {
		case "string":
			return String.bind(null, input)();
		case "number":
			return Number.bind(null, input)();
		case "boolean":
			return input == "true" ? true : false;
		default:
			return input;
	}
}
