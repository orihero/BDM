import { fetchDocuments } from "./../redux/actions/documents";
import { warnUser } from "./../utils/warn";
import { AppState, Clipboard, Alert } from "react-native";
import firebase, { Firebase } from "react-native-firebase";
import { requests } from "../api/requests";
import { Notification } from "react-native-firebase/notifications";
// import { orderLoaded } from "./../redux/actions/order";

let store = null;

let tokenProvider = () => {
	return store.token;
};

function setState(state) {
	store = state;
}

let notificationConsumer = async notification => {
	try {
		let data = JSON.parse(notification.notification.android.tag);
		// console.log();

		let status;
		switch (data.message) {
			case "20":
				status = 30;
				break;
			case "30":
				status = 60;
				break;
			default:
				status = 10;
				break;
		}
		let payload = {
			status,
			notification: { id: data.id },
			boxType: data.message === "10" ? 1 : 2
		};
		store.dispatch(fetchDocuments(payload));
	} catch (error) {
		console.log(error);
	}
};

function init() {
	const channel = new firebase.notifications.Android.Channel(
		"insider",
		"insider channel",
		firebase.notifications.Android.Importance.Max
	).setDescription("Updates");
	let channelId = firebase.notifications().android.createChannel(channel);
	checkPermission();
	console.log("CREATING LISTENER");
	createNotificationListeners(channelId);
}

const createNotificationListeners = async channelId => {
	try {
		console.log("CREATING ON NOTIFICATION ");
		let notifications = firebase.notifications();
		notifications.onNotification(async notification => {
			alert("RECIVED");

			notification.android
				.setChannelId(channelId)
				.setSound("default")
				.android.setPriority(
					firebase.notifications.Android.Priority.High
				);
			firebase.notifications().displayNotification(notification);
			console.log(notification);
			if (AppState.currentState.match(/active/)) {
				notificationConsumer(notification);
				clearBadge();
			}
		});
		notifications.onNotificationOpened(async notification => {
			// Process data of the notification
			// console.log(notification.notification.data);
			notificationConsumer(notification);
			notifications.cancelNotification(
				notification.notification.notificationId
			);
			console.log({
				notification: notification.notification.notificationId
			});

			notifications.removeDeliveredNotification(
				notification.notification.notificationId
			);
			clearBadge();
		});
	} catch (error) {
		console.log(error);
	}
};

let clearBadge = () => {
	firebase.notifications().removeAllDeliveredNotifications();
};

const checkPermission = async () => {
	try {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			getToken();
		} else {
			requestPermission();
		}
	} catch (error) {
		console.warn(error);
	}
};
const getToken = async () => {
	try {
		let fcmToken = await firebase.messaging().getToken();
	} catch (error) {
		console.warn(error);
	}
};

const getFcmToken = async () => {
	try {
		let fcmToken = await firebase.messaging().getToken();
		return fcmToken;
	} catch (error) {
		return error;
	}
};

const requestPermission = async () => {
	try {
		await firebase.messaging().requestPermission();
		getToken();
	} catch (error) {
		alert(
			"The app needs permission to send you status of your sold and purchased products!"
		);
	}
};

const backgroundPushes = async payload => {
	try {
		let title = "",
			message = "";
		if (payload.data.message === "10") {
			title = `Вы получили новый документ`;
			message = `(ID ${payload.data.id}) от ${
				payload.data.companyName
			} ( ИНН ${payload.data.tin} ) смотрите полученные`;
		} else if (payload.data.message === "20") {
			title = `Ваш документ принять`;
			message = `(ID ${payload.data.id}) от ${
				payload.data.companyName
			} ( ИНН ${payload.data.tin} ) смотрите подписанные`;
		} else if (payload.data.message === "30") {
			title = `Ваш документ отказан`;
			message = `(ID ${payload.data.id}) от ${
				payload.data.companyName
			} ( ИНН ${payload.data.tin} ) смотрите отказанные`;
		}
		console.log(payload.data);
		const notification = new firebase.notifications.Notification()
			.setNotificationId(payload.messageId)
			.setTitle(title)
			.setBody(message)
			.android.setChannelId("insider")
			.android.setPriority(firebase.notifications.Android.Priority.High)
			.setSound("default")
			.android.setTag(JSON.stringify(payload.data));
		return firebase.notifications().displayNotification(notification);
	} catch (error) {
		warnUser(error.message);
	}
};

export default { init, backgroundPushes, clearBadge, setState, getFcmToken };
