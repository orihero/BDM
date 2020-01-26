/* eslint-disable */
import React from 'react';
import firebase from 'react-native-firebase';
import api from '../api/api';
import {AppState, Clipboard} from 'react-native';

function init() {
  const channel = new firebase.notifications.Android.Channel(
    'insider',
    'insider channel',
    firebase.notifications.Android.Importance.Max,
  ).setDescription('Updates');
  firebase.notifications().android.createChannel(channel);
  checkPermission();
  createNotificationListeners();
}

const createNotificationListeners = async () => {
  let notifications = firebase.notifications();
  notifications.onNotification(async notification => {
    let badge = await notifications.getBadge();
    notification.android
      .setChannelId('insider')
      .setSound('default')
      .setVibrationPattern([300, 1000, 300]);
    firebase.notifications().displayNotification(notification);
    notifications.setBadge(badge + 1);
  });
  notifications.onNotificationOpened(async notification => {
    notifications.setBadge(0);
  });
};

let clearBadge = () => {
  firebase.notifications().setBadge(0);
  firebase.notifications().removeAllDeliveredNotifications();
};

const checkPermission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    getToken();
  } else {
    requestPermission();
  }
};
const getToken = async () => {
  let fcmToken = await firebase.messaging().getToken();
  Clipboard.setString(fcmToken);
  alert("SAVED")
  //   api.auth.setToken(fcmToken).then(res => console.warn(res.data));
};
const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    getToken();
  } catch (error) {
    alert(
      'The app needs permission to send you status of your sold and purchased products!',
    );
  }
};

const backgroundPushes = async message => {
  if (AppState.currentState.match(/active/)) {
    return Promise.resolve();
  }
  const notification = new firebase.notifications.Notification()
    .setNotificationId(message.messageId)
    .setTitle(message.data.title)
    .setBody(message.data.body)
    .android.setChannelId('insider')
    .android.setPriority(firebase.notifications.Android.Priority.High)
    .setSound('default');
  await firebase.notifications().displayNotification(notification);
  return Promise.resolve();
};

export default {init, backgroundPushes, clearBadge};
