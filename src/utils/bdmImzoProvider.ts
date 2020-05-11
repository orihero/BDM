import IntentLauncher from "react-native-intent-launcher";

let api_key =
	"86E2F10BA6CD237ADA76579102E1FD147561C390055B062FE5AC49957B1D1A54A266EF04A0E3C9AF6DFD65104E78B08524FF3FA769FDAB47C49DFEC1021A77D4";
let serial_number = "number";
let message = `{
                    "tin":"566584586",

                    "fullName":"BARATOV BEGZOD RUSTAM O‘G‘LI",
                    "organization":"BARATOV BEGZOD RUSTAM O‘G‘LI"
				   }`;

/**
 *
 * @param append_pkcs7 Message ti sign
 * @returns Object : {pkcs7,resultCode}
 */
interface SignResult {
	pkcs7: string;
	resultCode: Number;
	signature: string;
}

interface SignProps {
	append_pkcs7?: string;
}

interface AttachProps {
	append_pkcs7: string;
	tst: string;
}

export let sign: Promise<SignResult> = (append_pkcs7: string) => {
	let obj = {
		packageName: "uz.yt.eimzo",
		className: "uz.yt.eimzo.activity.MainActivity",
		serial_number,
		api_key,
		message: append_pkcs7 ? append_pkcs7 : message
	};
	return IntentLauncher.startActivity(obj);
};

export let attach: Promise<SignResult> = (
	append_pkcs7: string,
	tst: string
) => {
	let obj = {
		packageName: "uz.yt.eimzo",
		className: "uz.yt.eimzo.activity.MainActivity",
		serial_number,
		api_key,
		append_pkcs7,
		tst
	};
	return IntentLauncher.attachTimestamp(obj);
};
