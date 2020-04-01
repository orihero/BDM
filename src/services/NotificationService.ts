import { warnUser } from "./../utils/warn";
import { AppState, Clipboard } from "react-native";
import firebase from "react-native-firebase";
import { requests } from "../api/requests";
// import { orderLoaded } from "./../redux/actions/order";

let store = null;

let tokenProvider = () => {
	return store.token;
};

function setState(state) {
	store = state;
}

export enum NotificationActionTypes {
	NewCall = "new_call",
	CallCancelled = "call_canceled",
	DriverArrived = "call_almost_arrived",
	CallCompleted = "call_completed"
}

let notificationConsumer = async notification => {
	console.warn(notification.data);
	switch (notification.data.actionType) {
		case "accepted": {
		}
		default:
			console.warn("UNHANDLED ACTION");
			console.warn(notification.data);
			break;
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
	createNotificationListeners(channelId);
}

const createNotificationListeners = async channelId => {
	try {
		let notifications = firebase.notifications();
		notifications.onNotification(async notification => {
			notification.android.setChannelId(channelId).setSound("default");
			firebase.notifications().displayNotification(notification);
			if (AppState.currentState.match(/active/)) {
				notificationConsumer(notification);
				clearBadge();
			}
		});
		notifications.onNotificationOpened(async notification => {
			// Process data of the notification
			console.warn(notification.notification.data);
			notificationConsumer(notification);
			clearBadge();
		});
	} catch (error) {
		console.warn(error);
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
			message = `(ID ${payload.data.id}) от ${payload.data.companyName} ( ИНН ${payload.data.tin} ) смотрите полученные`;
		} else if (payload.data.message === "20") {
			title = `Ваш документ принять`;
			message = `(ID ${payload.data.id}) от ${payload.data.companyName} ( ИНН ${payload.data.tin} ) смотрите подписанные`;
		} else if (payload.data.message === "30") {
			title = `Ваш документ отказан`;
			message = `(ID ${payload.data.id}) от ${payload.data.companyName} ( ИНН ${payload.data.tin} ) смотрите отказанные`;
		}
		const notification = new firebase.notifications.Notification()
			.setNotificationId(payload.messageId)
			.setTitle(title)
			.setBody(message)
			.android.setChannelId("insider")
			.android.setPriority(firebase.notifications.Android.Priority.High)
			.setSound("default");
		await firebase.notifications().displayNotification(notification);
		return Promise.resolve();
	} catch (error) {
		warnUser(error.message);
	}
};

export default { init, backgroundPushes, clearBadge, setState, getFcmToken };
