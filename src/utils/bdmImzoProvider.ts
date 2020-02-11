import IntentLauncher from 'react-native-intent-launcher';

let api_key =
    '86E2F10BA6CD237ADA76579102E1FD147561C390055B062FE5AC49957B1D1A54A266EF04A0E3C9AF6DFD65104E78B08524FF3FA769FDAB47C49DFEC1021A77D4';
let serial_number = 'number';
let message = `{
                    "tin":"566584586",

                    "fullName":"BARATOV BEGZOD RUSTAM O‘G‘LI",
                    "organization":"BARATOV BEGZOD RUSTAM O‘G‘LI"
                   }`;

export let sign = (input) => {
    return IntentLauncher.startActivity({
        packageName: 'uz.yt.eimzo',
        className: 'uz.yt.eimzo.activity.MainActivity',
        serial_number,
        api_key,
        message: input ? input : message
    });
};